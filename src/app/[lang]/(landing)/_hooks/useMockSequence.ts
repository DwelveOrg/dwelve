"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Drives a mock card through a looping "demo video": an ordered list of phases
 * that plays while the card is in view and then restarts.
 *
 * The LAST phase is treated as the resting/final state. The hook initialises to
 * it and falls back to it whenever the loop isn't running (offscreen, reduced
 * motion, server render). That keeps the finished result as the default — the
 * motion only enhances an already-complete card, so nothing ever ships as a
 * blank mid-animation frame.
 *
 * @param durations  Milliseconds to hold each phase, in order. The loop walks
 *                   the list and wraps back to phase 0. Pass a stable
 *                   (module-level) array so the effect doesn't re-run.
 * @returns `ref` to attach to the card root, and the active phase index.
 */
export function useMockSequence(durations: readonly number[]) {
  const finalPhase = Math.max(0, durations.length - 1);
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(finalPhase);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    // Reduced motion or a degenerate sequence: hold the finished state, no loop.
    if (shouldReduceMotion || durations.length <= 1 || !node) {
      setPhase(finalPhase);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let current = 0;
    let running = false;

    const tick = () => {
      setPhase(current);
      timer = setTimeout(() => {
        current = (current + 1) % durations.length;
        tick();
      }, durations[current]);
    };

    const start = () => {
      if (running) return;
      running = true;
      current = 0;
      tick();
    };

    const stop = () => {
      running = false;
      if (timer) clearTimeout(timer);
      timer = undefined;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
          setPhase(finalPhase); // rest on the finished card when scrolled away
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      stop();
      observer.disconnect();
    };
  }, [durations, finalPhase, shouldReduceMotion]);

  return { ref, phase };
}
