import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useSize } from "@radix-ui/react-use-size";
import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import type * as React from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import * as dom from "./dom";
import { getNextIndex, getPrevIndex, scrollTabIntoView } from "./utils";
import { useIsSSR } from "./useIsSSR";

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

  const [listEl, listRef] = useState<HTMLElement | null>(null);
  const [selectedTriggerEl, setSelectedTriggerEl] = useState<HTMLElement | null>(null);
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

  const selectPrevAction = useCallback(() => {
    const prevValue = enabledValues[prevIndex];
    if (!prevValue) return;
    setValue(prevValue);
  }, [enabledValues, prevIndex, setValue]);

  const selectNextAction = useCallback(() => {
    const nextValue = enabledValues[nextIndex];
    if (!nextValue) return;
    setValue(nextValue);
  }, [enabledValues, nextIndex, setValue]);

  const selectFirstAction = useCallback(() => {
    const firstValue = enabledValues[0];
    if (!firstValue) return;
    setValue(firstValue);
  }, [enabledValues, setValue]);

  const selectLastAction = useCallback(() => {
    const lastValue = enabledValues[enabledValues.length - 1];
    if (!lastValue) return;
    setValue(lastValue);
  }, [enabledValues, setValue]);

  const setFocusedValueAction = useCallback((value: string) => {
    setFocusedValue(value);
  }, []);

  const clearFocusedValueAction = useCallback(() => {
    setFocusedValue(null);
  }, []);

  const setValueAction = useCallback(
    (value: string) => {
      setValue(value);
    },
    [setValue],
  );

  const actions = {
    selectPrev: selectPrevAction,
    selectNext: selectNextAction,
    selectFirst: selectFirstAction,
    selectLast: selectLastAction,
    setFocusedValue: setFocusedValueAction,
    clearFocusedValue: clearFocusedValueAction,
    setValue: setValueAction,
  };

  const arrowPrevEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectPrev();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectPrev]);

  const arrowNextEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectNext();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectNext]);

  const arrowUpEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectPrev();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectPrev]);

  const arrowDownEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectNext();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectNext]);

  const homeEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectFirst();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectFirst]);

  const endEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectLast();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectLast]);

  const tabFocusEvent = useCallback(
    (value: string) => {
      actions.setFocusedValue(value);
      if (interactionState === "idle") {
        setInteractionState("focused");
      }
    },
    [interactionState, actions.setFocusedValue],
  );

  const tabBlurEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.clearFocusedValue();
      setInteractionState("idle");
    }
  }, [interactionState, actions.clearFocusedValue]);

  const tabClickEvent = useCallback(
    (value: string) => {
      actions.setValue(value);
      if (interactionState === "idle") {
        setInteractionState("focused");
      }
    },
    [interactionState, actions.setValue],
  );

  const setValueEvent = useCallback(
    (value: string) => {
      actions.setValue(value);
    },
    [actions.setValue],
  );

  const selectNextEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectNext();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectNext]);

  const selectPrevEvent = useCallback(() => {
    if (interactionState === "focused") {
      actions.selectPrev();
      setIsFocusVisible(true);
    }
  }, [interactionState, actions.selectPrev]);

  const setContentIndexEvent = useCallback(
    (index: number) => {
      const valueFromIndex = enabledValues[index];
      if (!valueFromIndex) return;
      actions.setValue(valueFromIndex);
    },
    [actions.setValue, enabledValues],
  );

  const setIsFocusVisibleEvent = useCallback((isFocusVisible: boolean) => {
    setIsFocusVisible(isFocusVisible);
  }, []);

  const setSelectedTriggerElEvent = useCallback((element: HTMLElement) => {
    setSelectedTriggerEl(element);
  }, []);

  const events = {
    arrowPrev: arrowPrevEvent,
    arrowNext: arrowNextEvent,
    arrowUp: arrowUpEvent,
    arrowDown: arrowDownEvent,
    home: homeEvent,
    end: endEvent,
    tabFocus: tabFocusEvent,
    tabBlur: tabBlurEvent,
    tabClick: tabClickEvent,

    setValue: setValueEvent,
    selectNext: selectNextEvent,
    selectPrev: selectPrevEvent,
    setContentIndex: setContentIndexEvent,

    setIsFocusVisible: setIsFocusVisibleEvent,

    setSelectedTriggerEl: setSelectedTriggerElEvent,
  };

  const refs = useMemo(
    () => ({
      list: listRef,
    }),
    [],
  );

  const triggerRect = useMemo(
    () => ({
      width: selectedTriggerSize?.width ?? selectedTriggerEl?.offsetWidth ?? 0,
      left: selectedTriggerEl?.offsetLeft ?? 0,
    }),
    [selectedTriggerSize, selectedTriggerEl],
  );

  const isSSR = useIsSSR();

  return {
    refs,
    interactionState,
    value,
    isSSR,
    triggerRect,
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

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-orientation": orientation,
        "data-focus": dataAttr(focused),
        "data-ssr": dataAttr(isSSR),
      }),
    [orientation, focused, isSSR],
  );

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

      const ref = (element: HTMLButtonElement | null) => {
        if (element && triggerValue === value) {
          events.setSelectedTriggerEl(element);
        }
      };

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
        "data-ssr": dataAttr(isSSR),
      });
    },

    indicatorProps: elementProps({
      ...stateProps,
    }),
  };
}
