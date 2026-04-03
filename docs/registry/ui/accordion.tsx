"use client";

import { Accordion as SeedAccordion } from "@seed-design/react";
import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

export type AccordionRootProps = SeedAccordion.RootProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionRoot = SeedAccordion.Root;

export type AccordionItemProps = SeedAccordion.ItemProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionItem = SeedAccordion.Item;

export type AccordionTriggerProps = SeedAccordion.TriggerProps;

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

export type AccordionContentProps = SeedAccordion.ContentProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionContent = SeedAccordion.Content;

export type AccordionTitleProps = SeedAccordion.TitleProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionTitle = SeedAccordion.Title;

export type AccordionDescriptionProps = SeedAccordion.DescriptionProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionDescription = SeedAccordion.Description;

export type AccordionPrefixIconProps = SeedAccordion.PrefixIconProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionPrefixIcon = SeedAccordion.PrefixIcon;

export type AccordionPrefixAvatarProps = SeedAccordion.PrefixAvatarProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionPrefixAvatar = SeedAccordion.PrefixAvatar;

export type AccordionSuffixIconProps = SeedAccordion.SuffixIconProps;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const AccordionSuffixIcon = SeedAccordion.SuffixIcon;

/**
 * @see https://seed-design.io/react/components/accordion
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Title: AccordionTitle,
  Description: AccordionDescription,
  PrefixIcon: AccordionPrefixIcon,
  PrefixAvatar: AccordionPrefixAvatar,
  SuffixIcon: AccordionSuffixIcon,
});
