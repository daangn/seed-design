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

function isSingleProps(props: UseAccordionProps): props is UseAccordionSingleProps {
  return props.type === "single";
}

export function useAccordion(props: UseAccordionProps) {
  const isSingle = isSingleProps(props);
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
      isSingle ? singleValue === itemValue : multipleValue.includes(itemValue),
    [isSingle, singleValue, multipleValue],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (isSingle) {
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
    [isSingle, singleValue, collapsible, setSingleValue, setMultipleValue],
  );

  return useMemo(
    () => ({ disabled, collapsible, isOpen, toggle }),
    [disabled, collapsible, isOpen, toggle],
  );
}
