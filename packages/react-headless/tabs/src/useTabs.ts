import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import React, { useId } from "react";
import * as dom from "./dom";
import type { ContentProps, TriggerProps, UseTabsProps, UseTabsStateProps } from "./types";

import { useGesture } from "@use-gesture/react";

function useTabsState(props: UseTabsStateProps & { id: string }) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue,
    onChange: props.onValueChange,
  });
  const [hoveredValue, setHoveredValue] = React.useState<string | null>(null);
  const [activeValue, setActiveValue] = React.useState<string | null>(null);
  const [focusedValue, setFocusedValue] = React.useState<string | null>(null);
  const [isFocusVisible, setIsFocusVisible] = React.useState(false);
  const [swipeStatus, setSwipeStatus] = React.useState<"idle" | "dragging">("idle");
  const [swipeMoveX, setSwipeMoveX] = React.useState<number>(0);

  const tabValues = dom.getAllValues(props.id);
  const tabEnabledValues = dom.getEnabledValues(props.id);
  const currentTabIndex = dom.getTabIndex(value, props.id);
  const currentTabEnabledIndex = dom.getTabIndexOnlyEnabled(value, props.id);

  const events = {
    moveNext: () => {
      const isLast = currentTabEnabledIndex === tabEnabledValues.length - 1;
      if (isLast) return;

      const nextIndex = (tabEnabledValues.indexOf(value) + 1) % tabEnabledValues.length;
      setValue(tabEnabledValues[nextIndex]);
    },
    movePrev: () => {
      const isFirst = currentTabEnabledIndex === 0;
      if (isFirst) return;

      const prevIndex =
        (tabEnabledValues.indexOf(value) - 1 + tabEnabledValues.length) % tabEnabledValues.length;
      setValue(tabEnabledValues[prevIndex]);
    },
    setValue,
    setSwipeMoveX,
    setHoveredValue,
    setActiveValue,
    setFocusedValue,
    setIsFocusVisible,
    dragStart: () => setSwipeStatus("dragging"),
    dragEnd: () => {
      setSwipeStatus("idle");
      setSwipeMoveX(0);
    },
  };

  return {
    value,
    hoveredValue,
    activeValue,
    focusedValue,
    isFocusVisible,
    currentTabIndex,
    currentTabEnabledIndex,
    tabValues,
    tabEnabledValues,
    swipeStatus,
    events,
    swipeMoveX,
  };
}

export function useTabs(props: UseTabsProps) {
  const id = useId();
  const {
    swipeStatus,
    swipeMoveX,
    value,
    currentTabIndex,
    currentTabEnabledIndex,
    events,
    tabValues,
    tabEnabledValues,
    activeValue,
    focusedValue,
    hoveredValue,
    isFocusVisible,
  } = useTabsState({
    id,
    ...props,
  });
  const {
    value: omitValue,
    defaultValue: omitDefaultValue,
    onValueChange: omitOnValueChange,
    isSwipeable = false,
    orientation = "horizontal",
    ...restProps
  } = props;

  const getDragProps = useGesture(
    {
      onDragStart: () => {
        if (!isSwipeable) return;

        events.dragStart();
      },

      onDragEnd: ({ swipe: [swipeX] }) => {
        if (!isSwipeable) return;

        if (swipeX === -1) events.moveNext();
        if (swipeX === 1) events.movePrev();

        events.dragEnd();
      },

      onDrag: ({ movement: [mx] }) => {
        if (!isSwipeable) return;

        events.setSwipeMoveX(mx);
      },
    },
    {
      drag: {
        preventScrollAxis: "y",
        preventDefault: true,
        swipe: {
          distance: 50,
          velocity: 0.3,
        },
      },
    },
  );

  return {
    value,
    currentTabIndex,
    currentTabEnabledIndex,
    tabCount: tabValues.length,
    tabEnabledCount: tabEnabledValues.length,
    swipeStatus,
    swipeMoveX,

    getDragProps,

    restProps,
    rootProps: elementProps({
      id: dom.getRootId(id),
      "data-orientation": orientation,
    }),

    tabTriggerListProps: elementProps({
      id: dom.getTabTriggerListId(id),
      "aria-orientation": orientation,
      "data-orientation": orientation,
    }),
    getTabTriggerProps: (props: TriggerProps) => {
      const { isDisabled, value: triggerValue } = props;

      const itemState = {
        isDisabled,
        isSelected: value === triggerValue,
        isFocused: focusedValue === triggerValue,
        isHovered: hoveredValue === triggerValue,
        isActive: activeValue === triggerValue,
      };

      const itemStateProps = {
        "data-focus": dataAttr(itemState.isFocused),
        "data-focus-visible": dataAttr(itemState.isFocused && isFocusVisible),
        "data-active": dataAttr(itemState.isActive),
        "data-hover": dataAttr(itemState.isHovered),
        "data-selected": dataAttr(itemState.isSelected),
        "data-disabled": dataAttr(itemState.isDisabled),
        "aria-disabled": ariaAttr(itemState.isDisabled),
        "aria-selected": ariaAttr(itemState.isSelected),
        tabIndex: itemState.isSelected ? 0 : -1,
      };

      return buttonProps({
        id: dom.getTabTriggerId(triggerValue, id),
        role: "tab",
        type: "button",
        ...itemStateProps,
        disabled: isDisabled,
        "data-value": triggerValue,
        "data-orientation": orientation,
        "data-ownedby": dom.getTabTriggerListId(id),
        "aria-controls": dom.getTabTriggerId(triggerValue, id),
        onClick() {
          if (itemState.isDisabled) return;
          events.setValue(triggerValue);
        },
        onPointerMove() {
          if (itemState.isDisabled) return;
          events.setHoveredValue(triggerValue);
        },
        onPointerLeave() {
          if (itemState.isDisabled) return;
          events.setHoveredValue(null);
          events.setActiveValue(null);
        },
        onPointerDown(event) {
          if (itemState.isDisabled) return;
          // On pointerdown, the input blurs and returns focus to the `body`,
          // we need to prevent this.
          if (itemState.isFocused && event.pointerType === "mouse") {
            event.preventDefault();
          }
          events.setActiveValue(triggerValue);
        },
        onPointerUp() {
          if (itemState.isDisabled) return;
          events.setActiveValue(null);
        },
      });
    },

    tabContentListProps: elementProps({
      id: dom.getTabContentListId(id),
      "data-orientation": orientation,
    }),
    tabContentCameraProps: elementProps({
      id: dom.getTabContentCameraId(id),
      "data-orientation": orientation,
    }),
    getTabContentProps: (props: ContentProps) => {
      const { value: contentValue } = props;
      const isSelected = value === contentValue;

      const tabContentId = dom.getTabTriggerId(contentValue, id);
      const isDisabled = !!dom.itemById(dom.getDisabledElements(id), tabContentId);

      return elementProps({
        id: tabContentId,
        role: "tabpanel",
        "data-selected": dataAttr(isSelected),
        "data-orientation": orientation,
        "data-ownedby": dom.getTabTriggerListId(id),
        "aria-labelledby": dom.getTabTriggerId(contentValue, id),
        "aria-selected": ariaAttr(isSelected),
        "aria-hidden": isDisabled ? undefined : !isSelected,
        hidden: isDisabled,
      });
    },

    tabIndicatorProps: elementProps({
      id: dom.getIndicatorId(id),
      "data-orientation": orientation,
    }),
  };
}
