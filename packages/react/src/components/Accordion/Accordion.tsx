"use client";

import { accordion, type AccordionVariantProps } from "@seed-design/css/recipes/accordion";
import { dataAttr } from "@seed-design/dom-utils";
import {
  Collapsible,
  CollapsibleProvider,
  useCollapsible,
  useCollapsibleContext,
} from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import { forwardRef, useCallback, useId, useMemo } from "react";
import type * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import {
  AccordionItemProvider,
  AccordionProvider,
  useAccordionContext,
  useAccordionItemContext,
} from "./AccordionContext";
import {
  useAccordion,
  type UseAccordionMultipleProps,
  type UseAccordionSingleProps,
} from "./useAccordion";

const { ClassNamesProvider, withContext, useClassNames } = createSlotRecipeContext(accordion);

const useAccordionItemStateProps = (_prop?: { strict?: boolean }) => {
  const ctx = useAccordionItemContext();
  return {
    stateProps: {
      "data-disabled": dataAttr(ctx.disabled),
    } as React.HTMLAttributes<HTMLElement>,
  };
};

const withStateProps = createWithStateProps([useAccordionItemStateProps]);

////////////////////////////////////////////////////////////////////////////////////

interface AccordionRootBaseProps
  extends AccordionVariantProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export type AccordionRootProps = AccordionRootBaseProps &
  (UseAccordionSingleProps | UseAccordionMultipleProps);

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>((allProps, ref) => {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    disabled,
    className,
    onKeyDown,
    children,
    ...rest
  } = allProps;

  const collapsible = "collapsible" in allProps ? allProps.collapsible : undefined;

  const { collapsible: _collapsible, ...restWithoutCollapsible } = rest as Record<string, unknown>;
  const [variantProps, otherProps] = accordion.splitVariantProps(restWithoutCollapsible);
  const classNames = accordion(variantProps);

  // Build accordion props based on type
  const accordionProps = useMemo(() => {
    if (type === "single") {
      return {
        type: "single" as const,
        value: value as string | undefined,
        defaultValue: defaultValue as string | undefined,
        onValueChange: onValueChange as ((value: string) => void) | undefined,
        collapsible: collapsible as boolean | undefined,
        disabled,
      };
    }
    return {
      type: "multiple" as const,
      value: value as string[] | undefined,
      defaultValue: defaultValue as string[] | undefined,
      onValueChange: onValueChange as ((value: string[]) => void) | undefined,
      disabled,
    };
  }, [type, value, defaultValue, onValueChange, collapsible, disabled]);

  const api = useAccordion(accordionProps);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const { key } = event;
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;

      const target = event.target as HTMLElement;
      if (!target.hasAttribute("data-accordion-trigger")) return;

      event.preventDefault();

      const triggers = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>(
          "[data-accordion-trigger]:not([disabled])",
        ),
      );

      if (triggers.length === 0) return;

      const currentIndex = triggers.indexOf(target);

      let nextIndex: number;
      switch (key) {
        case "ArrowDown":
          nextIndex = currentIndex + 1 >= triggers.length ? 0 : currentIndex + 1;
          break;
        case "ArrowUp":
          nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = triggers.length - 1;
          break;
        default:
          return;
      }

      triggers[nextIndex]?.focus();
    },
    [onKeyDown],
  );

  return (
    <AccordionProvider value={api}>
      <ClassNamesProvider value={classNames}>
        <Primitive.div
          ref={ref}
          className={clsx(classNames.root, className)}
          onKeyDown={handleKeyDown}
          data-disabled={dataAttr(api.disabled)}
          {...otherProps}
        >
          {children}
        </Primitive.div>
      </ClassNamesProvider>
    </AccordionProvider>
  );
});
AccordionRoot.displayName = "Accordion.Root";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled: disabledProp, className, children, ...props }, ref) => {
    const accordionCtx = useAccordionContext();
    const classNames = useClassNames();

    const disabled = disabledProp ?? accordionCtx.disabled;
    const open = accordionCtx.isOpen(value);
    const triggerId = useId();

    const itemContext = useMemo(
      () => ({
        value,
        open,
        disabled,
        triggerId,
      }),
      [value, open, disabled, triggerId],
    );

    const collapsible = useCollapsible({
      open,
      onOpenChange: (nextOpen) => {
        if (nextOpen !== open) {
          accordionCtx.toggle(value);
        }
      },
      disabled,
    });

    return (
      <AccordionItemProvider value={itemContext}>
        <CollapsibleProvider value={collapsible}>
          <Primitive.div
            ref={ref}
            className={clsx(classNames.item, className)}
            data-open={dataAttr(open)}
            data-disabled={dataAttr(disabled)}
            {...props}
          >
            {children}
          </Primitive.div>
        </CollapsibleProvider>
      </AccordionItemProvider>
    );
  },
);
AccordionItem.displayName = "Accordion.Item";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const classNames = useClassNames();
    const itemCtx = useAccordionItemContext();
    const collapsibleCtx = useCollapsibleContext();

    const contentId = collapsibleCtx.triggerAriaProps["aria-controls"];

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        collapsibleCtx.triggerHandlers.onClick?.(event as never);
      },
      [onClick, collapsibleCtx.triggerHandlers],
    );

    return (
      <Primitive.button
        ref={ref}
        id={itemCtx.triggerId}
        type="button"
        className={clsx(classNames.trigger, className)}
        data-accordion-trigger=""
        data-open={dataAttr(itemCtx.open)}
        data-disabled={dataAttr(itemCtx.disabled)}
        disabled={itemCtx.disabled}
        aria-expanded={itemCtx.open}
        aria-controls={contentId}
        aria-disabled={itemCtx.disabled}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
AccordionTrigger.displayName = "Accordion.Trigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const itemCtx = useAccordionItemContext();

    return (
      <Collapsible.Content
        ref={ref}
        className={clsx(classNames.content, className)}
        role="region"
        aria-labelledby={itemCtx.triggerId}
        {...props}
      />
    );
  },
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

export interface AccordionPrefixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefixIcon = withContext<HTMLDivElement, AccordionPrefixIconProps>(
  Primitive.div,
  "prefixIcon",
);
AccordionPrefixIcon.displayName = "Accordion.PrefixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixAvatarProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionPrefixAvatar = withContext<HTMLDivElement, AccordionPrefixAvatarProps>(
  Primitive.div,
  "prefixAvatar",
);
AccordionPrefixAvatar.displayName = "Accordion.PrefixAvatar";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionSuffixIconProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionSuffixIcon = forwardRef<HTMLDivElement, AccordionSuffixIconProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();
    const itemCtx = useAccordionItemContext();

    return (
      <Primitive.div
        ref={ref}
        className={clsx(classNames.suffixIcon, className)}
        data-open={dataAttr(itemCtx.open)}
        data-disabled={dataAttr(itemCtx.disabled)}
        {...props}
      />
    );
  },
);
AccordionSuffixIcon.displayName = "Accordion.SuffixIcon";
