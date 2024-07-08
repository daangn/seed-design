import { useControllableState } from "@radix-ui/react-use-controllable-state";
import type { UseTabsStateProps, UseTabsProps, ContentProps, TriggerProps } from "./types";
import { elementProps, buttonProps, dataAttr, ariaAttr } from "@seed-design/dom-utils";
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
      const { isDisabled, value: triggerValue } = props;
      const isSelected = value === triggerValue;
      return buttonProps({
        disabled: isDisabled,
        "aria-selected": ariaAttr(isSelected),
        "data-selected": dataAttr(isSelected),
        tabIndex: isSelected ? 0 : -1,
        onClick: () => setValue(triggerValue),
      });
    },

    tabContentListProps: elementProps({}),
    getTabContentProps: (props: ContentProps) => {
      const { value: contentValue } = props;
      const isSelected = value === contentValue;
      return elementProps({
        "aria-selected": ariaAttr(isSelected),
        "data-selected": dataAttr(isSelected),
      });
    },

    tabIndicatorProps: elementProps({}),
  };
}
