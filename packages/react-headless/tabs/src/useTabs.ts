import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { useSize } from "@radix-ui/react-use-size";
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import type * as React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import * as dom from "./dom";
import { getNextIndex, getPrevIndex, scrollTabIntoView } from "./utils";

export interface UseTabsStateProps {
  value?: string;

  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

function useTabsState(props: UseTabsStateProps) {
  const [interactionState, setInteractionState] = useState<"idle" | "focused">("idle");

  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? undefined,
    onChange: props.onValueChange,
  });

  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  const [listEl, listRef] = useState<HTMLElement | null>(null);
  const [triggerEls, setTriggerEls] = useState<Record<string, HTMLElement>>({});
  const selectedTriggerEl = value ? triggerEls[value] : null;
  const selectedTriggerSize = useSize(selectedTriggerEl);

  const enabledValues = useMemo(() => (listEl ? dom.getEnabledValues(listEl) : []), [listEl]);
  const contentIndex = value ? enabledValues.indexOf(value) : -1;

  const prevIndex = contentIndex >= 0 ? getPrevIndex(contentIndex, enabledValues.length) : -1;
  const nextIndex = contentIndex >= 0 ? getNextIndex(contentIndex, enabledValues.length) : -1;

  // Scroll selected tab into view when it changes
  // TODO: this implementation is temporary, we should create some sort of hook or plugin system
  //       to allow users to customize the scroll behavior.
  useEffect(() => {
    if (selectedTriggerEl && listEl) {
      scrollTabIntoView(selectedTriggerEl, listEl, { scrollPadding: 16 });
    }
  }, [selectedTriggerEl, listEl]);

  const actions = {
    selectPrev: () => {
      const prevValue = enabledValues[prevIndex];
      if (!prevValue) return;
      setValue(prevValue);
    },
    selectNext: () => {
      const nextValue = enabledValues[nextIndex];
      if (!nextValue) return;
      setValue(nextValue);
    },
    selectFirst: () => {
      const firstValue = enabledValues[0];
      if (!firstValue) return;
      setValue(firstValue);
    },
    selectLast: () => {
      const lastValue = enabledValues[enabledValues.length - 1];
      if (!lastValue) return;
      setValue(lastValue);
    },
    setFocusedValue: (value: string) => {
      setFocusedValue(value);
    },
    clearFocusedValue: () => {
      setFocusedValue(null);
    },
    setValue: (value: string) => {
      setValue(value);
    },
  };

  const events = {
    arrowPrev: () => {
      if (interactionState === "focused") {
        actions.selectPrev();
        setIsFocusVisible(true);
      }
    },
    arrowNext: () => {
      if (interactionState === "focused") {
        actions.selectNext();
        setIsFocusVisible(true);
      }
    },
    arrowUp: () => {
      if (interactionState === "focused") {
        actions.selectPrev();
        setIsFocusVisible(true);
      }
    },
    arrowDown: () => {
      if (interactionState === "focused") {
        actions.selectNext();
        setIsFocusVisible(true);
      }
    },
    home: () => {
      if (interactionState === "focused") {
        actions.selectFirst();
        setIsFocusVisible(true);
      }
    },
    end: () => {
      if (interactionState === "focused") {
        actions.selectLast();
        setIsFocusVisible(true);
      }
    },
    tabFocus: (value: string) => {
      actions.setFocusedValue(value);
      if (interactionState === "idle") {
        setInteractionState("focused");
      }
    },
    tabBlur: () => {
      if (interactionState === "focused") {
        actions.clearFocusedValue();
        setInteractionState("idle");
      }
    },
    tabClick: (value: string) => {
      actions.setFocusedValue(value);
      actions.setValue(value);
      if (interactionState === "idle") {
        setInteractionState("focused");
      }
    },

    setValue: actions.setValue,
    selectNext: actions.selectNext,
    selectPrev: actions.selectPrev,
    setContentIndex: useCallback(
      (index: number) => {
        const valueFromIndex = enabledValues[index];
        if (!valueFromIndex) return;

        setValue(valueFromIndex);
      },
      [enabledValues, setValue],
    ),
    setIsFocusVisible,

    mountTrigger: (value: string, el: HTMLElement) => {
      setTriggerEls((prev) => ({ ...prev, [value]: el }));
    },
    unmountTrigger: (value: string) => {
      setTriggerEls((prev) => {
        const { [value]: _, ...rest } = prev;
        return rest;
      });
    },
  };

  return {
    refs: {
      list: listRef,
    },
    interactionState,
    value,
    isSSR,
    triggerRect: {
      width: selectedTriggerSize?.width || 0,
      height: selectedTriggerSize?.height || 0,
      left: selectedTriggerEl?.offsetLeft || 0,
    },
    focusedValue,
    isFocusVisible,
    contentIndex,
    events,
  };
}

export interface UseTabsProps extends UseTabsStateProps {
  orientation?: "horizontal" | "vertical";
}

export interface UseTabsTriggerProps {
  value: string;

  disabled?: boolean;
}

export interface UseTabsContentProps {
  value: string;
}

export type UseTabsReturn = ReturnType<typeof useTabs>;

export type GetTriggerPropsReturn = ReturnType<UseTabsReturn["getTriggerProps"]>;

export function useTabs(props: UseTabsProps) {
  const autoId = useId();
  const {
    refs,
    interactionState,
    value,
    isSSR,
    events,
    triggerRect,
    focusedValue,
    isFocusVisible,
    contentIndex,
  } = useTabsState(props);
  const { orientation = "horizontal" } = props;
  const focused = interactionState === "focused";

  const stateProps = elementProps({
    "data-orientation": orientation,
    "data-focus": dataAttr(focused),
    "data-ssr": dataAttr(isSSR),
  });

  return {
    refs,
    value,
    contentIndex,
    triggerRect,

    selectNext: events.selectNext,
    selectPrev: events.selectPrev,
    setValue: events.setValue,
    setContentIndex: events.setContentIndex,

    stateProps,

    rootProps: elementProps({
      ...stateProps,
      style: {
        "--indicator-left": `${triggerRect.left}px`,
        "--indicator-width": `${triggerRect.width}px`,
      } as React.CSSProperties,
    }),

    listProps: elementProps({
      id: dom.getListId(autoId),
      role: "tablist",
      "aria-orientation": orientation,
      ...stateProps,

      onKeyDown(event) {
        if (event.defaultPrevented) return;
        if (event.nativeEvent.isComposing) return;

        // TODO: support activationMode="manual"
        switch (event.key) {
          case "ArrowLeft":
            if (orientation !== "horizontal") return;
            events.arrowPrev();
            break;
          case "ArrowRight":
            if (orientation !== "horizontal") return;
            events.arrowNext();
            break;
          case "ArrowUp":
            if (orientation !== "vertical") return;
            events.arrowPrev();
            break;
          case "ArrowDown":
            if (orientation !== "vertical") return;
            events.arrowNext();
            break;
          case "Home": {
            events.home();
            break;
          }
          case "End": {
            events.end();
            break;
          }
        }
      },
    }),

    getTriggerProps: (props: UseTabsTriggerProps) => {
      const { disabled: isDisabled, value: triggerValue } = props;

      const itemState = {
        isDisabled,
        isSelected: value === triggerValue,
        isFocused: focusedValue === triggerValue,
      };

      const itemStateProps = {
        "data-focus": dataAttr(itemState.isFocused),
        "data-focus-visible": dataAttr(itemState.isFocused && isFocusVisible),
        "data-selected": dataAttr(itemState.isSelected),
        "data-disabled": dataAttr(itemState.isDisabled),
        "data-ssr": dataAttr(isSSR),
        "aria-disabled": ariaAttr(itemState.isDisabled),
        "aria-selected": ariaAttr(itemState.isSelected),
      };

      const ref = useRef<HTMLButtonElement>(null);

      useLayoutEffect(() => {
        if (ref.current) {
          events.mountTrigger(triggerValue, ref.current);
        }

        () => {
          events.unmountTrigger(triggerValue);
        };
      }, [triggerValue]);

      return {
        ...itemState,

        refs: {
          root: ref,
        },

        stateProps: itemStateProps,

        rootProps: buttonProps({
          id: dom.getTriggerId(triggerValue, autoId),
          role: "tab",
          type: "button",
          disabled: isDisabled,
          tabIndex: itemState.isSelected ? 0 : -1,
          ...itemStateProps,
          "data-value": triggerValue,
          "data-orientation": orientation,
          "data-ownedby": dom.getListId(autoId),
          "aria-controls": dom.getContentId(triggerValue, autoId),
          onClick(event) {
            if (itemState.isDisabled) return;
            if (event.defaultPrevented) return;
            events.tabClick(triggerValue);
          },
          onFocus(event) {
            events.tabFocus(props.value);
            events.setIsFocusVisible(event.target.matches(":focus-visible"));
          },
          onBlur(event) {
            const target = event.relatedTarget as HTMLElement | null;
            if (target?.getAttribute("role") !== "tab") {
              events.tabBlur();
            }
            events.setIsFocusVisible(false);
          },
        }),
      };
    },

    getContentProps: (props: UseTabsContentProps) => {
      const { value: contentValue } = props;
      const triggerId = dom.getTriggerId(contentValue, autoId);
      const isSelected = value === contentValue;

      return elementProps({
        id: dom.getContentId(contentValue, autoId),
        tabIndex: -1,

        role: "tabpanel",
        "aria-labelledby": triggerId,
        "aria-selected": ariaAttr(isSelected),
        "aria-hidden": !isSelected,

        "data-selected": dataAttr(isSelected),
        "data-orientation": orientation,
        "data-ownedby": dom.getListId(autoId),
      });
    },

    indicatorProps: elementProps({
      ...stateProps,
    }),
  };
}
