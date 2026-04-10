"use client";

import { Accordion as SeedAccordion } from "@seed-design/react";
import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

export type AccordionRootProps = SeedAccordion.RootProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionRoot = SeedAccordion.Root;

export interface AccordionItemProps extends SeedAccordion.ItemProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionItem = SeedAccordion.Item;

export interface AccordionTriggerProps extends SeedAccordion.TriggerProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, ref) => (
    <SeedAccordion.Trigger ref={ref} {...props}>
      {children}
      <SeedAccordion.SuffixIcon>
        <IconChevronDownSmallLine />
      </SeedAccordion.SuffixIcon>
    </SeedAccordion.Trigger>
  ),
);
AccordionTrigger.displayName = "Accordion.Trigger";

export interface AccordionContentProps extends SeedAccordion.ContentProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, ...props }, ref) => (
    <SeedAccordion.Content ref={ref} {...props}>
      <SeedAccordion.ContentInner>{children}</SeedAccordion.ContentInner>
    </SeedAccordion.Content>
  ),
);
AccordionContent.displayName = "Accordion.Content";

export interface AccordionTitleProps extends SeedAccordion.TitleProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionTitle = SeedAccordion.Title;

export interface AccordionDescriptionProps extends SeedAccordion.DescriptionProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionDescription = SeedAccordion.Description;

export interface AccordionPrefixProps extends SeedAccordion.PrefixProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionPrefix = SeedAccordion.Prefix;

export interface AccordionSuffixIconProps extends SeedAccordion.SuffixIconProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionSuffixIcon = SeedAccordion.SuffixIcon;

export interface AccordionBodyProps extends SeedAccordion.BodyProps {}

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionBody = SeedAccordion.Body;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Body: AccordionBody,
  Title: AccordionTitle,
  Description: AccordionDescription,
  Prefix: AccordionPrefix,
  SuffixIcon: AccordionSuffixIcon,
});
