import React from "react";

import type { LegalSection } from "@/i18n/server";

/**
 * The body of a legal page.
 *
 * Deliberately a server component with no motion and no state: the privacy
 * policy and the terms are the two pages here that are read rather than scanned,
 * often by someone who has been asked to check something specific, and the
 * kindest thing to do with them is render the text and get out of the way.
 *
 * Two decisions that matter more than they look:
 *
 *   - **Numbered sections with `id`s.** Every heading is addressable, so a clause
 *     can be linked to directly — which is the only way a legal page is ever
 *     cited in practice. The numbers come from the array order, so inserting a
 *     section renumbers the rest and the `id`s (derived from the index) stay
 *     stable per position; slugs would drift with translation.
 *   - **A reading measure, not the page width.** `max-w-2xl` is about 70
 *     characters. Legal prose at `max-w-6xl` is a wall, and a wall is what people
 *     mean when they say nobody reads the terms.
 */
export default function LegalDocument({
  updated,
  intro,
  sections,
}: {
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="w-full px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* The date and the opening paragraph sit on the page's centre axis with
            `PageHeader` above them. The clauses below do not: centred legal prose
            is unreadable, and a numbered heading whose number floats is not a
            numbered heading. Centre the column, left-align the document. */}
        <p className="numeric text-center text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {updated}
        </p>

        <p className="mt-6 text-center text-base leading-relaxed text-muted-foreground">{intro}</p>

        <div className="mt-12 space-y-12">
          {sections.map((section, index) => (
            <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                <span className="numeric mr-2.5 text-muted-foreground">{index + 1}.</span>
                {section.heading}
              </h2>

              <div className="mt-4 space-y-4 text-15 leading-relaxed text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {section.list?.length ? (
                <ul className="mt-4 space-y-2.5 border-l border-border pl-5">
                  {section.list.map((item) => (
                    <li key={item} className="text-15 leading-relaxed text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
