"use client";

import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { forwardRef } from "react";
import type * as React from "react";
import { useAccordion, type UseAccordionProps } from "./useAccordion";
import { useAccordionItem } from "./useAccordionItem";
import { AccordionProvider } from "./useAccordionContext";
import { AccordionItemProvider, useAccordionItemContext } from "./useAccordionItemContext";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionRootProps
  extends UseAccordionProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  const {
    type,
    values,
    defaultValues,
    onValuesChange,
    collapsible,
    disabled,
    ...otherProps
  } = props;

  const api = useAccordion({
    type,
    values,
    defaultValues,
    onValuesChange,
    collapsible,
    disabled,
  });

  return (
    <AccordionProvider value={api}>
      <Primitive.div ref={ref} {...mergeProps(api.rootProps, otherProps)} />
    </AccordionProvider>
  );
});
AccordionRoot.displayName = "AccordionRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => {
  const { value, disabled: itemDisabled, ...rest } = props;
  const itemApi = useAccordionItem({
    value,
    disabled: itemDisabled,
  });

  return (
    <AccordionItemProvider value={itemApi}>
      <Primitive.div ref={ref} {...mergeProps(rest, itemApi.rootProps)} />
    </AccordionItemProvider>
  );
});
AccordionItem.displayName = "AccordionItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * `AccordionHeader` wraps the `AccordionTrigger` to provide a semantic heading
 * level for screen readers and document outline.
 *
 * Renders as the requested native heading element. Defaults to `<h3>`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#wai-ariaroles%2Cstates%2Candproperties
 *   — "The title of each accordion header is contained in an element with role `button`.
 *   Each accordion header `button` is wrapped in an element with role `heading`..."
 */
export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  ({ headingLevel = 3, ...props }, ref) => {
    const Comp = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;

    return <Comp ref={ref as React.ForwardedRef<any>} {...props} />;
  },
);
AccordionHeader.displayName = "AccordionHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * `AccordionTrigger` toggles the open/closed state of an `AccordionItem`.
 * It should always be nested inside of an `AccordionHeader` to preserve the
 * WAI-ARIA accordion pattern (heading > button).
 *
 * Renders as a native `<button>` with `aria-expanded`, `aria-controls`,
 * `aria-disabled` automatically managed via the underlying collapsible.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (props, ref) => {
    const itemApi = useAccordionItemContext();

    return (
      <Primitive.button ref={ref} {...mergeProps(props, itemApi.triggerProps)} />
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>((props, ref) => {
  const itemApi = useAccordionItemContext();

  return (
    <Primitive.div
      ref={composeRefs(ref, itemApi.refs.content)}
      {...mergeProps(itemApi.contentProps, props)}
    />
  );
});
AccordionContent.displayName = "AccordionContent";
