// This code includes portions derived from radix-ui/primitives (https://github.com/radix-ui/primitives)
// Used under the MIT License: https://opensource.org/licenses/MIT

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  useCallback,
  useRef,
  useState,
  useMemo,
  type CSSProperties,
  useId,
  useEffect,
  type RefCallback,
} from "react";
import { dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useSupports } from "@seed-design/react-supports";
import { useSize } from "@radix-ui/react-use-size";
import { useIsSSR } from "./useIsSSR";
import { useElementSizesMap } from "./useElementSizesMap";

import {
  getClosestValueIndex,
  convertValueToPercentage,
  getDecimalCount,
  getNextSortedValues,
  getThumbInBoundsOffset,
  getStickyLabelOffset,
  hasMinStepsBetweenValues,
  linearScale,
  roundValue,
  getClosestAllowedValue,
  getNextAllowedValue,
  clamp,
} from "./utils";

interface UseSliderStateProps {
  min: number;
  max: number;

  /**
   * @default 1
   */
  step?: number;
  /**
   * Values that the slider thumbs can snap to. If not provided, the slider will snap to every step.
   * @default []
   */
  allowedValues?: number[];
  /**
   * @default 0
   */
  minStepsBetweenThumbs?: number;

  values?: number[];
  /**
   * @default [(min + max) / 2]
   */
  defaultValues?: number[];
  onValuesChange?: (value: number[]) => void;
  onValuesCommit?: (value: number[]) => void;

  /**
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
}

function useSliderState({
  min,
  max,
  step = 1,
  allowedValues,
  minStepsBetweenThumbs = 0,
  values: propValues,
  defaultValues: propDefaultValues,
  onValuesCommit,
  onValuesChange,
  dir = "ltr",
}: UseSliderStateProps) {
  const valueIndexToChangeRef = useRef<number>(0);

  const [rootEl, rootRef] = useState<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | undefined>(undefined);

  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownPosition = useRef<number>(0);
  const thumbRefsMap = useRef<Map<number, HTMLElement | null>>(new Map());
  const valueIndicatorRootRefsMap = useRef<Map<number, HTMLElement | null>>(new Map());

  const firstThumbSize = useSize(thumbRefsMap.current.get(0) ?? null);
  const rootSize = useSize(rootEl);
  const valueIndicatorRootSizes = useElementSizesMap(valueIndicatorRootRefsMap);

  const [values, setValues] = useControllableState({
    prop: propValues,
    defaultProp:
      propDefaultValues && propDefaultValues.length > 0 ? propDefaultValues : [(min + max) / 2],
    onChange: onValuesChange,
  });

  const valuesBeforeSlideStartRef = useRef(values);

  // Track uncommitted values to handle quick touch events on Android Chrome,
  // where onPointerMove fires (updating values) immediately before onPointerUp (ending slide)
  const uncommittedValuesRef = useRef<number[] | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false); // actual active state regardless of disabled/readOnly
  const [isDragging, setIsDragging] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [openThumbIndex, setOpenThumbIndex] = useState<number | null>(null);
  const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(null);
  const [shownIndicators, setShownIndicators] = useState<Set<number>>(new Set());
  const [focusVisibleThumbIndex, setFocusVisibleThumbIndex] = useState<number | null>(null);
  const pointerInteractingRef = useRef(false);

  const updateValues = useCallback(
    (value: number, atIndex: number, options?: { commit?: boolean }) => {
      const nextValue = (() => {
        if (allowedValues && allowedValues.length > 0)
          return getClosestAllowedValue(value, allowedValues);

        const decimalCount = getDecimalCount(step);
        const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);

        return clamp(snapToStep, [min, max]);
      })();

      setValues((prevValues) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);

        if (
          (!allowedValues || allowedValues.length === 0) &&
          hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step) === false
        ) {
          return prevValues;
        }

        const hasChanged = nextValues.some((val, index) => val !== prevValues[index]);

        if (!hasChanged) return prevValues;

        const newIndex = nextValues.indexOf(nextValue);
        valueIndexToChangeRef.current = newIndex;

        // Update activeThumbIndex when thumbs cross over during drag
        // This ensures only one value indicator is shown
        if (isDragging || isPointerDown) {
          setActiveThumbIndex(newIndex);
          // Also update openThumbIndex for hover mode to prevent both indicators from showing
          setOpenThumbIndex(newIndex);
        }

        if (options?.commit) {
          uncommittedValuesRef.current = null;
          onValuesCommit?.(nextValues);
        } else {
          uncommittedValuesRef.current = nextValues;
        }

        thumbRefsMap.current.get(valueIndexToChangeRef.current)?.focus();

        return nextValues;
      });
    },
    [
      min,
      max,
      step,
      allowedValues,
      minStepsBetweenThumbs,
      setValues,
      onValuesCommit,
      isDragging,
      isPointerDown,
    ],
  );

  const getValueFromPointer = useCallback(
    (pointerPosition: number) => {
      const rect = rectRef.current ?? rootEl?.getBoundingClientRect();
      if (!rect) return min;

      rectRef.current = rect;

      return linearScale(
        [0, rect.width],
        dir === "ltr" ? [min, max] : [max, min],
      )(pointerPosition - rect.left);
    },
    [min, max, dir, rootEl],
  );

  /**
   * finds the closest thumb to 'value' and updates that thumb
   */
  const handleSlideStart = useCallback(
    (value: number) => {
      updateValues(value, getClosestValueIndex(values, value));
    },
    [values, updateValues],
  );

  /**
   * updates the thumb that has been being moved
   */
  const handleSlideMove = useCallback(
    (value: number) => {
      updateValues(value, valueIndexToChangeRef.current);
    },
    [updateValues],
  );

  /**
   * when sliding ends, call onValuesCommit if there are uncommitted changes
   */
  const handleSlideEnd = useCallback(() => {
    if (uncommittedValuesRef.current) {
      const valuesToCommit = uncommittedValuesRef.current;

      uncommittedValuesRef.current = null;

      onValuesCommit?.(valuesToCommit);
    }

    rectRef.current = undefined;
  }, [onValuesCommit]);

  /**
   * Sets the first thumb to the start position (min or first allowedValue)
   */
  const setToStart = useCallback(() => {
    const targetValue = allowedValues?.[0] ?? min;
    updateValues(targetValue, 0, { commit: true });
  }, [allowedValues, min, updateValues]);

  /**
   * Sets the last thumb to the end position (max or last allowedValue)
   */
  const setToEnd = useCallback(() => {
    const targetValue = allowedValues?.[allowedValues.length - 1] ?? max;
    updateValues(targetValue, values.length - 1, { commit: true });
  }, [allowedValues, max, values.length, updateValues]);

  /**
   * Adjusts the value at the given index by step * multiplier * direction
   * @param atIndex - The index of the value to adjust
   * @param direction - The direction to move (1 for forward, -1 for backward)
   * @param multiplier - The multiplier for the step (default: 1)
   */
  const adjustValueByStep = useCallback(
    (atIndex: number, direction: 1 | -1, multiplier = 1) => {
      const currentValue = values[atIndex] ?? min;

      if (allowedValues && allowedValues.length > 0) {
        let nextValue = currentValue;

        for (let i = 0; i < Math.abs(multiplier); i++) {
          const next = getNextAllowedValue(nextValue, direction, allowedValues);
          if (next === null) break;

          nextValue = next;
        }

        updateValues(nextValue, atIndex, { commit: true });
      } else {
        updateValues(currentValue + step * multiplier * direction, atIndex, { commit: true });
      }
    },
    [values, allowedValues, min, step, updateValues],
  );

  useEffect(() => {
    return () => {
      if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
    };
  }, []);

  return {
    refs: {
      root: rootRef,
    },

    firstThumbSize,
    rootSize,
    valueIndicatorRootRefsMap,
    valueIndicatorRootSizes,

    min,
    max,
    step,
    allowedValues,
    values,
    setValues,
    updateValues,
    valueIndexToChangeRef,
    valuesBeforeSlideStartRef,
    dragTimerRef,
    pointerDownPosition,
    thumbRefsMap,
    dir,

    isHovered,
    setIsHovered,
    isActive,
    setIsActive,
    isDragging,
    setIsDragging,
    isPointerDown,
    setIsPointerDown,
    openThumbIndex,
    setOpenThumbIndex,
    activeThumbIndex,
    setActiveThumbIndex,
    shownIndicators,
    setShownIndicators,
    focusVisibleThumbIndex,
    setFocusVisibleThumbIndex,
    pointerInteractingRef,

    getValueFromPointer,

    handleSlideStart,
    handleSlideMove,
    handleSlideEnd,

    setToStart,
    setToEnd,
    adjustValueByStep,
  };
}

export interface UseSliderProps extends UseSliderStateProps {
  /**
   * @default false
   */
  disabled?: boolean;
  /**
   * @default false
   */
  readOnly?: boolean;
  /**
   * @default false
   */
  invalid?: boolean;

  name?: string;

  /**
   * @default 10
   */
  jumpMultiplier?: number;

  getAriaValuetext?: (value: number) => string;
  getAriaLabel?: (thumbIndex: number) => string;
  getAriaLabelledby?: (thumbIndex: number) => string;

  /**
   * @default (params) => params.value
   */
  getValueIndicatorLabel?: (params: { value: number; thumbIndex: number }) => React.ReactNode;

  /**
   * @default "auto"
   */
  valueIndicatorTrigger?: "active" | "hover" | "auto";

  /**
   * @default 150
   */
  dragStartDelayInMilliseconds?: number;
}

export type UseSliderReturn = ReturnType<typeof useSlider>;

export function useSlider({
  disabled,
  readOnly,
  invalid,
  name,

  jumpMultiplier = 10,
  getAriaValuetext,
  getAriaLabel,
  getAriaLabelledby,
  getValueIndicatorLabel = ({ value }) => value,
  valueIndicatorTrigger = "auto",
  dragStartDelayInMilliseconds = 150,

  ...props
}: UseSliderProps) {
  const api = useSliderState(props);
  const isSSR = useIsSSR();
  const id = useId();
  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  const resolvedTrigger = useMemo((): "active" | "hover" => {
    if (valueIndicatorTrigger !== "auto") return valueIndicatorTrigger;
    if (typeof window === "undefined") return "active";
    return window.matchMedia("(hover: hover)").matches ? "hover" : "active";
  }, [valueIndicatorTrigger]);

  const isLtr = api.dir === "ltr";

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-hover": dataAttr(api.isHovered),
        "data-active": dataAttr(api.isActive),
        "data-disabled": dataAttr(disabled),
        "data-readonly": dataAttr(readOnly),
        "data-invalid": dataAttr(invalid),
        "data-dragging": dataAttr(api.isDragging),

        "data-ssr": dataAttr(isSSR),
        "data-dir": api.dir,
      }),
    [api.dir, api.isHovered, api.isActive, api.isDragging, disabled, readOnly, invalid, isSSR],
  );

  const getHasEverBeenShown = useCallback(
    (index: number) => api.shownIndicators.has(index),
    [api.shownIndicators],
  );

  const rootProps = useMemo(
    () =>
      elementProps({
        ...stateProps,

        dir: api.dir,

        onPointerLeave: () => {
          api.setIsHovered(false);
          api.setIsActive(false);
        },
        onPointerDown: (event) => {
          api.setIsActive(true);
          api.setFocusVisibleThumbIndex(null);
          api.pointerInteractingRef.current = true;

          if (disabled) return;
          if (event.target instanceof HTMLElement === false) return;

          api.setIsPointerDown(true);

          api.valuesBeforeSlideStartRef.current = api.values;

          event.target.setPointerCapture(event.pointerId);

          // Prevent browser focus behavior because we focus a thumb manually when values change.
          event.preventDefault();

          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (event.target.getAttribute("role") === "slider") {
            // target is thumb
            event.target.focus();

            const thumbIndex = getClosestValueIndex(
              api.values,
              api.getValueFromPointer(event.clientX),
            );
            api.valueIndexToChangeRef.current = thumbIndex;

            if (readOnly) return;

            api.setIsDragging(true);
            api.setActiveThumbIndex(thumbIndex);
            return;
          }

          // target is track

          if (readOnly) {
            // focus closest thumb
            const closestIndex = getClosestValueIndex(
              api.values,
              api.getValueFromPointer(event.clientX),
            );
            api.thumbRefsMap.current.get(closestIndex)?.focus();

            return;
          }

          // keep where the pointer was down
          api.pointerDownPosition.current = event.clientX;

          // Immediately determine which thumb will be affected
          const valueAtPointer = api.getValueFromPointer(event.clientX);
          const closestIndex = getClosestValueIndex(api.values, valueAtPointer);
          api.valueIndexToChangeRef.current = closestIndex;
          api.setActiveThumbIndex(closestIndex);

          // defer drag start to see if it's a slide or a click
          api.dragTimerRef.current = setTimeout(() => {
            api.setIsDragging(true);
            api.handleSlideStart(valueAtPointer);
          }, dragStartDelayInMilliseconds);
        },
        onPointerMove: (event) => {
          api.setIsHovered(true);

          if (disabled || readOnly) return;
          if (event.target instanceof HTMLElement === false) return;

          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          api.setIsDragging(true);

          if (api.dragTimerRef.current) {
            // if we had a drag timer running, clear it and start dragging immediately
            clearTimeout(api.dragTimerRef.current);
            api.dragTimerRef.current = null;

            // The activeThumbIndex was already set in pointerDown
            // Just verify valueIndexToChangeRef matches
            if (api.activeThumbIndex !== null) {
              api.valueIndexToChangeRef.current = api.activeThumbIndex;
            }
          }

          // moves the thumb being dragged
          api.handleSlideMove(api.getValueFromPointer(event.clientX));
        },
        onPointerUp: (event) => {
          api.setIsActive(false);
          api.setIsPointerDown(false);
          api.pointerInteractingRef.current = false;

          if (event.target instanceof HTMLElement === false) return;
          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          event.target.releasePointerCapture(event.pointerId);

          // Check if pointer is over the thumb that was being dragged
          // This prevents flicker when transitioning from drag to hover
          if (api.isDragging && event.clientX !== undefined && api.activeThumbIndex !== null) {
            const thumbElement = api.thumbRefsMap.current.get(api.activeThumbIndex);
            if (thumbElement) {
              const rect = thumbElement.getBoundingClientRect();
              const isOverThumb =
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom;

              if (isOverThumb) {
                // Keep open state when transitioning from drag to hover
                api.setOpenThumbIndex(api.activeThumbIndex);
              }
            }
          }

          api.setIsDragging(false);
          api.setActiveThumbIndex(null);

          if (api.dragTimerRef.current) {
            clearTimeout(api.dragTimerRef.current);
            api.dragTimerRef.current = null;

            // update immediately to where pointer was down since slide didn't start
            const valueAtPointer = api.getValueFromPointer(api.pointerDownPosition.current);
            const closestIndex = getClosestValueIndex(api.values, valueAtPointer);

            api.updateValues(valueAtPointer, closestIndex, { commit: true });
          }

          api.handleSlideEnd();
        },
        onKeyDown: (event) => {
          if (disabled || readOnly) return;

          const atIndex = api.valueIndexToChangeRef.current;

          switch (event.key) {
            case "Home": {
              api.setToStart();
              event.preventDefault();

              break;
            }
            case "End": {
              api.setToEnd();
              event.preventDefault();

              break;
            }

            case "PageUp": {
              api.adjustValueByStep(atIndex, 1, jumpMultiplier);
              event.preventDefault();

              break;
            }
            case "PageDown": {
              api.adjustValueByStep(atIndex, -1, jumpMultiplier);
              event.preventDefault();

              break;
            }

            case "ArrowUp":
            case "ArrowRight": {
              const direction = isLtr ? 1 : -1;
              const multiplier = event.shiftKey ? jumpMultiplier : 1;

              api.adjustValueByStep(atIndex, direction, multiplier);
              event.preventDefault();

              break;
            }

            case "ArrowLeft":
            case "ArrowDown": {
              const direction = isLtr ? -1 : 1;
              const multiplier = event.shiftKey ? jumpMultiplier : 1;

              api.adjustValueByStep(atIndex, direction, multiplier);
              event.preventDefault();

              break;
            }
          }
        },
      }),
    [
      api.activeThumbIndex,
      api.adjustValueByStep,
      api.dir,
      api.getValueFromPointer,
      api.handleSlideEnd,
      api.handleSlideMove,
      api.handleSlideStart,
      api.isDragging,
      api.setActiveThumbIndex,
      api.setIsActive,
      api.setIsDragging,
      api.setIsHovered,
      api.setIsPointerDown,
      api.setOpenThumbIndex,
      api.setToEnd,
      api.setToStart,
      api.thumbRefsMap,
      api.updateValues,
      api.values,
      disabled,
      dragStartDelayInMilliseconds,
      isLtr,
      jumpMultiplier,
      readOnly,
      stateProps,
    ],
  );

  const rangeProps = useMemo(() => {
    const percentages = api.values.map((value) =>
      convertValueToPercentage(value, api.min, api.max),
    );

    const offsetStart = api.values.length > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);

    return elementProps({
      ...stateProps,
      style: {
        "--range-start": `${offsetStart}%`,
        "--range-end": `${offsetEnd}%`,
      } as CSSProperties,
    });
  }, [api.values, api.min, api.max, stateProps]);

  const getThumbProps = useCallback(
    (index: number) => {
      const value = api.values[index];
      if (value === undefined) return elementProps({});

      const percent = convertValueToPercentage(value, api.min, api.max);

      const thumbInBoundsOffset = getThumbInBoundsOffset(
        api.firstThumbSize?.width ?? 0,
        percent,
        isLtr ? 1 : -1,
      );

      const hasEverBeenShown = getHasEverBeenShown(index);

      return elementProps({
        ...stateProps,

        role: "slider",
        "aria-valuemin": api.min,
        "aria-valuenow": value,
        "aria-valuemax": api.max,
        // "aria-orientation": "horizontal", // this is the default

        ...(getAriaValuetext && { "aria-valuetext": getAriaValuetext(value) }),
        ...(getAriaLabel && { "aria-label": getAriaLabel(index) }),
        ...(getAriaLabelledby && { "aria-labelledby": getAriaLabelledby(index) }),

        ...(readOnly && { "aria-readonly": true }),
        ...(invalid && { "aria-invalid": true }),
        ...(disabled && { "aria-disabled": true }),

        "data-thumb-index": `${index}`,
        "data-thumb-dragging": dataAttr(
          api.isDragging && api.valueIndexToChangeRef.current === index,
        ),
        "data-value-indicator-shown": dataAttr(hasEverBeenShown),

        tabIndex: disabled ? -1 : 0, // readonly thumbs should still be focusable
        style: {
          "--thumb-position": percent,
          "--thumb-offset": `${thumbInBoundsOffset}px`,
        } as CSSProperties,
        onFocus: (e: React.FocusEvent) => {
          api.valueIndexToChangeRef.current = index;
          // Use ref (synchronous) instead of state to reliably detect
          // pointer interactions — state updates are batched and may not
          // be flushed when focus fires synchronously from .focus() calls
          if (api.pointerInteractingRef.current) return;
          if (isFocusVisibleSupported && e.target.matches(":focus-visible")) {
            api.setFocusVisibleThumbIndex(index);
          }
        },
        onBlur: () => {
          if (api.focusVisibleThumbIndex === index) {
            api.setFocusVisibleThumbIndex(null);
          }
        },
        onMouseEnter: () => {
          if (disabled) return;

          api.setOpenThumbIndex(index);
        },
        onMouseLeave: () => {
          // Only close if this thumb is not actively being dragged
          if (!(api.isDragging && api.activeThumbIndex === index)) {
            api.setOpenThumbIndex(null);
          }
        },
      });
    },
    [
      api.activeThumbIndex,
      api.firstThumbSize,
      api.isDragging,
      api.max,
      api.min,
      api.focusVisibleThumbIndex,
      api.setOpenThumbIndex,
      api.values,
      disabled,
      getAriaLabel,
      getAriaLabelledby,
      getAriaValuetext,
      isFocusVisibleSupported,
      invalid,
      isLtr,
      readOnly,
      stateProps,
      getHasEverBeenShown,
    ],
  );

  const getHiddenInputProps = useCallback(
    (index: number) => {
      const value = api.values[index];
      if (value === undefined) return inputProps({});

      return inputProps({
        type: "hidden",
        value,
        name: name || id,
        disabled,
        readOnly: true,
      });
    },
    [api.values, name, disabled, id],
  );

  const getThumbRef = useCallback(
    (index: number): RefCallback<HTMLElement> =>
      (element) => {
        if (!element) {
          api.thumbRefsMap.current.delete(index);

          return;
        }

        api.thumbRefsMap.current.set(index, element);
      },
    [],
  );

  const getTickProps = useCallback(
    (value: number) => {
      const percent = convertValueToPercentage(value, api.min, api.max);

      const thumbInBoundsOffset = getThumbInBoundsOffset(
        api.firstThumbSize?.width ?? 0,
        percent,
        1,
      );

      return elementProps({
        ...stateProps,
        style: {
          "--tick-position": percent,
          "--tick-offset": `${thumbInBoundsOffset}px`,
        } as CSSProperties,
      });
    },
    [api.min, api.max, stateProps, api.firstThumbSize?.width],
  );

  const getMarkerProps = useCallback(
    (value: number) => {
      const percent = convertValueToPercentage(value, api.min, api.max);

      const isEnd = value === api.min ? "start" : value === api.max ? "end" : false;

      const thumbInBoundsOffset =
        isEnd === "start" || isEnd === "end"
          ? 0
          : getThumbInBoundsOffset(api.firstThumbSize?.width ?? 0, percent, 1);

      return elementProps({
        ...stateProps,
        "aria-hidden": true,

        style: {
          "--marker-position": percent,
          "--marker-offset": `${thumbInBoundsOffset}px`,
        } as CSSProperties,
      });
    },
    [api.min, api.max, stateProps, api.firstThumbSize?.width],
  );

  const getValueIndicatorProps = useCallback(
    (index: number) => {
      const value = api.values[index];

      if (value === undefined)
        return {
          rootProps: elementProps({}),
          labelProps: elementProps({}),
          rootRef: () => {},
        };

      const percent = convertValueToPercentage(value, api.min, api.max);

      const indicatorWidth = api.valueIndicatorRootSizes.get(index)?.width ?? 0;
      const trackWidth = api.rootSize?.width ?? 0;
      const thumbWidth = api.firstThumbSize?.width ?? 0;

      // Calculate thumb offset for arrow (arrow should follow thumb position)
      const thumbInBoundsOffset = getThumbInBoundsOffset(thumbWidth, percent, 1);

      // Use sticky offset calculation for value indicator root (accounting for thumb offset)
      // Must use the same direction as thumbInBoundsOffset for correct arrow positioning
      const indicatorOffset = getStickyLabelOffset(
        indicatorWidth,
        percent,
        thumbWidth,
        trackWidth,
        1,
      );

      // Visibility logic:
      // 1. focus-visible always shows indicator (keyboard accessibility)
      // 2. 'active': ONLY show when dragging
      // 3. 'hover': Show when hovering OR dragging
      // 4. 'auto': resolved to 'hover' or 'active' via matchMedia
      const isShown = (() => {
        if (api.focusVisibleThumbIndex === index) return true;

        switch (resolvedTrigger) {
          case "hover":
            return (
              api.openThumbIndex === index ||
              (api.isDragging && api.valueIndexToChangeRef.current === index)
            );
          case "active":
            return api.isDragging && api.valueIndexToChangeRef.current === index;
        }
      })();

      const hasEverBeenShown = getHasEverBeenShown(index);

      if (isShown && !hasEverBeenShown) {
        setTimeout(() => api.setShownIndicators((prev) => new Set(prev).add(index)), 0);
      }

      return {
        rootProps: elementProps({
          ...stateProps,

          "aria-hidden": true,
          "data-thumb-dragging": dataAttr(
            api.isDragging && api.valueIndexToChangeRef.current === index,
          ),
          "data-value-indicator-shown": dataAttr(isShown),
          "data-indicator-ever-shown": dataAttr(hasEverBeenShown),

          style: {
            "--indicator-label-position": percent,
            "--indicator-label-offset": `${indicatorOffset}px`,
            "--thumb-offset": `${thumbInBoundsOffset}px`,
          } as CSSProperties,
        }),
        labelProps: elementProps({
          children: getValueIndicatorLabel({ value, thumbIndex: index }),
        }),
        rootRef: (node: HTMLElement | null) => {
          api.valueIndicatorRootRefsMap.current.set(index, node);
        },
      };
    },
    [
      api.isDragging,
      api.max,
      api.min,
      api.openThumbIndex,
      api.focusVisibleThumbIndex,
      api.setShownIndicators,
      api.values,
      api.valueIndicatorRootSizes,
      api.valueIndexToChangeRef,
      api.rootSize?.width,
      api.firstThumbSize?.width,
      getValueIndicatorLabel,
      stateProps,
      resolvedTrigger,
      getHasEverBeenShown,
    ],
  );

  return {
    min: api.min,
    max: api.max,
    step: api.step,
    allowedValues: api.allowedValues,
    values: api.values,

    disabled,
    invalid,
    readOnly,

    refs: api.refs,

    isDragging: api.isDragging,

    rootProps,
    rangeProps,
    getThumbProps,
    getThumbRef,
    getHiddenInputProps,
    getTickProps,
    getMarkerProps,
    getValueIndicatorProps,

    // this is used to style the track
    stateProps,

    updateValues: api.updateValues,
  };
}
