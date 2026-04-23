import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useMemo } from "react";

export interface UseAccordionSingleProps {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
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

interface UseAccordionSingleInternalProps extends UseAccordionSingleProps {
  valuePropPresent?: boolean;
}

export type UseAccordionProps = UseAccordionSingleInternalProps | UseAccordionMultipleProps;
export type UseAccordionReturn = ReturnType<typeof useAccordion>;

function isSingleProps(props: UseAccordionProps): props is UseAccordionSingleInternalProps {
  return props.type === "single";
}

export function useAccordion(props: UseAccordionProps) {
  const isSingle = isSingleProps(props);
  const disabled = props.disabled ?? false;

  const [singleValues, setSingleValues] = useControllableState<string[]>({
    prop:
      isSingle && props.valuePropPresent
        ? props.value === undefined
          ? []
          : [props.value]
        : undefined,
    defaultProp: isSingle ? (props.defaultValue === undefined ? [] : [props.defaultValue]) : [],
    onChange: isSingle ? (nextValue) => props.onValueChange?.(nextValue[0]) : undefined,
  });

  const [multipleValue, setMultipleValue] = useControllableState<string[]>({
    prop: !isSingleProps(props) ? props.value : undefined,
    defaultProp: !isSingleProps(props) ? (props.defaultValue ?? []) : [],
    onChange: !isSingleProps(props) ? props.onValueChange : undefined,
  });

  const collapsible = isSingleProps(props) ? (props.collapsible ?? true) : true;

  const isOpen = useCallback(
    (itemValue: string) =>
      isSingle ? singleValues.includes(itemValue) : multipleValue.includes(itemValue),
    [isSingle, singleValues, multipleValue],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (isSingle) {
        const isCurrentOpen = singleValues.includes(itemValue);

        if (isCurrentOpen) {
          if (collapsible) setSingleValues([]);
          return;
        }

        setSingleValues([itemValue]);
      } else {
        setMultipleValue((prev) =>
          prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue],
        );
      }
    },
    [isSingle, singleValues, collapsible, setSingleValues, setMultipleValue],
  );

  return useMemo(
    () => ({ disabled, collapsible, isOpen, toggle }),
    [disabled, collapsible, isOpen, toggle],
  );
}
