import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useMemo } from "react";

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
  const isSingle = props.type === "single";
  const disabled = props.disabled ?? false;

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

  const toggle = useCallback(
    (itemValue: string) => {
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
    [collapsible, isSingle, setValues, values],
  );

  return useMemo(
    () => ({ disabled, collapsible, values, isOpen, toggle }),
    [collapsible, disabled, isOpen, toggle, values],
  );
}
