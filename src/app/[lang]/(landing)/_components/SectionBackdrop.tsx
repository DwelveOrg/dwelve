"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * The ambient layer of the landing page's muted bands.
 *
 * The page's middle breathes on a two-section rhythm: flat ground, then a muted
 * band. This component is what makes the bands *sheets* — the product's own
 * paper, quietly alive — rather than tinted rectangles. The styles live in
 * `globals.css` under "Section sheets", together with the doctrine they answer
 * to (a backdrop must depict the product's own object or it must not exist)
 * and the ink/alpha ceilings they inherit from the measured precedents.
 *
 * Three figures, one per band, each tied to its section's argument:
 *
 * - `review`  — ruled paper with a slow band of brand light reading down it,
 *               the way the teacher-control mock's cursor reads the options.
 * - `flow`    — faint ruling with miniature answer sheets rising through it,
 *               each graded mid-flight by a drawn check: the product's loop
 *               (submitted → marked) moving between the roles below.
 * - `measure` — graph paper and the score-distribution curve drawing itself,
 *               echoing the histogram in the analytics panel above it.
 *
 * The host section must be `relative isolate`; this layer sits at `-z-10`,
 * which paints above the section's own background but under all its content.
 */
type Variant = "review" | "flow" | "measure";

export default function SectionBackdrop({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("sheet-backdrop -z-10", className)}>
      {variant === "review" ? (
        <>
          <span className="sheet-rules" />
          <span className="sheet-scan" />
        </>
      ) : null}

      {variant === "flow" ? (
        <>
          <span className="sheet-rules" data-weight="faint" />
          <span className="sheet-flyers">
            {FLYERS.map((flyer) => (
              <MiniSheet key={flyer.x} flyer={flyer} />
            ))}
          </span>
        </>
      ) : null}

      {variant === "measure" ? (
        <>
          <span className="sheet-grid" />
          <DistributionCurve />
        </>
      ) : null}
    </div>
  );
}

/*
 * The three sheets in flight — one per role column, sized, phased and tilted
 * by hand rather than randomised so server and client always agree. The x
 * positions keep the outer two in the band's gutters; the middle one rises
 * through the open strip under the centred heading and fades before it gets
 * there. All values land in `--flyer-*` custom properties that the CSS
 * choreography (globals.css, "Answer sheets in flight") reads.
 */
type Flyer = {
  x: string;
  w: number;
  dur: string;
  delay: string;
  top: string;
  tilt: string;
  tiltEnd: string;
  drift: string;
};

const FLYERS: readonly Flyer[] = [
  { x: "5%", w: 64, dur: "34s", delay: "-6s", top: "78%", tilt: "-4deg", tiltEnd: "2deg", drift: "20px" },
  { x: "47%", w: 84, dur: "41s", delay: "-22s", top: "82%", tilt: "2deg", tiltEnd: "-3deg", drift: "-16px" },
  { x: "90%", w: 58, dur: "29s", delay: "-14s", top: "74%", tilt: "-2deg", tiltEnd: "4deg", drift: "14px" },
];

/** Row geometry for the miniature OMR sheet: y centres of the four options. */
const SHEET_ROWS = [
  { y: 24, len: 34 },
  { y: 41, len: 28 },
  { y: 58, len: 36 },
  { y: 75, len: 22 },
] as const;

/** The row whose bubble is marked — the same "answer lands on B" beat as the
 *  teacher-control mock two sections up. */
const MARKED_ROW = 1;

function MiniSheet({ flyer }: { flyer: Flyer }) {
  return (
    <svg
      viewBox="0 0 72 92"
      fill="none"
      style={
        {
          "--flyer-x": flyer.x,
          "--flyer-w": `${flyer.w}px`,
          "--flyer-dur": flyer.dur,
          "--flyer-delay": flyer.delay,
          "--flyer-top": flyer.top,
          "--flyer-tilt": flyer.tilt,
          "--flyer-tilt-end": flyer.tiltEnd,
          "--flyer-drift": flyer.drift,
        } as React.CSSProperties
      }
    >
      <rect x="1.5" y="1.5" width="69" height="89" rx="7" stroke="currentColor" strokeWidth="2" />
      {SHEET_ROWS.map((row, index) => (
        <React.Fragment key={row.y}>
          {index === MARKED_ROW ? (
            <circle cx="13" cy={row.y} r="4.5" fill="currentColor" />
          ) : (
            <circle cx="13" cy={row.y} r="4.5" stroke="currentColor" strokeWidth="2" />
          )}
          <line
            x1="24"
            y1={row.y}
            x2={24 + row.len}
            y2={row.y}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </React.Fragment>
      ))}
      {/* Drawn mid-rise by the `flyer-check` timeline: the grading stroke. */}
      <path
        className="flyer-check"
        d="M 22 54 L 34 66 L 57 34"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/*
 * The same shape as the panel's DISTRIBUTION bands (18, 34, 46, 62, 78, 92, 68),
 * one point per band, Catmull-Rom-smoothed and run past both edges so the
 * mask — not the viewBox — is what ends it. It renders as a full-width ribbon
 * in the band's bottom padding, directly under the panel whose histogram it
 * mirrors (`.sheet-curve` records why that strip). Stroke only: filling the
 * area under a decorative curve would be a wash, and washes are what the
 * landing canvas was stripped of.
 *
 * The viewBox matches the strip's own geometry (1440 × 88, the ribbon's fixed
 * height) so the vertical scale is 1:1 and the horizontal distortion at other
 * viewports stays mild. That is also what lets the draw-in work: `pathLength`
 * dash normalisation and `vector-effect: non-scaling-stroke` disagree about
 * units under a non-uniform scale, so the path is authored at natural size
 * and the vector-effect is not used.
 */
const CURVE_PATH =
  "M -30 76 C -8.3 75 43.3 73.1 100 70 C 156.7 66.9 240 61.2 310 57.5 " +
  "C 380 53.8 450 51.7 520 48 C 590 44.4 660 39.7 730 35.6 " +
  "C 800 31.5 870 27.1 940 23.2 C 1010 19.3 1080 10.9 1150 12.2 " +
  "C 1220 13.5 1306.7 26.7 1360 31 C 1413.3 35.3 1451.7 36.8 1470 38";

function DistributionCurve() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      className="sheet-curve"
      viewBox="0 0 1440 88"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        d={CURVE_PATH}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        // Drawn once as the section arrives — the same beat as the histogram
        // bars rising in the panel — then it holds. Reduced motion: simply there.
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
