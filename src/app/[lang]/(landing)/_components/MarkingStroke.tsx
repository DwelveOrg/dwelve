"use client";

import React from "react";
import { motion, type Transition } from "motion/react";

/**
 * The grader's mark, drawn under the headline.
 *
 * **Why the hero is allowed another mark at all.** `HeroField` had to answer a
 * standing objection in `globals.css` — that the corner washes were deleted
 * because "atmosphere applied to a page that has not earned any" is the first
 * thing every generated landing page reaches for. It answered it by depicting
 * the product's own object rather than a mood. This is the same answer, one
 * layer up: an underline that lifts into a tick is the gesture a teacher makes
 * on a page, and it lands under the sentence that claims tests come back
 * graded. A luminous swoosh in the brand colour would be the thing that was
 * deleted; this is the product signing its own headline.
 *
 * **Why three paths and not one.** A grader underlines, lifts, and ticks — so
 * the tick is a separate stroke that starts after the underline finishes, not a
 * curl on the end of it. The faint second pass under the main one is what stops
 * a single clean Bezier from reading as a border: hands go over a line twice
 * and never in the same place.
 *
 * The drawing keeps its own aspect ratio (width is set, height follows the
 * `viewBox`), because a tick stretched to fit a wide box shears into a check
 * that no hand could make.
 */

/** The underline: low at the left, drooping, lifting away to the right. */
const UNDERLINE = "M4 9 C 76 19, 172 20, 250 7";
/** The second pass a hand makes without meaning to. */
const UNDERPASS = "M34 15 C 96 22, 158 22, 232 13";
/** Pen down again, and the tick. */
const TICK = "M258 12 L 269 21 L 297 3";

type MarkingStrokeProps = {
  /** Seconds to wait before the underline starts. */
  delay: number;
  /** Paint the finished mark in place, with nothing moving. */
  reduceMotion: boolean;
  className?: string;
};

export default function MarkingStroke({ delay, reduceMotion, className }: MarkingStrokeProps) {
  // Under reduced motion the mark is still part of the composition — it is the
  // page's only visual claim about grading above the fold — so it is painted,
  // not dropped. It simply arrives already drawn.
  const draw = (at: number, duration: number): Transition =>
    reduceMotion
      ? { duration: 0 }
      : { delay: at, duration, ease: [0.16, 1, 0.3, 1] };

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 300 26"
      fill="none"
      className={className}
    >
      <motion.path
        d={UNDERLINE}
        stroke="currentColor"
        strokeWidth={4.2}
        strokeLinecap="round"
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={draw(delay, 0.62)}
      />
      <motion.path
        d={UNDERPASS}
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.5}
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={draw(delay + 0.1, 0.5)}
      />
      <motion.path
        d={TICK}
        stroke="currentColor"
        strokeWidth={4.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={draw(delay + 0.56, 0.26)}
      />
    </motion.svg>
  );
}
