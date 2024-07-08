import { useControllableState } from "@radix-ui/react-use-controllable-state";
import type { UseTabsStateProps, UseTabsProps, ContentProps, TriggerProps } from "./types";
import { elementProps, buttonProps } from "@seed-design/dom-utils";
import { useId } from "react";

export function useTabsState(props: UseTabsStateProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
  });

  return {
    value,
    setValue,
  };
}

// "root",
// "tabList", -> "tabList"
// "tab", -> "tabTrigger"
// "panelGroup", -> "tabContentList"
// "panelGroupCamera", -> "tabContentCamera"
// "panel", -> "tabContent"
// "indicator", -> "tabIndicator"

export function useTabs(props: UseTabsProps) {
  const id = useId();
  const { setValue, value } = useTabsState(props);

  const {
    value: omitValue,
    defaultValue: omitDefaultValue,
    onValueChange: omitOnValueChange,
    ...restProps
  } = props;

  return {
    value,
    setValue,

    restProps,
    rootProps: elementProps({}),

    tabTriggerListProps: elementProps({}),
    getTabTriggerProps: (props: TriggerProps) => {
      const { value, isDisabled } = props;
      const isSelected = value === props.value;
      return buttonProps({
        value,
        disabled: isDisabled,
        "data-selected": isSelected ? "" : undefined,
        onClick: () => setValue(value),
      });
    },

    tabContentListProps: elementProps({}),
    getTabContentProps: (props: ContentProps) => {
      const { value } = props;
      const isSelected = value === props.value;
      return elementProps({
        "data-selected": isSelected ? "" : undefined,
      });
    },

    tabIndicatorProps: elementProps({}),
  };
}
