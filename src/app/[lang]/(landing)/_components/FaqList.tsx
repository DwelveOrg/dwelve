"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { surfaceVariants } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";

/**
 * The disclosure list itself, without a heading.
 *
 * Extracted when the pricing page needed its own set of questions: an FAQ that
 * looked *almost* like the home page's — same accordion, different surface, or
 * the same surface with different padding — is the kind of drift the UI system
 * exists to prevent, and there was no reason for the second one to be written by
 * hand at all.
 *
 * Callers supply the heading, because the two sites of use want different ones:
 * the home page's is centred with a subtitle, the pricing page's is a plain left
 * heading closing out the plan.
 */
export type FaqItem = { key: string; question: string; answer: string };

export default function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(surfaceVariants({ padding: "none", elevation: 3 }), "px-5 py-2", className)}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
    >
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : index % 2 === 0 ? -10 : 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.04 }}
          >
            <AccordionItem value={item.key}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
}
