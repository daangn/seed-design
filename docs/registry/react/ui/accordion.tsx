"use client";

import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import { Accordion as SeedAccordion } from "@seed-design/react";
import * as React from "react";

export interface AccordionProps extends SeedAccordion.RootProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const Accordion = SeedAccordion.Root;

export interface AccordionItemProps extends SeedAccordion.ItemProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionItem = SeedAccordion.Item;

export interface AccordionTriggerProps
  extends Omit<SeedAccordion.TriggerProps, "children" | "title" | "prefix"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  headingLevel?: SeedAccordion.HeaderProps["headingLevel"];
}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ title, description, prefix, suffixIcon, headingLevel, ...props }, ref) => (
    <SeedAccordion.Header headingLevel={headingLevel}>
      <SeedAccordion.Trigger ref={ref} {...props}>
        {prefix && <SeedAccordion.Prefix>{prefix}</SeedAccordion.Prefix>}
        <SeedAccordion.Body>
          <SeedAccordion.Title>{title}</SeedAccordion.Title>
          {description && <SeedAccordion.Description>{description}</SeedAccordion.Description>}
        </SeedAccordion.Body>
        <SeedAccordion.SuffixIcon>
          {suffixIcon ?? <IconChevronDownSmallLine />}
        </SeedAccordion.SuffixIcon>
      </SeedAccordion.Trigger>
    </SeedAccordion.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends SeedAccordion.ContentProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionContent = SeedAccordion.Content;
