"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useMemo } from "react";

export interface UseAccordionSingleProps {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
  disabled?: boolean;
}

export interface UseAccordionMultipleProps {
  type?: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
}

export type UseAccordionProps = UseAccordionSingleProps | UseAccordionMultipleProps;

export type UseAccordionReturn = ReturnType<typeof useAccordion>;

export function useAccordion(props: UseAccordionProps) {
  const isSingle = props.type === "single";
  const disabled = props.disabled ?? false;

  const [singleValue, setSingleValue] = useControllableState<string>({
    prop: isSingle ? (props as UseAccordionSingleProps).value : undefined,
    defaultProp: isSingle ? ((props as UseAccordionSingleProps).defaultValue ?? "") : "",
    onChange: isSingle ? (props as UseAccordionSingleProps).onValueChange : undefined,
  });

  const [multipleValue, setMultipleValue] = useControllableState<string[]>({
    prop: !isSingle ? (props as UseAccordionMultipleProps).value : undefined,
    defaultProp: !isSingle ? ((props as UseAccordionMultipleProps).defaultValue ?? []) : [],
    onChange: !isSingle ? (props as UseAccordionMultipleProps).onValueChange : undefined,
  });

  const collapsible = isSingle ? ((props as UseAccordionSingleProps).collapsible ?? true) : true;

  const isOpen = useCallback(
    (itemValue: string) => {
      if (isSingle) {
        return singleValue === itemValue;
      }
      return multipleValue.includes(itemValue);
    },
    [isSingle, singleValue, multipleValue],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (isSingle) {
        if (singleValue === itemValue) {
          if (collapsible) {
            setSingleValue("");
          }
        } else {
          setSingleValue(itemValue);
        }
      } else {
        setMultipleValue((prev) => {
          if (prev.includes(itemValue)) {
            return prev.filter((v) => v !== itemValue);
          }
          return [...prev, itemValue];
        });
      }
    },
    [isSingle, singleValue, collapsible, setSingleValue, setMultipleValue],
  );

  return useMemo(
    () => ({
      type: isSingle ? ("single" as const) : ("multiple" as const),
      disabled,
      collapsible,
      isOpen,
      toggle,
    }),
    [isSingle, disabled, collapsible, isOpen, toggle],
  );
}
