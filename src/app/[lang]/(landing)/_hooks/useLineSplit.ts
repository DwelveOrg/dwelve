"use client";

import { useEffect, useState, type RefObject } from "react";

/** What was measured, and what it was measured against. */
type Measurement = {
  text: string;
  lines: string[];
};

/**
 * Breaks an element's text into the lines the browser actually rendered it as,
 * or returns `null` while that is unknown.
 *
 * **Why measure instead of authoring the breaks.** The hero headline reveals a
 * line at a time, which means something has to know where the lines are. The
 * cheap version is to put the breaks in the catalogue — but then the headline
 * stops being responsive, and English, Russian and Uzbek each need their breaks
 * re-chosen at every width by a person. The headline also carries
 * `text-wrap: balance`, so the breaks are not even predictable from the width.
 * The only source of truth is the layout the browser produced, so that is what
 * this reads.
 *
 * **Why it can return `null`.** The server and the first client render must
 * agree, and the server cannot measure anything. So the caller renders the
 * plain string until this says otherwise, and there is no hydration mismatch to
 * have. `null` is also what comes back when splitting is disabled (reduced
 * motion), when the element is not laid out yet, and after a resize — all of
 * which the caller handles the same way, by rendering the untouched text.
 *
 * **Why the stale case is derived rather than cleared.** A measurement is
 * stored with the string it was taken from and discarded during render when
 * they no longer match, instead of being reset by the effect. Clearing in the
 * effect would leave the previous language's line breaks on screen for one
 * frame after a language switch — the same reasoning `Navbar`'s scroll-spy
 * gives for deriving its disabled case.
 *
 * @param ref     the element whose first child is the text node to split
 * @param text    the string being rendered, so a language change re-measures
 * @param enabled false to stay out of the way entirely
 */
export default function useLineSplit(
  ref: RefObject<HTMLElement | null>,
  text: string,
  enabled: boolean,
): string[] | null {
  const [measured, setMeasured] = useState<Measurement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const measure = () => {
      const node = ref.current?.firstChild;
      if (cancelled || !node || node.nodeType !== Node.TEXT_NODE) return;

      const lines = splitIntoRenderedLines(node as Text);
      if (!cancelled && lines && lines.length > 0) setMeasured({ text, lines });
    };

    /* Glyph metrics decide where the lines break, so measuring before the
       display face has loaded splits the *fallback's* layout and then holds
       those breaks after the real face swaps in. The frame callback is what
       guarantees the split runs after layout rather than inside the effect. */
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    let frame = 0;
    void fontsReady.then(() => {
      if (!cancelled) frame = requestAnimationFrame(measure);
    });

    /* Explicit line boxes cannot re-wrap. Handing the original text node back
       lets the browser lay the headline out again at the new width; by the time
       anyone drags a window edge the entrance has long since played, and a
       reader who resizes mid-animation gets the finished headline rather than a
       broken one. */
    const reset = () => setMeasured(null);
    window.addEventListener("resize", reset);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", reset);
    };
  }, [ref, text, enabled]);

  return enabled && measured?.text === text ? measured.lines : null;
}

/**
 * Groups a text node's words into lines by the vertical position of their
 * client rects.
 *
 * A `Range` over each word is the only way to ask where a word ended up: the
 * words share one text node, so there is no element to measure. Offsets come
 * from the match rather than from splitting the string first, because the Range
 * is addressed in offsets and splitting throws them away.
 */
function splitIntoRenderedLines(node: Text): string[] | null {
  const source = node.data;
  const range = document.createRange();
  const word = /\S+/g;
  const lines: string[] = [];

  let lineTop: number | null = null;
  let lineStart = 0;
  let match: RegExpExecArray | null;

  while ((match = word.exec(source)) !== null) {
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].length);
    const { top, width, height } = range.getBoundingClientRect();

    // Nothing is laid out — a `display: none` ancestor, or a measure that ran
    // before first paint. A zero-rect split would be one line of everything.
    if (width === 0 && height === 0) return null;

    if (lineTop === null) {
      lineTop = top;
    } else if (Math.abs(top - lineTop) > 1) {
      // 1px of tolerance: sub-pixel layout puts words of one line a fraction
      // apart, while a real break is a whole line-height away.
      lines.push(source.slice(lineStart, match.index).trim());
      lineStart = match.index;
      lineTop = top;
    }
  }

  if (lineTop === null) return null;
  lines.push(source.slice(lineStart).trim());

  return lines;
}
