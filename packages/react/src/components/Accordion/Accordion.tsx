"use client";

import { accordion } from "@seed-design/css/recipes/accordion";
import { dataAttr } from "@seed-design/dom-utils";
import {
  Accordion as AccordionPrimitive,
  useAccordionItemContext,
} from "@seed-design/react-accordion";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext } = createSlotRecipeContext(accordion);

const useAccordionItemStateProps = () => {
  const ctx = useAccordionItemContext();
  return {
    stateProps: {
      "data-disabled": dataAttr(ctx.disabled),
    } as React.HTMLAttributes<HTMLElement>,
  };
};

const withStateProps = createWithStateProps([useAccordionItemStateProps]);

////////////////////////////////////////////////////////////////////////////////////

export type AccordionRootProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export const AccordionRoot = withProvider<HTMLDivElement, AccordionRootProps>(
  AccordionPrimitive.Root,
  "root",
);
AccordionRoot.displayName = "Accordion.Root";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

export const AccordionItem = withContext<HTMLDivElement, AccordionItemProps>(
  AccordionPrimitive.Item,
  "item",
);
AccordionItem.displayName = "Accordion.Item";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header> {}

export const AccordionHeader = withContext<HTMLHeadingElement, AccordionHeaderProps>(
  AccordionPrimitive.Header,
  "header",
);
AccordionHeader.displayName = "Accordion.Header";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {}

export const AccordionTrigger = withContext<HTMLButtonElement, AccordionTriggerProps>(
  AccordionPrimitive.Trigger,
  "trigger",
);
AccordionTrigger.displayName = "Accordion.Trigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

export const AccordionContent = withContext<HTMLDivElement, AccordionContentProps>(
  AccordionPrimitive.Content,
  "content",
);
AccordionContent.displayName = "Accordion.Content";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentInnerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContentInner = withContext<HTMLDivElement, AccordionContentInnerProps>(
  Primitive.div,
  "contentInner",
);
AccordionContentInner.displayName = "Accordion.ContentInner";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AccordionBody = withContext<HTMLDivElement, AccordionBodyProps>(Primitive.div, "body");
AccordionBody.displayName = "Accordion.Body";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionTitle = withContext<HTMLSpanElement, AccordionTitleProps>(
  withStateProps(Primitive.span),
  "title",
);
AccordionTitle.displayName = "Accordion.Title";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionDescription = withContext<HTMLSpanElement, AccordionDescriptionProps>(
  withStateProps(Primitive.span),
  "description",
);
AccordionDescription.displayName = "Accordion.Description";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefix = withContext<HTMLDivElement, AccordionPrefixProps>(
  withStateProps(Primitive.div),
  "prefix",
);
AccordionPrefix.displayName = "Accordion.Prefix";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionSuffixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionSuffixIcon = withContext<HTMLDivElement, AccordionSuffixIconProps>(
  withStateProps(Primitive.div),
  "suffixIcon",
);
AccordionSuffixIcon.displayName = "Accordion.SuffixIcon";
