import { useControllableState } from "@radix-ui/react-use-controllable-state";
import type { UseTabsStateProps, UseTabsProps, ContentProps, TriggerProps } from "./types";
import { elementProps, buttonProps, dataAttr, ariaAttr } from "@seed-design/dom-utils";
import { useId } from "react";
import * as dom from "./dom";
import React from "react";
import { lazyDisclosure, pushUnique } from "./utils";

export function useTabsState(props: UseTabsStateProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
  });

  const [previousValues, setPreviousValues] = React.useState<string[]>(
    props.defaultValue ? [props.defaultValue] : [],
  );

  React.useEffect(() => {
    setPreviousValues((prev) => pushUnique(prev, value));
  }, [value]);

  return {
    value,
    previousValues,
    setValue,
  };
}

export function useTabs(props: UseTabsProps) {
  const id = useId();
  const { setValue, value, previousValues } = useTabsState(props);

  const {
    value: omitValue,
    defaultValue: omitDefaultValue,
    onValueChange: omitOnValueChange,
    lazyMode = "keepMounted",
    isLazy = false,
    ...restProps
  } = props;

  const currentTabIndex = React.useMemo(() => {
    const tabIndex = dom.getTabIndex(value, id);
    return tabIndex === -1 ? 0 : tabIndex;
  }, [value, id]);

  return {
    value,
    setValue,

    getCurrentContentLeftOffset: () => {
      const tabEl = dom.getTabContentEl(value, id);
      if (!tabEl) return 0;
      return tabEl.offsetLeft;
    },

    restProps,
    rootProps: elementProps({
      id: dom.getRootId(id),
    }),

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
    tabContentCameraProps: elementProps({
      id: dom.getTabContentCameraId(id),
      style: {
        transform: `translateX(-${currentTabIndex * 100}%)`,
        willChange: "transform",
      },
    }),
    getTabContentProps: (props: ContentProps) => {
      const { value: contentValue } = props;
      const isSelected = value === contentValue;
      const wasSelected = previousValues.includes(contentValue);
      const tabContentProps = elementProps({
        id: dom.getTabContentId(contentValue, id),
        "aria-selected": ariaAttr(isSelected),
        "data-selected": dataAttr(isSelected),
      });
      return {
        tabContentProps,
        shouldRender: lazyDisclosure({
          enabled: isLazy,
          mode: lazyMode,
          isSelected,
          wasSelected,
        }),
      };
    },

    tabIndicatorProps: elementProps({}),
  };
}
