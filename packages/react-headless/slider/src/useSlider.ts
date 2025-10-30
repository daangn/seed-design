// This code includes portions derived from radix-ui/primitives (https://github.com/radix-ui/primitives)
// Used under the MIT License: https://opensource.org/licenses/MIT

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useRef, useState, useMemo, type CSSProperties, useId } from "react";
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
  /**
   * @default 0
   */
  min?: number;
  /**
   * @default 100
   */
  max?: number;
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
   * @default [min]
   */
  defaultValues?: number[];
  onValuesChange?: (value: number[]) => void;
  onValuesCommit?: (value: number[]) => void;

  /**
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
}

export type SliderMarkerAlign = "left" | "center" | "right";

function useSliderState({
  min = 0,
  max = 100,
  step = 1,
  allowedValues,
  minStepsBetweenThumbs = 0,
  values: propValues,
  defaultValues: propDefaultValues = [min],
  onValuesCommit,
  onValuesChange,
  dir = "ltr",
}: UseSliderStateProps) {
  const valueIndexToChangeRef = useRef<number>(0);

  const thumbRefs = useRef<Set<HTMLElement>>(new Set());
  const firstThumbSize = useSize([...thumbRefs.current][0] ?? null);

  const rootRef = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | undefined>(undefined);

  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownPosition = useRef<number>(0);

  const [values, setValues] = useControllableState({
    prop: propValues,
    defaultProp: propDefaultValues,
    onChange: (values) => {
      const thumbs = [...thumbRefs.current];
      thumbs[valueIndexToChangeRef.current]?.focus();

      onValuesChange?.(values);
    },
  });

  const valuesBeforeSlideStartRef = useRef(values);

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

        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step) === false) {
          return prevValues;
        }

        valueIndexToChangeRef.current = nextValues.indexOf(nextValue);

        const hasChanged = nextValues.some((val, index) => val !== prevValues[index]);

        if (!hasChanged) return prevValues;

        if (options?.commit) onValuesCommit?.(nextValues);
        return nextValues;
      });
    },
    [min, max, step, allowedValues, minStepsBetweenThumbs, setValues, onValuesCommit],
  );

  const getValueFromPointer = useCallback(
    (pointerPosition: number) => {
      const rect = rectRef.current ?? rootRef.current?.getBoundingClientRect();
      if (!rect) return min;

      const input: [number, number] = [0, rect.width];
      const output: [number, number] = dir === "ltr" ? [min, max] : [max, min];

      const valueGetter = linearScale(input, output);

      rectRef.current = rect;

      return valueGetter(pointerPosition - rect.left);
    },
    [min, max, dir],
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
   * when sliding ends, call onValuesCommit if values have changed since start of slide
   */
  const handleSlideEnd = useCallback(() => {
    const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
    const nextValue = values[valueIndexToChangeRef.current];

    if (nextValue !== prevValue) {
      onValuesCommit?.(values);
    }

    rectRef.current = undefined;
  }, [values, onValuesCommit]);

  return {
    refs: {
      root: rootRef,
      thumbs: thumbRefs,
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
  };
}

export interface UseSliderProps extends UseSliderStateProps {
  /**
   * @default false
   */
  required?: boolean;
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
  multiplierOnPageKey?: number;

  getAriaValuetext?: (value: number) => string;
  getAriaLabel?: (thumbIndex: number) => string;
  getAriaLabelledBy?: (thumbIndex: number) => string;

  /**
   * @default 150
   */
  dragStartDelayInMilliseconds?: number;
}

export type UseSliderReturn = ReturnType<typeof useSlider>;

export function useSlider({
  required,
  disabled,
  readOnly,
  invalid,
  name,

  multiplierOnPageKey = 10,
  getAriaValuetext,
  getAriaLabel,
  getAriaLabelledBy,
  dragStartDelayInMilliseconds = 150,

  ...props
}: UseSliderProps) {
  const api = useSliderState(props);
  const isSSR = useIsSSR();
  const id = useId();

  const isLtr = api.dir === "ltr";

  const stateProps = elementProps({
    "data-hover": dataAttr(api.isHovered),
    "data-active": dataAttr(api.isActive),
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-dragging": dataAttr(api.isDragging),
    "data-ssr": dataAttr(isSSR),
  });

  const rootProps = useMemo(
    () =>
      elementProps({
        ...stateProps,

        dir: api.dir,

        ...(readOnly && { "aria-readonly": true }),
        ...(required && { "aria-required": required }),
        ...(invalid && { "aria-invalid": true }),
        ...(disabled && { "aria-disabled": true }),

        onPointerLeave: () => {
          api.setIsHovered(false);
          api.setIsActive(false);
        },
        onPointerDown: (event) => {
          api.setIsActive(true);

          if (disabled) return;
          if (event.target instanceof HTMLElement === false) return;

          event.target.setPointerCapture(event.pointerId);

          // Prevent browser focus behavior because we focus a thumb manually when values change.
          event.preventDefault();

          api.valuesBeforeSlideStartRef.current = api.values;

          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (api.refs.thumbs.current.has(event.target)) {
            // target is thumb

            event.target.focus();

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
            const thumbs = [...api.refs.thumbs.current];
            thumbs[closestIndex]?.focus();

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

          if (api.dragTimerRef.current) {
            // if we had a drag timer running, clear it
            clearTimeout(api.dragTimerRef.current);
            api.dragTimerRef.current = null;
          }

          api.setIsDragging(true);

          api.handleSlideMove(api.getValueFromPointer(event.clientX));
        },
        onPointerUp: (event) => {
          api.setIsActive(false);
          api.setIsDragging(false);

          if (event.target instanceof HTMLElement === false) return;
          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          if (api.dragTimerRef.current) {
            clearTimeout(api.dragTimerRef.current);
            api.dragTimerRef.current = null;

            // update immediately to where pointer was down since slide didn't start
            api.handleSlideMove(api.getValueFromPointer(event.clientX));
          }

          api.handleSlideEnd();
        },
        onKeyDown: (event) => {
          if (disabled || readOnly) return;

          const atIndex = api.valueIndexToChangeRef.current;
          const currentValue = api.values[atIndex] ?? api.min;

          switch (event.key) {
            case "Home": {
              api.updateValues(api.allowedValues?.[0] ?? api.min, 0, { commit: true });

              event.preventDefault();

              break;
            }

            case "End": {
              api.updateValues(
                api.allowedValues?.[api.allowedValues.length - 1] ?? api.max,
                api.values.length - 1,
                { commit: true },
              );

              event.preventDefault();

              break;
            }

            case "PageUp": {
              if (api.allowedValues && api.allowedValues.length > 0) {
                let nextValue = currentValue;

                for (let i = 0; i < multiplierOnPageKey; i++) {
                  const next = getNextAllowedValue(nextValue, 1, api.allowedValues);
                  if (next === null) break;

                  nextValue = next;
                }

                if (nextValue === currentValue) break;

                api.updateValues(nextValue, atIndex, { commit: true });

                event.preventDefault();

                break;
              }

              api.updateValues(currentValue + api.step * multiplierOnPageKey, atIndex, {
                commit: true,
              });

              event.preventDefault();

              break;
            }
            case "PageDown": {
              if (api.allowedValues && api.allowedValues.length > 0) {
                let nextValue = currentValue;

                for (let i = 0; i < multiplierOnPageKey; i++) {
                  const next = getNextAllowedValue(nextValue, -1, api.allowedValues);
                  if (next === null) break;

                  nextValue = next;
                }

                if (nextValue === currentValue) break;

                api.updateValues(nextValue, atIndex, { commit: true });

                event.preventDefault();

                break;
              }

              api.updateValues(currentValue + api.step * multiplierOnPageKey * -1, atIndex, {
                commit: true,
              });

              event.preventDefault();

              break;
            }

            case "ArrowUp":
            case "ArrowRight": {
              const direction = isLtr ? 1 : -1;
              const multiplier = (event.shiftKey ? multiplierOnPageKey : 1) * direction;

              if (api.allowedValues && api.allowedValues.length > 0) {
                let nextValue = currentValue;

                for (let i = 0; i < multiplier; i++) {
                  const next = getNextAllowedValue(nextValue, direction, api.allowedValues);
                  if (next === null) break;

                  nextValue = next;
                }

                if (nextValue === currentValue) break;

                api.updateValues(nextValue, atIndex, { commit: true });

                event.preventDefault();

                break;
              }

              api.updateValues(currentValue + api.step * multiplier, atIndex, {
                commit: true,
              });

              event.preventDefault();

              break;
            }
            case "ArrowLeft":
            case "ArrowDown": {
              const direction = isLtr ? -1 : 1;
              const multiplier = (event.shiftKey ? multiplierOnPageKey : 1) * direction;

              if (api.allowedValues && api.allowedValues.length > 0) {
                let nextValue = currentValue;

                for (let i = 0; i < multiplier; i++) {
                  const next = getNextAllowedValue(nextValue, direction, api.allowedValues);
                  if (next === null) break;

                  nextValue = next;
                }

                if (nextValue === currentValue) break;

                api.updateValues(nextValue, atIndex, { commit: true });

                event.preventDefault();

                break;
              }

              api.updateValues(currentValue + api.step * multiplier, atIndex, {
                commit: true,
              });

              event.preventDefault();

              break;
            }
          }
        },
      }),
    [
      stateProps,
      disabled,
      multiplierOnPageKey,
      dragStartDelayInMilliseconds,
      api.dir,
      api.getValueFromPointer,
      api.handleSlideEnd,
      api.handleSlideMove,
      api.max,
      api.min,
      api.allowedValues,
      api.setIsActive,
      api.setIsHovered,
      api.setIsDragging,
      api.dragTimerRef,
      api.pointerDownPosition,
      api.step,
      api.updateValues,
      api.valueIndexToChangeRef.current,
      api.values,
      api.valuesBeforeSlideStartRef,
      api.refs.thumbs.current.has,
      api.handleSlideStart,
      isLtr,
      invalid,
      readOnly,
      required,
      api.refs.thumbs.current,
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
        [isLtr ? "--range-left" : "--range-right"]: `${offsetStart}%`,
        [isLtr ? "--range-right" : "--range-left"]: `${offsetEnd}%`,
      },
    });
  }, [api.values, api.min, api.max, isLtr, stateProps]);

  const getThumbRef = useCallback(() => {
    return (thumb: HTMLElement | null) => {
      if (!thumb) return;

      api.refs.thumbs.current.add(thumb);
    };
  }, [api.refs.thumbs.current.add]);

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
        role: "slider",
        "aria-valuemin": api.min,
        "aria-valuenow": value,
        "aria-valuemax": api.max,
        // "aria-orientation": "horizontal", // this is the default

        ...(getAriaValuetext && { "aria-valuetext": getAriaValuetext(value) }),
        ...(getAriaLabel && { "aria-label": getAriaLabel(index) }),
        ...(getAriaLabelledBy && { "aria-labelledby": getAriaLabelledBy(index) }),

        "data-index": `${index}`,
        "data-dragging": dataAttr(api.isDragging && api.valueIndexToChangeRef.current === index),
        "data-disabled": dataAttr(disabled),
        "data-ssr": dataAttr(isSSR),

        tabIndex: disabled ? undefined : 0, // readonly thumbs should still be focusable
        style: {
          [isLtr ? "--thumb-left" : "--thumb-right"]:
            `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        },
        onFocus: () => {
          api.valueIndexToChangeRef.current = index;
        },
      });
    },
    [
      api.values,
      api.min,
      api.max,
      api.valueIndexToChangeRef,
      api.isDragging,
      api.firstThumbSize,
      isLtr,
      disabled,
      getAriaValuetext,
      getAriaLabel,
      getAriaLabelledBy,
      isSSR,
    ],
  );

  const getHiddenInputProps = useCallback(
    (index: number) => {
      const value = api.values[index];

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
          [isLtr ? "--tick-left" : "--tick-right"]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
          "--tick-transform": isLtr ? "translate(-50%, -50%)" : "translate(50%, -50%)",
        } as CSSProperties,
      });
    },
    [api.min, api.max, isLtr, stateProps, api.firstThumbSize?.width],
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
          [isLtr ? "--marker-left" : "--marker-right"]:
            `calc(${percent}% + ${thumbInBoundsOffset}px)`,
          "--marker-transform":
            isEnd === "start"
              ? "translateX(0%)"
              : isEnd === "end"
                ? isLtr
                  ? "translateX(-100%)"
                  : "translateX(100%)"
                : isLtr
                  ? "translateX(-50%)"
                  : "translateX(50%)",
          "--marker-text-align":
            isEnd === "start"
              ? isLtr
                ? "left"
                : "right"
              : isEnd === "end"
                ? isLtr
                  ? "right"
                  : "left"
                : "center",
        } as CSSProperties,
      });
    },
    [api.min, api.max, isLtr, stateProps, api.firstThumbSize?.width],
  );

  return {
    min: api.min,
    max: api.max,
    step: api.step,
    allowedValues: api.allowedValues,
    values: api.values,

    disabled,
    invalid,
    required,
    readOnly,

    refs: api.refs,

    isDragging: api.isDragging,

    rootProps,
    getRangeProps,
    getThumbRef,
    getThumbProps,
    getHiddenInputProps,
    getTickProps,
    getMarkerProps,

    // this is used to style the track
    stateProps,

    updateValues: api.updateValues,
  };
}
