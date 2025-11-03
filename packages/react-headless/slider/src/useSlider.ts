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
import { useSize } from "@radix-ui/react-use-size";
import { useIsSSR } from "./useIsSSR";

import {
  getClosestValueIndex,
  convertValueToPercentage,
  getDecimalCount,
  getNextSortedValues,
  getThumbInBoundsOffset,
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

  const firstThumbSize = useSize(thumbRefsMap.current.get(0) ?? null);

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
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

        valueIndexToChangeRef.current = nextValues.indexOf(nextValue);

        if (
          (!allowedValues || allowedValues.length === 0) &&
          hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step) === false
        ) {
          return prevValues;
        }

        const hasChanged = nextValues.some((val, index) => val !== prevValues[index]);

        if (!hasChanged) return prevValues;

        if (options?.commit) {
          uncommittedValuesRef.current = null;
          onValuesCommit?.(nextValues);
        } else {
          uncommittedValuesRef.current = nextValues;
        }

        return nextValues;
      });
    },
    [min, max, step, allowedValues, minStepsBetweenThumbs, setValues, onValuesCommit],
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
  getTooltipChildren?: (params: { value: number; thumbIndex: number }) => React.ReactNode;

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
  getTooltipChildren = ({ value }) => value,
  dragStartDelayInMilliseconds = 150,

  ...props
}: UseSliderProps) {
  const api = useSliderState(props);
  const isSSR = useIsSSR();
  const id = useId();

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

          if (disabled) return;
          if (event.target instanceof HTMLElement === false) return;

          api.valuesBeforeSlideStartRef.current = api.values;

          event.target.setPointerCapture(event.pointerId);

          // Prevent browser focus behavior because we focus a thumb manually when values change.
          event.preventDefault();

          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (event.target.getAttribute("role") === "slider") {
            // target is thumb

            event.target.focus();

            api.valueIndexToChangeRef.current = getClosestValueIndex(
              api.values,
              api.getValueFromPointer(event.clientX),
            );

            if (readOnly) return;

            api.setIsDragging(true);
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

          // defer drag start to see if it's a slide or a click
          api.dragTimerRef.current = setTimeout(() => {
            api.setIsDragging(true);

            api.handleSlideStart(api.getValueFromPointer(api.pointerDownPosition.current));
          }, dragStartDelayInMilliseconds);
        },
        onPointerMove: (event) => {
          api.setIsHovered(true);

          if (disabled || readOnly) return;
          if (event.target instanceof HTMLElement === false) return;

          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          api.setIsDragging(true);

          if (api.dragTimerRef.current) {
            // if we had a drag timer running, clear it and determine which thumb to move based on the saved pointer down position
            clearTimeout(api.dragTimerRef.current);

            api.dragTimerRef.current = null;

            api.valueIndexToChangeRef.current = getClosestValueIndex(
              api.values,
              api.getValueFromPointer(api.pointerDownPosition.current),
            );
          }

          // moves the thumb being dragged
          api.handleSlideMove(api.getValueFromPointer(event.clientX));
        },
        onPointerUp: (event) => {
          api.setIsActive(false);
          api.setIsDragging(false);

          if (event.target instanceof HTMLElement === false) return;
          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          event.target.releasePointerCapture(event.pointerId);

          if (api.dragTimerRef.current) {
            clearTimeout(api.dragTimerRef.current);
            api.dragTimerRef.current = null;

            // update immediately to where pointer was down since slide didn't start
            const valueAtPointer = api.getValueFromPointer(api.pointerDownPosition.current);
            const closestIndex = getClosestValueIndex(api.values, valueAtPointer);

            api.updateValues(valueAtPointer, closestIndex, { commit: true });

            api.thumbRefsMap.current.get(closestIndex)?.focus();
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
      api.adjustValueByStep,
      api.dir,
      api.getValueFromPointer,
      api.handleSlideEnd,
      api.handleSlideMove,
      api.handleSlideStart,
      api.setIsActive,
      api.setIsDragging,
      api.setIsHovered,
      api.setToEnd,
      api.setToStart,
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

  const getRangeProps = useCallback(() => {
    const percentages = api.values.map((value) =>
      convertValueToPercentage(value, api.min, api.max),
    );

    const offsetStart = api.values.length > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);

    return elementProps({
      ...stateProps,
      style: {
        // Always use left/right for range
        // this is because changing width + transform and attaching transitions looks janky when two thumbs are involved
        [isLtr ? "left" : "right"]: `${offsetStart}%`,
        [isLtr ? "right" : "left"]: `${offsetEnd}%`,
      } as CSSProperties,
    });
  }, [api.values, api.min, api.max, isLtr, stateProps]);

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

        tabIndex: disabled ? -1 : 0, // readonly thumbs should still be focusable
        style: {
          "--thumb-position": percent,
          "--thumb-offset": `${thumbInBoundsOffset}px`,
        } as CSSProperties,
        onFocus: () => {
          api.valueIndexToChangeRef.current = index;
        },
      });
    },
    [
      api.firstThumbSize,
      api.isDragging,
      api.max,
      api.min,
      api.values,
      disabled,
      getAriaLabel,
      getAriaLabelledby,
      getAriaValuetext,
      invalid,
      isLtr,
      readOnly,
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

  const getTooltipProps = useCallback(
    (index: number) => {
      const value = api.values[index];

      if (value === undefined)
        return {
          rootProps: elementProps({}),
          labelProps: elementProps({}),
        };

      const percent = convertValueToPercentage(value, api.min, api.max);

      const thumbInBoundsOffset = getThumbInBoundsOffset(
        api.firstThumbSize?.width ?? 0,
        percent,
        1,
      );

      return {
        rootProps: elementProps({
          ...stateProps,

          "aria-hidden": true,
          "data-thumb-dragging": dataAttr(
            api.isDragging && api.valueIndexToChangeRef.current === index,
          ),

          style: {
            "--tooltip-position": percent,
            "--tooltip-offset": `${thumbInBoundsOffset}px`,
          } as CSSProperties,
        }),
        labelProps: elementProps({
          children: getTooltipChildren({ value, thumbIndex: index }),
        }),
      };
    },
    [api.firstThumbSize?.width, api.isDragging, api.max, api.min, api.values, getTooltipChildren],
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
    getRangeProps,
    getThumbProps,
    getThumbRef,
    getHiddenInputProps,
    getTickProps,
    getMarkerProps,
    getTooltipProps,

    // this is used to style the track
    stateProps,

    updateValues: api.updateValues,
  };
}
