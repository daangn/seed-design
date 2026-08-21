import { dataAttr, elementProps, mergeProps } from "@seed-design/dom-utils";
import { useCollapsible } from "@seed-design/react-collapsible";
import { useCallback, useMemo } from "react";
import type * as React from "react";
import * as dom from "./dom";
import { useAccordionContext } from "./useAccordionContext";

export interface UseAccordionItemProps {
  value: string;
  disabled?: boolean;
}

export type UseAccordionItemReturn = ReturnType<typeof useAccordionItem>;

export function useAccordionItem(props: UseAccordionItemProps) {
  const { value, disabled: itemDisabled } = props;
  const accordion = useAccordionContext();
  const triggerId = dom.getTriggerId(value, accordion.accordionId);
  const contentId = dom.getContentId(value, accordion.accordionId);

  const disabled = itemDisabled || accordion.disabled;
  const open = accordion.isOpen(value);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen !== open) {
        accordion.toggle(value);
      }
    },
    [accordion, open, value],
  );

  const collapsible = useCollapsible({
    open,
    onOpenChange: handleOpenChange,
    disabled,
  });

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-disabled": dataAttr(disabled),
        "data-open": dataAttr(open),
      }),
    [disabled, open],
  );

  const rootProps = useMemo(
    () =>
      mergeProps(collapsible.stateProps, {
        "data-value": value,
      }),
    [collapsible.stateProps, value],
  );

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.defaultPrevented) return;
      if (event.nativeEvent.isComposing) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          accordion.focusNext(value);
          break;
        case "ArrowUp":
          event.preventDefault();
          accordion.focusPrev(value);
          break;
        case "Home":
          event.preventDefault();
          accordion.focusFirst();
          break;
        case "End":
          event.preventDefault();
          accordion.focusLast();
          break;
      }
    },
    [accordion, value],
  );

  const triggerProps = useMemo(
    () =>
      mergeProps(stateProps, collapsible.triggerAriaProps, collapsible.triggerHandlers, {
        id: triggerId,
        disabled,
        "data-value": value,
        "data-ownedby": accordion.rootId,
        "aria-controls": contentId,
        onKeyDown: handleTriggerKeyDown,
      }),
    [
      accordion.rootId,
      collapsible.triggerAriaProps,
      collapsible.triggerHandlers,
      contentId,
      disabled,
      handleTriggerKeyDown,
      stateProps,
      triggerId,
      value,
    ],
  );

  const contentProps = useMemo(
    () =>
      mergeProps(collapsible.contentProps, {
        id: contentId,
        role: "region",
        "aria-labelledby": triggerId,
      }),
    [collapsible.contentProps, contentId, triggerId],
  );

  return useMemo(
    () => ({
      ...collapsible,
      value,
      open,
      disabled,
      triggerId,
      stateProps,
      rootProps,
      triggerProps,
      contentProps,
    }),
    [
      collapsible,
      contentProps,
      disabled,
      open,
      rootProps,
      stateProps,
      triggerId,
      triggerProps,
      value,
    ],
  );
}
