import { dataAttr, elementProps, mergeProps } from "@seed-design/dom-utils";
import { useCollapsible } from "@seed-design/react-collapsible";
import { useCallback, useId, useMemo } from "react";
import { useAccordionContext } from "./useAccordionContext";

export interface UseAccordionItemProps {
  value: string;
  disabled?: boolean;
}

export type UseAccordionItemReturn = ReturnType<typeof useAccordionItem>;

export function useAccordionItem(props: UseAccordionItemProps) {
  const { value, disabled: itemDisabled } = props;
  const accordion = useAccordionContext();
  const triggerId = useId();

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

  const triggerProps = useMemo(
    () =>
      mergeProps(stateProps, collapsible.triggerAriaProps, collapsible.triggerHandlers, {
        id: triggerId,
        disabled,
        "data-value": value,
      }),
    [collapsible.triggerAriaProps, collapsible.triggerHandlers, disabled, stateProps, triggerId, value],
  );

  const contentProps = useMemo(
    () =>
      mergeProps(collapsible.contentProps, {
        role: "region",
        "aria-labelledby": triggerId,
      }),
    [collapsible.contentProps, triggerId],
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
    [collapsible, contentProps, disabled, open, rootProps, stateProps, triggerId, triggerProps, value],
  );
}
