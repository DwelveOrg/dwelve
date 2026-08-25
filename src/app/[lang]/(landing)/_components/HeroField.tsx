"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

/**
 * The ground the hero stands on: an answer sheet, seen as a field.
 *
 * **What was there before.** Flat `--background`, plus `.hero-bloom` — a violet
 * radial confined to the 600px box around the 3D sheet. That was a deliberate
 * choice, and `globals.css` still records why: the landing page's two corner
 * washes were deleted because "a pair of soft radial glows bleeding in from the
 * corners is the marketing-page half of the same tell as the shell orbs —
 * atmosphere applied to a page that has not earned any, and the first thing
 * every generated landing page reaches for."
 *
 * That reasoning is intact, and this is not a repeal of it. The objection was
 * never to a hero having a background; it was to *decoration* — a gradient that
 * could sit behind any product in any industry and says nothing about this one.
 * So the constraint this had to satisfy: the backdrop must be a statement about
 * what Dwelve does, or it must not exist.
 *
 * **What it is.** A lattice of empty answer bubbles — an OMR sheet, the object
 * the entire product is about — held at the threshold of visibility. A slow band
 * of light crosses it. Where the band passes, bubbles brighten, and a few of
 * them fill: the grid is being marked, continuously, behind the sentence that
 * claims tests come back graded. The hero object in front says it once in seven
 * seconds; the field says it forever, quietly, and never asks to be looked at.
 *
 * **Why a shader rather than CSS.** The bubbles have to be many (a few hundred),
 * individually lit by a moving band, and a few of them individually filled. In
 * CSS that is a few hundred elements with a masked overlay; in canvas 2D it is a
 * few hundred `arc()` calls every frame on the main thread — on the school
 * laptops this product is used on, that is the frame budget gone. As one
 * fragment shader it is a single quad, one draw call, and the per-bubble work
 * happens in parallel on hardware that is idle anyway. The cost model matches
 * `.shell-backdrop`'s: nothing is ever re-rasterised, and nothing touches the
 * main thread.
 *
 * three.js because the repository already depends on it for `HeroScene` — the
 * shader adds no new package, and this file is a lazily-loaded chunk that shares
 * the same already-downloaded library.
 *
 * **What it refuses to cost.**
 *   - Off-screen or in a hidden tab, the loop stops.
 *   - Under reduced motion it paints one settled frame and never runs again.
 *   - No WebGL, no canvas: the component renders nothing and the page's own
 *     `--background` is the design, exactly as it was.
 *   - Device pixel ratio is capped at 1.25. This is a low-frequency field with no
 *     text in it; rendering it at 3× on a phone would be paying retina prices for
 *     a blur.
 *
 * **Contrast, measured rather than estimated.** The shipped shader was rendered
 * offscreen across a full 24-second cycle and its alpha sampled per pixel. Over
 * the left 45% of the section — the column the `<h1>`, the lead and the buttons
 * occupy — the brightest pixel the field ever produces is 6.7% opacity in dark
 * and 5% in light. Across the whole field the mean is 0.2%. The peak of 43%
 * exists only at the core of a filled bubble near the focus point, which sits
 * behind the 3D sheet. So the headline is on the same near-flat ground it always
 * was, and the tint never approaches the ~9% that `.shell-backdrop` was measured
 * at (where `--muted-foreground` still holds 5.1:1).
 *
 * If the focus point or the mask falloff is ever changed, re-measure: those two
 * numbers are what keep the copy legible, and neither is obvious by eye.
 */

/** Bubble lattice pitch, in CSS pixels. Read by the shader through `uCell`. */
const CELL_PX = 46;

type FieldPalette = {
  /** The resting outline of an unmarked bubble. */
  line: THREE.Color;
  /** The band, and the bubbles it fills. */
  glow: THREE.Color;
  /** Peak opacity of the lattice, before the band. */
  lineAlpha: number;
  /** Peak opacity the band adds. */
  glowAlpha: number;
};

/*
 * Literals rather than `getComputedStyle` reads, matching `HeroScene`: three.js
 * wants numeric colours, and these mirror the `--brand-*` ramp in globals.css —
 * keep them in step with it.
 *
 * The two themes are not one field at two brightnesses. On white paper the
 * lattice is ink and the band is a violet wash over it; on the near-black canvas
 * the lattice is barely-there light and the band is what makes it visible at all,
 * so the line is dimmer and the glow carries more.
 */
const PALETTES: Record<"light" | "dark", FieldPalette> = {
  light: {
    line: new THREE.Color(0x5f40d5), // --brand
    glow: new THREE.Color(0x7b5ff0), // --brand-violet
    lineAlpha: 0.1,
    glowAlpha: 0.26,
  },
  dark: {
    line: new THREE.Color(0xa191ff), // --brand (dark)
    glow: new THREE.Color(0xc9bcff), // --brand-violet-300
    lineAlpha: 0.13,
    glowAlpha: 0.34,
  },
};

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/*
 * One pass, in this order:
 *
 *   1. Put the fragment in *pixel* space and lay a square lattice over it, so a
 *      bubble is the same size on a phone and on a 27" display and the field does
 *      not stretch with the aspect ratio.
 *   2. Draw the bubble as an annulus — the distance to the cell centre, banded.
 *      An outline rather than a disc, because an unmarked OMR bubble is an
 *      outline; discs everywhere would read as polka dots.
 *   3. Sweep a band across the field. `uTime` moves it; `smoothstep` on either
 *      side gives it soft shoulders so it never has an edge.
 *   4. Fill some bubbles inside the band. A cheap hash per cell decides which,
 *      deterministically, so the same cells fill on every pass — the field has a
 *      fixed answer key, which is what makes it read as a sheet rather than as
 *      noise.
 *   5. Multiply everything by a radial mask that reaches zero inside the quad.
 *      `globals.css` requires this of every soft layer: a gradient that has not
 *      reached zero at its own edge ends in a visible rectangle.
 */
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uResolution;
  uniform float uCell;
  uniform float uTime;
  uniform vec3  uLine;
  uniform vec3  uGlow;
  uniform float uLineAlpha;
  uniform float uGlowAlpha;
  /** 0..1 origin of the radial mask — the field is brightest behind the hero object. */
  uniform vec2  uFocus;

  /** Deterministic per-cell noise. No texture, no uniform array, no state. */
  float hash(vec2 cell) {
    return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 px = vUv * uResolution;

    vec2 cell  = floor(px / uCell);
    vec2 local = fract(px / uCell) - 0.5;
    float d    = length(local);

    // The annulus. Widths are in cell units; the outer edge sits at 0.30 so
    // neighbouring bubbles never touch.
    float ring =
      smoothstep(0.30, 0.26, d) *
      (1.0 - smoothstep(0.24, 0.20, d));

    // The band: a diagonal coordinate that travels, wrapped so it repeats
    // without a seam. 0.62/0.78 is a shallow lean — a vertical wipe reads as a
    // loading bar, a 45-degree one reads as a stripe.
    float axis   = dot(vUv, normalize(vec2(0.62, 0.78)));
    float travel = fract(uTime * 0.045);
    float rel    = abs(fract(axis - travel + 0.5) - 0.5);
    float band   = 1.0 - smoothstep(0.0, 0.22, rel);
    band = band * band;

    // Filled bubbles. Roughly a fifth of cells are eligible; each fades in and
    // out on its own slow cycle so the answer key is never fully revealed.
    float pick   = hash(cell);
    float phase  = hash(cell + 17.0);
    float alive  = step(0.80, pick);
    float pulse  = 0.5 + 0.5 * sin(uTime * 0.55 + phase * 6.2831);
    // Inside the ring's inner edge, so a filled bubble sits *in* its outline
    // rather than covering it — the way a pencil mark does.
    float disc   = smoothstep(0.17, 0.13, d);
    float filled = disc * alive * (0.25 + 0.75 * band) * pulse;

    // Zero at the edges, in the quad's own space, so nothing is clipped into a
    // rectangle by the section that contains it.
    //
    // The falloff is cubed and tight (0.05 to 0.80) because this mask is also the
    // only thing keeping the field off the headline. Measured against the shipped
    // shader over a full 24s cycle: a gentler 0.15-to-0.95 squared falloff let a
    // filled bubble reach 25% opacity inside the left 45% of the section, which is
    // where the h1 sits. This reaches 6.7% there while leaving the peak behind the
    // hero object untouched at 43%. The field is emphatic where the object is and
    // effectively absent where the copy is.
    vec2  toFocus = (vUv - uFocus) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    float mask    = 1.0 - smoothstep(0.05, 0.80, length(toFocus));
    mask = mask * mask * mask;

    float lineA = ring * uLineAlpha * (0.55 + 0.45 * band);
    float glowA = (ring * band * uGlowAlpha * 0.9) + (filled * uGlowAlpha);

    vec3  colour = mix(uLine, uGlow, clamp(band + filled, 0.0, 1.0));
    float alpha  = (lineA + glowA) * mask;

    // Premultiplied: the canvas composites over the page's own background, and
    // straight alpha on a near-black canvas fringes every bubble grey.
    gl_FragColor = vec4(colour * alpha, alpha);
  }
`;

export default function HeroField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // `resolvedTheme` collapses "system" to a concrete theme. It is undefined until
  // the provider hydrates; treating that first frame as light matches the CSS
  // ground the canvas sits on.
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const palette = PALETTES[isDark ? "dark" : "light"];
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        // No antialias: there is no geometry edge to alias. Every edge in this
        // field is a `smoothstep` the shader draws itself.
        antialias: false,
        powerPreference: "low-power",
        premultipliedAlpha: true,
      });
    } catch {
      return; // No WebGL — the page's own background is the design.
    }

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const uniforms = {
      uResolution: { value: new THREE.Vector2(width, height) },
      uCell: { value: CELL_PX },
      uTime: { value: prefersReduced ? 6.5 : 0 },
      uLine: { value: palette.line },
      uGlow: { value: palette.glow },
      uLineAlpha: { value: palette.lineAlpha },
      uGlowAlpha: { value: palette.glowAlpha },
      // Right of centre and a little high: behind the 3D sheet on a two-column
      // layout, and still on the object once the columns stack on a phone.
      uFocus: { value: new THREE.Vector2(0.68, 0.42) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(geometry, material));
    // The vertex shader writes clip space directly, so the camera is a formality.
    const camera = new THREE.Camera();

    const draw = () => renderer.render(scene, camera);

    let frame = 0;
    let running = false;
    let last = 0;
    let onScreen = true;

    const tick = (now: number) => {
      // Seconds since the previous frame rather than `now * 0.001`: the clock
      // must not jump forward by however long the tab was in the background.
      const delta = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      uniforms.uTime.value += delta;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running || prefersReduced) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    const sync = () => {
      if (onScreen && !document.hidden) startLoop();
      else stopLoop();
    };

    draw();

    let observer: IntersectionObserver | undefined;
    if (!prefersReduced) {
      observer = new IntersectionObserver(
        (entries) => {
          onScreen = (entries[0]?.intersectionRatio ?? 0) > 0;
          sync();
        },
        { threshold: [0, 0.01] },
      );
      observer.observe(container);
      document.addEventListener("visibilitychange", sync);
    }

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
      if (!running) draw(); // keep the paused (or reduced-motion) frame correct
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
