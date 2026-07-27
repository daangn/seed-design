"use client";

import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import * as React from "react";
import { useWheelPickerContext } from "./WheelPickerContext";
import {
  clampPhysicalIndex,
  getCentralPhysicalIndex,
  getPhysicalOptionCount,
  toLogicalIndex,
} from "./utils";

const SCROLL_SETTLE_DELAY = 120;

export interface WheelPickerOption {
  value: string;
  label: React.ReactNode;
}

export interface UseWheelPickerColumnProps {
  options: readonly WheelPickerOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * @default false
   */
  loop?: boolean;
  getAriaValueText?: (value: string) => string;
}

interface RenderedWheelPickerOption extends WheelPickerOption {
  logicalIndex: number;
  physicalIndex: number;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useWheelPickerColumn({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  loop = false,
  getAriaValueText,
}: UseWheelPickerColumnProps) {
  const { itemSize, visibleItemCount, disabled, readOnly } = useWheelPickerContext();
  const fallbackValue = options[0]?.value;
  const optionValues = React.useMemo(
    () => new Set(options.map((option) => option.value)),
    [options],
  );
  const resolvedDefaultValue =
    defaultValue !== undefined && optionValues.has(defaultValue) ? defaultValue : fallbackValue;

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: resolvedDefaultValue,
    onChange: onValueChange,
  });

  const resolvedValue = value !== undefined && optionValues.has(value) ? value : fallbackValue;
  const logicalIndex = Math.max(
    options.findIndex((option) => option.value === resolvedValue),
    0,
  );
  const shouldLoop = loop && options.length > 1;
  const physicalOptionCount = getPhysicalOptionCount(options.length, visibleItemCount, shouldLoop);
  const centralPhysicalIndex = getCentralPhysicalIndex(
    logicalIndex,
    options.length,
    visibleItemCount,
    shouldLoop,
  );

  const renderedOptions = React.useMemo<RenderedWheelPickerOption[]>(() => {
    return Array.from({ length: physicalOptionCount }, (_, physicalIndex) => {
      const optionLogicalIndex = toLogicalIndex(physicalIndex, options.length);
      const option = options[optionLogicalIndex];

      return {
        ...option,
        logicalIndex: optionLogicalIndex,
        physicalIndex,
      };
    });
  }, [options, physicalOptionCount]);

  const columnRef = React.useRef<HTMLDivElement | null>(null);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const selectedElementRef = React.useRef<HTMLElement | null>(null);
  const isTouchingRef = React.useRef(false);

  const getNearestPhysicalIndex = React.useCallback(() => {
    const column = columnRef.current;
    if (!column || physicalOptionCount === 0) return 0;

    return clampPhysicalIndex(Math.round(column.scrollTop / itemSize), physicalOptionCount);
  }, [itemSize, physicalOptionCount]);

  const updateVisualSelection = React.useCallback((physicalIndex: number) => {
    const column = columnRef.current;
    if (!column) return;

    const nextSelectedElement = column.querySelector<HTMLElement>(
      `[data-wheel-picker-index="${physicalIndex}"]`,
    );

    if (selectedElementRef.current !== nextSelectedElement) {
      selectedElementRef.current?.removeAttribute("data-selected");
      nextSelectedElement?.setAttribute("data-selected", "");
      selectedElementRef.current = nextSelectedElement;
    }
  }, []);

  const scrollToPhysicalIndex = React.useCallback(
    (physicalIndex: number, behavior: ScrollBehavior) => {
      const column = columnRef.current;
      if (!column) return;

      column.scrollTo({
        top: clampPhysicalIndex(physicalIndex, physicalOptionCount) * itemSize,
        behavior,
      });
    },
    [itemSize, physicalOptionCount],
  );

  const settle = React.useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }

    if (isTouchingRef.current) return;
    if (options.length === 0) return;

    const nearestPhysicalIndex = getNearestPhysicalIndex();
    const nextLogicalIndex = toLogicalIndex(nearestPhysicalIndex, options.length);
    const nextValue = options[nextLogicalIndex]?.value;

    updateVisualSelection(nearestPhysicalIndex);

    if (disabled || readOnly) {
      if (nearestPhysicalIndex !== centralPhysicalIndex) {
        scrollToPhysicalIndex(centralPhysicalIndex, "auto");
        updateVisualSelection(centralPhysicalIndex);
      }
      return;
    }

    if (nextValue !== undefined && nextValue !== resolvedValue) {
      setValue(nextValue);
    }

    if (shouldLoop) {
      const nextCentralPhysicalIndex = getCentralPhysicalIndex(
        nextLogicalIndex,
        options.length,
        visibleItemCount,
        true,
      );

      if (nearestPhysicalIndex !== nextCentralPhysicalIndex) {
        scrollToPhysicalIndex(nextCentralPhysicalIndex, "auto");
        updateVisualSelection(nextCentralPhysicalIndex);
      }
    }
  }, [
    disabled,
    centralPhysicalIndex,
    getNearestPhysicalIndex,
    options,
    readOnly,
    resolvedValue,
    scrollToPhysicalIndex,
    setValue,
    shouldLoop,
    updateVisualSelection,
    visibleItemCount,
  ]);

  const scheduleSettle = React.useCallback(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    if (isTouchingRef.current) {
      settleTimerRef.current = null;
      return;
    }
    settleTimerRef.current = setTimeout(settle, SCROLL_SETTLE_DELAY);
  }, [settle]);

  const handleScroll = React.useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = null;
        updateVisualSelection(getNearestPhysicalIndex());
      });
    }

    scheduleSettle();
  }, [getNearestPhysicalIndex, scheduleSettle, updateVisualSelection]);

  const handleTouchStart = React.useCallback(() => {
    isTouchingRef.current = true;
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length > 0) return;

      isTouchingRef.current = false;
      scheduleSettle();
    },
    [scheduleSettle],
  );

  const handleTouchCancel = React.useCallback(() => {
    isTouchingRef.current = false;
    scheduleSettle();
  }, [scheduleSettle]);

  const moveToLogicalIndex = React.useCallback(
    (nextLogicalIndex: number) => {
      if (disabled || readOnly || options.length === 0) return;

      const normalizedLogicalIndex = shouldLoop
        ? toLogicalIndex(nextLogicalIndex, options.length)
        : Math.min(Math.max(nextLogicalIndex, 0), options.length - 1);

      const currentPhysicalIndex = getNearestPhysicalIndex();
      const currentLogicalIndex = toLogicalIndex(currentPhysicalIndex, options.length);
      let nextPhysicalIndex = currentPhysicalIndex + (normalizedLogicalIndex - currentLogicalIndex);

      if (shouldLoop) {
        if (normalizedLogicalIndex === 0 && currentLogicalIndex === options.length - 1) {
          nextPhysicalIndex = currentPhysicalIndex + 1;
        } else if (normalizedLogicalIndex === options.length - 1 && currentLogicalIndex === 0) {
          nextPhysicalIndex = currentPhysicalIndex - 1;
        }
      }

      scrollToPhysicalIndex(nextPhysicalIndex, prefersReducedMotion() ? "auto" : "smooth");
      scheduleSettle();
    },
    [
      disabled,
      getNearestPhysicalIndex,
      options.length,
      readOnly,
      scheduleSettle,
      scrollToPhysicalIndex,
      shouldLoop,
    ],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || readOnly) return;

      const currentPhysicalIndex = getNearestPhysicalIndex();
      const currentLogicalIndex = toLogicalIndex(currentPhysicalIndex, options.length);

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          moveToLogicalIndex(currentLogicalIndex - 1);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveToLogicalIndex(currentLogicalIndex + 1);
          break;
        case "Home":
          event.preventDefault();
          moveToLogicalIndex(0);
          break;
        case "End":
          event.preventDefault();
          moveToLogicalIndex(options.length - 1);
          break;
      }
    },
    [disabled, getNearestPhysicalIndex, moveToLogicalIndex, options.length, readOnly],
  );

  const getOptionProps = React.useCallback(
    (option: RenderedWheelPickerOption) =>
      elementProps({
        "aria-hidden": true,
        "data-wheel-picker-index": option.physicalIndex,
        "data-wheel-picker-value": option.value,
        "data-selected": dataAttr(option.physicalIndex === centralPhysicalIndex),
        onClick: () => {
          if (disabled || readOnly) return;

          scrollToPhysicalIndex(option.physicalIndex, prefersReducedMotion() ? "auto" : "smooth");
          scheduleSettle();
        },
      }),
    [centralPhysicalIndex, disabled, readOnly, scheduleSettle, scrollToPhysicalIndex],
  );

  useLayoutEffect(() => {
    if (!columnRef.current || options.length === 0) return;

    columnRef.current.scrollTop = centralPhysicalIndex * itemSize;
    updateVisualSelection(centralPhysicalIndex);
  }, [centralPhysicalIndex, itemSize, options.length, updateVisualSelection]);

  React.useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    column.addEventListener("scrollend", settle);
    return () => column.removeEventListener("scrollend", settle);
  }, [settle]);

  React.useEffect(
    () => () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    },
    [],
  );

  if (process.env.NODE_ENV !== "production") {
    const hasDuplicateValues = optionValues.size !== options.length;
    if (hasDuplicateValues) {
      console.warn("WheelPicker.Column: option value는 고유해야 합니다.");
    }
    if (options.length === 0) {
      console.warn("WheelPicker.Column: options에는 하나 이상의 항목이 필요합니다.");
    }
    if (valueProp !== undefined && !optionValues.has(valueProp)) {
      console.warn("WheelPicker.Column: value는 options에 존재해야 합니다.");
    }
  }

  const currentOption = options[logicalIndex];
  const isInert = disabled || options.length === 0;

  return {
    renderedOptions,
    refs: {
      column: columnRef,
    },
    columnProps: elementProps({
      role: "spinbutton",
      tabIndex: isInert ? -1 : 0,
      "aria-valuemin": options.length > 0 ? 0 : undefined,
      "aria-valuemax": options.length > 0 ? options.length - 1 : undefined,
      "aria-valuenow": options.length > 0 ? logicalIndex : undefined,
      "aria-valuetext":
        currentOption === undefined
          ? undefined
          : (getAriaValueText?.(currentOption.value) ??
            (typeof currentOption.label === "string" ? currentOption.label : currentOption.value)),
      "aria-disabled": isInert || undefined,
      "aria-readonly": readOnly || undefined,
      "data-disabled": dataAttr(isInert),
      "data-readonly": dataAttr(readOnly),
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
      onScroll: handleScroll,
      onKeyDown: handleKeyDown,
    }),
    getOptionProps,
  };
}
