import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useCallback, useId, useMemo } from "react";
import * as dom from "./dom";

export interface UseAccordionProps {
  type?: "single" | "multiple";
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
}

export type UseAccordionReturn = ReturnType<typeof useAccordion>;

export function useAccordion(props: UseAccordionProps) {
  const accordionId = useId();
  const isSingle = props.type === "single";
  const disabled = props.disabled ?? false;
  const rootId = dom.getRootId(accordionId);

  const [rawValues, setValues] = useControllableState<string[]>({
    prop: props.values,
    defaultProp: props.defaultValues ?? [],
    onChange: props.onValuesChange,
  });

  const values = isSingle ? rawValues.slice(0, 1) : rawValues;
  const collapsible = isSingle ? (props.collapsible ?? true) : true;

  const isOpen = useCallback(
    (itemValue: string) => values.includes(itemValue),
    [values],
  );

  const getEnabledValues = useCallback(() => {
    return dom.getEnabledValues(rootId);
  }, [rootId]);

  const focusTriggerByValue = useCallback(
    (value: string) => {
      dom.getTriggerByValue(rootId, value)?.focus();
    },
    [rootId],
  );

  const focusPrev = useCallback(
    (value: string) => {
      const enabledValues = getEnabledValues();
      const currentIndex = enabledValues.indexOf(value);
      if (currentIndex === -1) return;

      const prevValue =
        enabledValues[currentIndex - 1 < 0 ? enabledValues.length - 1 : currentIndex - 1];
      if (!prevValue) return;

      focusTriggerByValue(prevValue);
    },
    [focusTriggerByValue, getEnabledValues],
  );

  const focusNext = useCallback(
    (value: string) => {
      const enabledValues = getEnabledValues();
      const currentIndex = enabledValues.indexOf(value);
      if (currentIndex === -1) return;

      const nextValue =
        enabledValues[currentIndex + 1 >= enabledValues.length ? 0 : currentIndex + 1];
      if (!nextValue) return;

      focusTriggerByValue(nextValue);
    },
    [focusTriggerByValue, getEnabledValues],
  );

  const focusFirst = useCallback(() => {
    const firstValue = getEnabledValues()[0];
    if (!firstValue) return;

    focusTriggerByValue(firstValue);
  }, [focusTriggerByValue, getEnabledValues]);

  const focusLast = useCallback(() => {
    const enabledValues = getEnabledValues();
    const lastValue = enabledValues[enabledValues.length - 1];
    if (!lastValue) return;

    focusTriggerByValue(lastValue);
  }, [focusTriggerByValue, getEnabledValues]);

  const toggle = useCallback(
    (itemValue: string) => {
      if (disabled) return;

      if (isSingle) {
        const isCurrentOpen = values[0] === itemValue;

        if (isCurrentOpen) {
          if (collapsible) setValues([]);
          return;
        }

        setValues([itemValue]);
      } else {
        setValues((prev) =>
          prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue],
        );
      }
    },
    [collapsible, disabled, isSingle, setValues, values],
  );

  return useMemo(
    () => ({
      accordionId,
      rootId,
      disabled,
      collapsible,
      values,
      isOpen,
      toggle,
      focusPrev,
      focusNext,
      focusFirst,
      focusLast,
      rootProps: elementProps({
        id: rootId,
        "data-accordion-root": rootId,
        "data-disabled": dataAttr(disabled),
      }),
    }),
    [
      accordionId,
      collapsible,
      disabled,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      isOpen,
      rootId,
      toggle,
      values,
    ],
  );
}
