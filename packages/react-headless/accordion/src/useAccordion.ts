import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback } from "react";

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

function isSingleProps(props: UseAccordionProps): props is UseAccordionSingleProps {
  return props.type === "single";
}

export function useAccordion(props: UseAccordionProps) {
  const disabled = props.disabled ?? false;

  const [singleValue, setSingleValue] = useControllableState<string>({
    prop: isSingleProps(props) ? props.value : undefined,
    defaultProp: isSingleProps(props) ? (props.defaultValue ?? "") : "",
    onChange: isSingleProps(props) ? props.onValueChange : undefined,
  });

  const [multipleValue, setMultipleValue] = useControllableState<string[]>({
    prop: !isSingleProps(props) ? props.value : undefined,
    defaultProp: !isSingleProps(props) ? (props.defaultValue ?? []) : [],
    onChange: !isSingleProps(props) ? props.onValueChange : undefined,
  });

  const collapsible = isSingleProps(props) ? (props.collapsible ?? true) : true;

  const isOpen = useCallback(
    (itemValue: string) =>
      isSingleProps(props) ? singleValue === itemValue : multipleValue.includes(itemValue),
    [props, singleValue, multipleValue],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (isSingleProps(props)) {
        if (singleValue === itemValue) {
          if (collapsible) setSingleValue("");
        } else {
          setSingleValue(itemValue);
        }
      } else {
        setMultipleValue((prev) =>
          prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue],
        );
      }
    },
    [props, singleValue, collapsible, setSingleValue, setMultipleValue],
  );

  return { disabled, collapsible, isOpen, toggle };
}

export type UseAccordionReturn = ReturnType<typeof useAccordion>;
