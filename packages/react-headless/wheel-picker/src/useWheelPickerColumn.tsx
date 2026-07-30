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
const WHEEL_ALIGNMENT_DURATION = 160;
const LOOP_RECENTER_BUFFER_VIEWPORTS = 2;

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

export interface RenderedWheelPickerOption extends WheelPickerOption {
  logicalIndex: number;
  physicalIndex: number;
}

export interface WheelPickerOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-hidden": true;
  "data-wheel-picker-index": number;
  "data-wheel-picker-value": string;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getWheelDeltaInPixels(event: WheelEvent, itemSize: number, viewportSize: number) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * itemSize;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * viewportSize;
  return event.deltaY;
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
  const wheelAlignmentFrameRef = React.useRef<number | null>(null);
  const selectedElementRef = React.useRef<HTMLElement | null>(null);
  const keyboardTargetPhysicalIndexRef = React.useRef<number | null>(null);
  const isTouchingRef = React.useRef(false);
  const isWheelingRef = React.useRef(false);
  const isWheelAligningRef = React.useRef(false);

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
      keyboardTargetPhysicalIndexRef.current = centralPhysicalIndex;
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
      keyboardTargetPhysicalIndexRef.current = nextCentralPhysicalIndex;
    } else {
      keyboardTargetPhysicalIndexRef.current = nearestPhysicalIndex;
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

  const finishWheelSettle = React.useCallback(() => {
    if (wheelAlignmentFrameRef.current !== null) {
      cancelAnimationFrame(wheelAlignmentFrameRef.current);
      wheelAlignmentFrameRef.current = null;
    }
    isWheelAligningRef.current = false;
    isWheelingRef.current = false;
    columnRef.current?.removeAttribute("data-wheel-picker-scrolling");
    settle();
  }, [settle]);

  const alignWheelToPhysicalIndex = React.useCallback(
    (physicalIndex: number) => {
      const column = columnRef.current;
      if (!column) return;

      const startScrollTop = column.scrollTop;
      const targetScrollTop = clampPhysicalIndex(physicalIndex, physicalOptionCount) * itemSize;
      const distance = targetScrollTop - startScrollTop;
      let startTime: number | undefined;
      let previousTime: number | undefined;
      let elapsed = 0;

      const animate = (time: number) => {
        if (!isWheelAligningRef.current) return;
        startTime ??= time;
        if (previousTime !== undefined) {
          elapsed += Math.max(time - previousTime, 16);
        }
        previousTime = time;

        const progress = Math.min(
          Math.max(time - startTime, elapsed) / WHEEL_ALIGNMENT_DURATION,
          1,
        );
        const easedProgress = 1 - (1 - progress) ** 3;
        column.scrollTop = startScrollTop + distance * easedProgress;

        if (progress < 1) {
          wheelAlignmentFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        wheelAlignmentFrameRef.current = null;
        finishWheelSettle();
      };

      wheelAlignmentFrameRef.current = requestAnimationFrame(animate);
    },
    [finishWheelSettle, itemSize, physicalOptionCount],
  );

  const scheduleSettle = React.useCallback(() => {
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    if (isTouchingRef.current) {
      settleTimerRef.current = null;
      return;
    }
    settleTimerRef.current = setTimeout(() => {
      const column = columnRef.current;
      if (isWheelingRef.current && column) {
        const nearestPhysicalIndex = getNearestPhysicalIndex();
        const nearestScrollTop = nearestPhysicalIndex * itemSize;
        if (
          !prefersReducedMotion() &&
          Math.abs(column.scrollTop - nearestScrollTop) > Number.EPSILON
        ) {
          isWheelAligningRef.current = true;
          alignWheelToPhysicalIndex(nearestPhysicalIndex);
          return;
        }

        finishWheelSettle();
        return;
      }

      settle();
    }, SCROLL_SETTLE_DELAY);
  }, [alignWheelToPhysicalIndex, finishWheelSettle, getNearestPhysicalIndex, itemSize, settle]);

  const handleScroll = React.useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = null;
        updateVisualSelection(getNearestPhysicalIndex());
      });
    }

    if (!isWheelAligningRef.current) scheduleSettle();
  }, [getNearestPhysicalIndex, scheduleSettle, updateVisualSelection]);

  const handleWheel = React.useCallback(
    (event: WheelEvent) => {
      const column = columnRef.current;
      if (!column || event.deltaY === 0) return;

      keyboardTargetPhysicalIndexRef.current = null;
      if (wheelAlignmentFrameRef.current !== null) {
        cancelAnimationFrame(wheelAlignmentFrameRef.current);
        wheelAlignmentFrameRef.current = null;
      }
      isWheelAligningRef.current = false;
      if (!isWheelingRef.current) {
        isWheelingRef.current = true;
        column.setAttribute("data-wheel-picker-scrolling", "");
      }
      scheduleSettle();

      if (!shouldLoop) return;

      const viewportSize = visibleItemCount * itemSize;
      const wheelDelta = getWheelDeltaInPixels(event, itemSize, viewportSize);
      const maxScrollTop = (physicalOptionCount - 1) * itemSize;
      const boundaryBuffer = viewportSize * LOOP_RECENTER_BUFFER_VIEWPORTS;
      const projectedScrollTop = column.scrollTop + wheelDelta;
      const isApproachingStart = wheelDelta < 0 && projectedScrollTop <= boundaryBuffer;
      const isApproachingEnd =
        wheelDelta > 0 && projectedScrollTop >= maxScrollTop - boundaryBuffer;

      if (!isApproachingStart && !isApproachingEnd) return;

      const cycleSize = options.length * itemSize;
      const physicalCycleCount = physicalOptionCount / options.length;
      const bufferCycleCount = Math.max(1, Math.ceil(boundaryBuffer / cycleSize));
      const targetCycle = isApproachingStart
        ? physicalCycleCount - 1 - bufferCycleCount
        : bufferCycleCount;
      const offsetInCycle = ((column.scrollTop % cycleSize) + cycleSize) % cycleSize;

      column.scrollTop = targetCycle * cycleSize + offsetInCycle;
      updateVisualSelection(getNearestPhysicalIndex());
    },
    [
      getNearestPhysicalIndex,
      itemSize,
      options.length,
      physicalOptionCount,
      shouldLoop,
      scheduleSettle,
      updateVisualSelection,
      visibleItemCount,
    ],
  );

  const handleTouchStart = React.useCallback(() => {
    keyboardTargetPhysicalIndexRef.current = null;
    if (wheelAlignmentFrameRef.current !== null) {
      cancelAnimationFrame(wheelAlignmentFrameRef.current);
      wheelAlignmentFrameRef.current = null;
    }
    isWheelAligningRef.current = false;
    isWheelingRef.current = false;
    columnRef.current?.removeAttribute("data-wheel-picker-scrolling");
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
    (nextLogicalIndex: number, behavior: ScrollBehavior) => {
      if (disabled || readOnly || options.length === 0) return;

      const normalizedLogicalIndex = shouldLoop
        ? toLogicalIndex(nextLogicalIndex, options.length)
        : Math.min(Math.max(nextLogicalIndex, 0), options.length - 1);

      const currentPhysicalIndex =
        keyboardTargetPhysicalIndexRef.current ?? getNearestPhysicalIndex();
      const currentLogicalIndex = toLogicalIndex(currentPhysicalIndex, options.length);
      let nextPhysicalIndex = currentPhysicalIndex + (normalizedLogicalIndex - currentLogicalIndex);
      let nextBehavior = behavior;

      if (shouldLoop) {
        if (normalizedLogicalIndex === 0 && currentLogicalIndex === options.length - 1) {
          nextPhysicalIndex = currentPhysicalIndex + 1;
        } else if (normalizedLogicalIndex === options.length - 1 && currentLogicalIndex === 0) {
          nextPhysicalIndex = currentPhysicalIndex - 1;
        }

        const boundaryBuffer = visibleItemCount * LOOP_RECENTER_BUFFER_VIEWPORTS;
        if (
          nextPhysicalIndex <= boundaryBuffer ||
          nextPhysicalIndex >= physicalOptionCount - 1 - boundaryBuffer
        ) {
          nextPhysicalIndex = getCentralPhysicalIndex(
            normalizedLogicalIndex,
            options.length,
            visibleItemCount,
            true,
          );
          nextBehavior = "auto";
        }
      }

      keyboardTargetPhysicalIndexRef.current = clampPhysicalIndex(
        nextPhysicalIndex,
        physicalOptionCount,
      );
      scrollToPhysicalIndex(nextPhysicalIndex, nextBehavior);
      scheduleSettle();
    },
    [
      disabled,
      getNearestPhysicalIndex,
      options.length,
      physicalOptionCount,
      readOnly,
      scheduleSettle,
      scrollToPhysicalIndex,
      shouldLoop,
      visibleItemCount,
    ],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || readOnly) return;

      const currentPhysicalIndex =
        keyboardTargetPhysicalIndexRef.current ?? getNearestPhysicalIndex();
      const currentLogicalIndex = toLogicalIndex(currentPhysicalIndex, options.length);
      const behavior = prefersReducedMotion() || event.repeat ? "auto" : "smooth";

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          moveToLogicalIndex(currentLogicalIndex - 1, behavior);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveToLogicalIndex(currentLogicalIndex + 1, behavior);
          break;
        case "Home":
          event.preventDefault();
          moveToLogicalIndex(0, behavior);
          break;
        case "End":
          event.preventDefault();
          moveToLogicalIndex(options.length - 1, behavior);
          break;
      }
    },
    [disabled, getNearestPhysicalIndex, moveToLogicalIndex, options.length, readOnly],
  );

  const getOptionProps = React.useCallback(
    (option: RenderedWheelPickerOption): WheelPickerOptionProps =>
      elementProps({
        "aria-hidden": true,
        "data-wheel-picker-index": option.physicalIndex,
        "data-wheel-picker-value": option.value,
        onClick: () => {
          if (disabled || readOnly) return;

          keyboardTargetPhysicalIndexRef.current = null;
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
    keyboardTargetPhysicalIndexRef.current = centralPhysicalIndex;
  }, [centralPhysicalIndex, itemSize, options.length, updateVisualSelection]);

  React.useEffect(() => {
    const column = columnRef.current;
    if (!column) return;

    const handleScrollEnd = () => {
      if (isWheelAligningRef.current) return;
      if (isWheelingRef.current) return;
      settle();
    };

    column.addEventListener("wheel", handleWheel, { passive: true });
    column.addEventListener("scrollend", handleScrollEnd);
    return () => {
      column.removeEventListener("wheel", handleWheel);
      column.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [handleWheel, settle]);

  React.useEffect(
    () => () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      if (wheelAlignmentFrameRef.current !== null) {
        cancelAnimationFrame(wheelAlignmentFrameRef.current);
      }
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
