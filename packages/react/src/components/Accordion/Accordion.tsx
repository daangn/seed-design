"use client";

import { accordion, type AccordionVariantProps } from "@seed-design/css/recipes/accordion";
import {
  Accordion as AccordionPrimitive,
  useAccordionItemStateProps,
} from "@seed-design/react-accordion";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider, withContext } = createSlotRecipeContext(accordion);
const withStateProps = createWithStateProps([useAccordionItemStateProps]);

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionRootProps
  extends AccordionVariantProps,
    AccordionPrimitive.RootProps {}

export const AccordionRoot = withProvider<HTMLDivElement, AccordionRootProps>(
  AccordionPrimitive.Root,
  "root",
);
AccordionRoot.displayName = "AccordionRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

export const AccordionItem = withContext<HTMLDivElement, AccordionItemProps>(
  AccordionPrimitive.Item,
  "item",
);
AccordionItem.displayName = "AccordionItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header> {}

export const AccordionHeader = withContext<HTMLHeadingElement, AccordionHeaderProps>(
  AccordionPrimitive.Header,
  "header",
);
AccordionHeader.displayName = "AccordionHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {}

export const AccordionTrigger = withContext<HTMLButtonElement, AccordionTriggerProps>(
  AccordionPrimitive.Trigger,
  "trigger",
);
AccordionTrigger.displayName = "AccordionTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

export const AccordionContent = withContext<HTMLDivElement, AccordionContentProps>(
  AccordionPrimitive.Content,
  "content",
);
AccordionContent.displayName = "AccordionContent";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionBodyProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AccordionBody = withContext<HTMLDivElement, AccordionBodyProps>(Primitive.div, "body");
AccordionBody.displayName = "AccordionBody";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionTitle = withContext<HTMLSpanElement, AccordionTitleProps>(
  withStateProps(Primitive.span),
  "title",
);
AccordionTitle.displayName = "AccordionTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const AccordionDescription = withContext<HTMLSpanElement, AccordionDescriptionProps>(
  withStateProps(Primitive.span),
  "description",
);
AccordionDescription.displayName = "AccordionDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefix = withContext<HTMLDivElement, AccordionPrefixProps>(
  withStateProps(Primitive.div),
  "prefix",
);
AccordionPrefix.displayName = "AccordionPrefix";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixIconProps extends InternalIconProps {}

export const AccordionPrefixIcon = withContext<SVGSVGElement, AccordionPrefixIconProps>(
  withStateProps(InternalIcon),
  "prefixIcon",
);
AccordionPrefixIcon.displayName = "AccordionPrefixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionSuffixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionSuffixIcon = withContext<HTMLDivElement, AccordionSuffixIconProps>(
  withStateProps(Primitive.div),
  "suffixIcon",
);
AccordionSuffixIcon.displayName = "AccordionSuffixIcon";
