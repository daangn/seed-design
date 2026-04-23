"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { dataAttr, mergeProps } from "@seed-design/dom-utils";
import { Collapsible } from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef, useCallback, useId, useMemo, useRef } from "react";
import type * as React from "react";
import {
  useAccordion,
  type UseAccordionMultipleProps,
  type UseAccordionReturn,
  type UseAccordionSingleProps,
} from "./useAccordion";
import { AccordionProvider, useAccordionContext } from "./useAccordionContext";
import { AccordionItemProvider, useAccordionItemContext } from "./useAccordionItemContext";

const DATA_ACCORDION_TRIGGER = "data-accordion-trigger";

////////////////////////////////////////////////////////////////////////////////////

interface AccordionRootBaseProps
  extends PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export type AccordionSingleRootProps = AccordionRootBaseProps & UseAccordionSingleProps;
export type AccordionMultipleRootProps = AccordionRootBaseProps & UseAccordionMultipleProps;
export type AccordionRootProps = AccordionSingleRootProps | AccordionMultipleRootProps;

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>((props, ref) => {
  if (props.type === "single") {
    return <AccordionImplSingle {...props} ref={ref} />;
  }
  return <AccordionImplMultiple {...props} ref={ref} />;
});
AccordionRoot.displayName = "AccordionRoot";

const AccordionImplSingle = forwardRef<HTMLDivElement, AccordionSingleRootProps>((props, ref) => {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
    disabled,
    onKeyDown,
    children,
    ...rest
  } = props;

  const api = useAccordion({
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
    disabled,
    valuePropPresent: Object.prototype.hasOwnProperty.call(props, "value"),
  });

  return (
    <AccordionImpl ref={ref} api={api} onKeyDown={onKeyDown} {...rest}>
      {children}
    </AccordionImpl>
  );
});
AccordionImplSingle.displayName = "AccordionImplSingle";

const AccordionImplMultiple = forwardRef<HTMLDivElement, AccordionMultipleRootProps>(
  (props, ref) => {
    const { type, value, defaultValue, onValueChange, disabled, onKeyDown, children, ...rest } =
      props;

    const api = useAccordion({
      type,
      value,
      defaultValue,
      onValueChange,
      disabled,
    });

    return (
      <AccordionImpl ref={ref} api={api} onKeyDown={onKeyDown} {...rest}>
        {children}
      </AccordionImpl>
    );
  },
);
AccordionImplMultiple.displayName = "AccordionImplMultiple";

interface AccordionImplProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  api: UseAccordionReturn;
}

const AccordionImpl = forwardRef<HTMLDivElement, AccordionImplProps>(({ api, ...props }, ref) => {
  const triggerElementsRef = useRef<Set<HTMLElement>>(new Set());

  const registerTrigger = useCallback((trigger: HTMLElement) => {
    triggerElementsRef.current.add(trigger);
  }, []);

  const unregisterTrigger = useCallback((trigger: HTMLElement) => {
    triggerElementsRef.current.delete(trigger);
  }, []);

  const getTriggerElements = useCallback(() => {
    return Array.from(triggerElementsRef.current)
      .filter((trigger) => !trigger.hasAttribute("data-disabled"))
      .sort((a, b) => {
        const position = a.compareDocumentPosition(b);

        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;

        return 0;
      });
  }, []);

  const contextValue = useMemo(
    () => ({
      ...api,
      registerTrigger,
      unregisterTrigger,
      getTriggerElements,
    }),
    [api, registerTrigger, unregisterTrigger, getTriggerElements],
  );

  return (
    <AccordionProvider value={contextValue}>
      <Primitive.div ref={ref} data-disabled={dataAttr(api.disabled)} {...props} />
    </AccordionProvider>
  );
});
AccordionImpl.displayName = "AccordionImpl";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>((props, ref) => {
  const { value, disabled: itemDisabled, ...rest } = props;
  const api = useAccordionContext();
  const triggerId = useId();

  const disabled = itemDisabled || api.disabled;
  const open = api.isOpen(value);

  const itemContext = useMemo(
    () => ({ value, open, disabled, triggerId }),
    [value, open, disabled, triggerId],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen !== open) api.toggle(value);
    },
    [open, api, value],
  );

  return (
    <AccordionItemProvider value={itemContext}>
      <Collapsible.Root
        {...rest}
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        ref={ref}
      />
    </AccordionItemProvider>
  );
});
AccordionItem.displayName = "AccordionItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * `AccordionHeader` wraps the `AccordionTrigger` to provide a semantic heading
 * level for screen readers and document outline.
 *
 * Renders as `<h3>` by default.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#wai-ariaroles%2Cstates%2Candproperties
 *   — "The title of each accordion header is contained in an element with role `button`.
 *   Each accordion header `button` is wrapped in an element with role `heading`..."
 */
export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  (props, ref) => <Primitive.h3 ref={ref} {...props} />,
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
    const { triggerId, disabled } = useAccordionItemContext();
    const { getTriggerElements, registerTrigger, unregisterTrigger } = useAccordionContext();
    const registeredTriggerRef = useRef<HTMLButtonElement | null>(null);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.defaultPrevented) return;

        const { key } = event;
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;

        const triggers = getTriggerElements();
        if (triggers.length === 0) return;

        const currentIndex = triggers.indexOf(event.currentTarget);
        if (currentIndex === -1) return;

        event.preventDefault();

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
      [getTriggerElements],
    );

    const handleTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        const previousNode = registeredTriggerRef.current;

        if (previousNode && previousNode !== node) {
          unregisterTrigger(previousNode);
        }

        if (node && previousNode !== node) {
          registerTrigger(node);
        }

        registeredTriggerRef.current = node;
      },
      [registerTrigger, unregisterTrigger],
    );

    const composedRef = useMemo(() => composeRefs(ref, handleTriggerRef), [ref, handleTriggerRef]);

    return (
      <Collapsible.Trigger
        ref={composedRef}
        {...mergeProps(
          {
            onKeyDown: handleKeyDown,
          },
          props,
          {
            id: triggerId,
            disabled,
            [DATA_ACCORDION_TRIGGER]: "",
          },
        )}
      />
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>((props, ref) => {
  const { triggerId } = useAccordionItemContext();
  return <Collapsible.Content ref={ref} role="region" aria-labelledby={triggerId} {...props} />;
});
AccordionContent.displayName = "AccordionContent";
