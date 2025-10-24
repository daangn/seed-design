// This code includes portions derived from radix-ui/primitives (https://github.com/radix-ui/primitives)
// Used under the MIT License: https://opensource.org/licenses/MIT

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { clamp } from "@radix-ui/number";
import { useCallback, useRef, useState, useMemo } from "react";
import { dataAttr, elementProps, inputProps, visuallyHidden } from "@seed-design/dom-utils";

import {
  getClosestValueIndex,
  convertValueToPercentage,
  getDecimalCount,
  getLabel,
  getNextSortedValues,
  getThumbInBoundsOffset,
  hasMinStepsBetweenValues,
  linearScale,
  roundValue,
} from "./utils";

const PAGE_KEYS = ["PageUp", "PageDown"];
const ARROW_KEYS = ["ArrowLeft", "ArrowRight"];
const BACK_KEYS = ["Home", "PageDown", "ArrowLeft"];

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
}

function useSliderState({
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  values: propValues,
  defaultValues: propDefaultValues = [min],
  onValuesCommit,
  onValuesChange,
}: UseSliderStateProps) {
  const thumbRefs = useRef<Set<HTMLElement>>(new Set());
  const valueIndexToChangeRef = useRef<number>(0);
  const sliderRef = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | undefined>(undefined);

  const [values, setValues] = useControllableState({
    prop: propValues,
    defaultProp: propDefaultValues,
    onChange: (value) => {
      const thumbs = [...thumbRefs.current];
      thumbs[valueIndexToChangeRef.current]?.focus();
      onValuesChange?.(value);
    },
  });

  const valuesBeforeSlideStartRef = useRef(values);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [thumbsHovered, setThumbsHovered] = useState<number | null>(null);
  const [thumbsActive, setThumbsActive] = useState<number | null>(null);
  const [thumbsFocused, setThumbsFocused] = useState<number | null>(null);
  const [thumbsFocusVisible, setThumbsFocusVisible] = useState<number | null>(null);

  const updateValues = useCallback(
    (value: number, atIndex: number, { commit } = { commit: false }) => {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);

      setValues((prevValues) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);

        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step) === false) {
          return prevValues;
        }

        valueIndexToChangeRef.current = nextValues.indexOf(nextValue);

        const hasChanged = nextValues.some((val, index) => val !== prevValues[index]);

        if (hasChanged && commit) {
          onValuesCommit?.(nextValues);
        }

        if (hasChanged) return nextValues;

        return prevValues;
      });
    },
    [min, max, step, minStepsBetweenThumbs, setValues, onValuesCommit],
  );

  const getValueFromPointer = useCallback(
    (pointerPosition: number) => {
      const rect = rectRef.current ?? sliderRef.current?.getBoundingClientRect();
      if (!rect) return min;

      const input: [number, number] = [0, rect.width];
      const output: [number, number] = [min, max];
      const valueGetter = linearScale(input, output);

      rectRef.current = rect;

      return valueGetter(pointerPosition - rect.left);
    },
    [min, max],
  );

  const handleSlideStart = useCallback(
    (value: number) => {
      updateValues(value, getClosestValueIndex(values, value));
      setIsDragging(true);
    },
    [values, updateValues],
  );

  const handleSlideMove = useCallback(
    (value: number) => {
      updateValues(value, valueIndexToChangeRef.current);
    },
    [updateValues],
  );

  const handleSlideEnd = useCallback(() => {
    const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
    const nextValue = values[valueIndexToChangeRef.current];

    if (nextValue !== prevValue) {
      onValuesCommit?.(values);
    }

    setIsDragging(false);

    rectRef.current = undefined; // XXX: check
  }, [values, onValuesCommit]);

  return {
    refs: {
      slider: sliderRef,
      thumbs: thumbRefs,
    },

    min,
    max,
    step,
    values,
    setValues,
    updateValues,
    valueIndexToChangeRef,
    valuesBeforeSlideStartRef,

    isHovered,
    setIsHovered,
    isActive,
    setIsActive,
    isDragging,
    setIsDragging,

    thumbs: {
      hovered: thumbsHovered,
      active: thumbsActive,
      focused: thumbsFocused,
      focusVisible: thumbsFocusVisible,
      setHovered: setThumbsHovered,
      setActive: setThumbsActive,
      setFocused: setThumbsFocused,
      setFocusVisible: setThumbsFocusVisible,
    },

    getValueFromPointer,

    handleSlideStart,
    handleSlideMove,
    handleSlideEnd,
  };
}

export interface UseSliderProps extends UseSliderStateProps {
  disabled?: boolean;
  name?: string;
  form?: string;
  dir?: "ltr" | "rtl";
}

export type UseSliderReturn = ReturnType<typeof useSlider>;

export function useSlider({ disabled, name, form, dir = "ltr", ...props }: UseSliderProps) {
  const api = useSliderState(props);

  const stateProps = elementProps({
    "data-disabled": dataAttr(disabled),
    "data-hover": dataAttr(api.isHovered),
    "data-active": dataAttr(api.isActive),
    "data-dragging": dataAttr(api.isDragging),
    ...(api.thumbs.hovered && { "data-thumbs-hovered": `${api.thumbs.hovered}` }),
    ...(api.thumbs.active && { "data-thumbs-active": `${api.thumbs.active}` }),
    ...(api.thumbs.focused && { "data-thumbs-focused": `${api.thumbs.focused}` }),
    ...(api.thumbs.focusVisible && { "data-thumbs-focus-visible": `${api.thumbs.focusVisible}` }),
  });

  const rootProps = useMemo(
    () =>
      elementProps({
        ...stateProps,
        "aria-disabled": disabled,
        onPointerEnter: () => {
          if (disabled) return;

          api.setIsHovered(true);
        },
        onPointerLeave: () => {
          if (disabled) return;

          api.setIsHovered(false);
          api.setIsActive(false);
        },
        onPointerDown: (event: React.PointerEvent) => {
          if (disabled) return;
          if (event.target instanceof HTMLElement === false) return;

          event.target.setPointerCapture(event.pointerId);
          event.preventDefault();

          // Store values before sliding starts
          api.valuesBeforeSlideStartRef.current = api.values;

          api.setIsActive(true);

          // Check if clicking on a thumb or the track
          if (api.refs.thumbs.current.has(event.target)) {
            event.target.focus();

            return;
          }

          // Clicked on track - start sliding
          api.handleSlideStart(api.getValueFromPointer(event.clientX));
        },
        onPointerMove: (event: React.PointerEvent) => {
          if (disabled) return;
          if (event.target instanceof HTMLElement === false) return;
          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          api.handleSlideMove(api.getValueFromPointer(event.clientX));
        },
        onPointerUp: (event: React.PointerEvent) => {
          if (event.target instanceof HTMLElement === false) return;
          if (event.target.hasPointerCapture(event.pointerId) === false) return;

          event.target.releasePointerCapture(event.pointerId);

          if (disabled) return;

          api.handleSlideEnd();
          api.setIsActive(false);
        },
        onKeyDown: (event: React.KeyboardEvent) => {
          if (disabled) return;

          switch (event.key) {
            case "Home": {
              api.updateValues(api.min, 0, { commit: true });
              event.preventDefault();

              return;
            }
            case "End": {
              api.updateValues(api.max, api.values.length - 1, { commit: true });
              event.preventDefault();
              return;
            }
          }

          if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            const isPageKey = PAGE_KEYS.includes(event.key);
            const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
            const multiplier = isSkipKey ? 10 : 1;
            const atIndex = api.valueIndexToChangeRef.current;
            const value = api.values[atIndex] ?? api.min;
            const isBackKey = BACK_KEYS.includes(event.key);
            const direction = isBackKey ? -1 : 1;
            const stepInDirection = api.step * multiplier * direction;

            api.updateValues(value + stepInDirection, atIndex, { commit: true });
            event.preventDefault();
          }
        },
      }),
    [
      stateProps,
      disabled,
      api.getValueFromPointer,
      api.handleSlideEnd,
      api.handleSlideMove,
      api.handleSlideStart,
      api.max,
      api.min,
      api.refs.thumbs,
      api.setIsActive,
      api.setIsHovered,
      api.step,
      api.updateValues,
      api.valueIndexToChangeRef.current,
      api.values,
      api.valuesBeforeSlideStartRef,
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
        [dir === "ltr" ? "left" : "right"]: `${offsetStart}%`, // TODO: change to inline css variable
        [dir === "ltr" ? "right" : "left"]: `${offsetEnd}%`,
      },
    });
  }, [api.values, api.min, api.max, dir, stateProps]);

  const getThumbProps = useCallback(
    (index: number) => {
      const value = api.values[index];
      if (value === undefined) return elementProps({});

      const label = getLabel(index, api.values.length);

      // For thumb positioning offset calculation
      // This would need the thumb size which requires a ref or measurement
      // For now, we'll provide the basic positioning

      return elementProps({
        ...stateProps,
        role: "slider",
        "aria-label": label,
        "aria-valuemin": api.min,
        "aria-valuenow": value,
        "aria-valuemax": api.max,
        "aria-orientation": "horizontal",
        "data-index": String(index),
        "data-hover": dataAttr(api.thumbs.hovered === index),
        "data-active": dataAttr(api.thumbs.active === index),
        "data-focus": dataAttr(api.thumbs.focused === index),
        "data-focus-visible": dataAttr(api.thumbs.focusVisible === index),
        tabIndex: disabled ? undefined : 0,
        style: value === undefined ? { display: "none" } : undefined,
        onPointerEnter: () => !disabled && api.thumbs.setHovered(index),
        onPointerLeave: () => {
          if (!disabled) {
            api.thumbs.setHovered(null);
            api.thumbs.setActive(null);
          }
        },
        onPointerDown: () => !disabled && api.thumbs.setActive(index),
        onPointerUp: () => !disabled && api.thumbs.setActive(null),
        onFocus: (event: React.FocusEvent) => {
          if (!disabled) {
            api.valueIndexToChangeRef.current = index;
            api.thumbs.setFocused(index);
            if (event.target.matches(":focus-visible")) {
              api.thumbs.setFocusVisible(index);
            }
          }
        },
        onBlur: () => {
          if (!disabled) {
            api.thumbs.setFocused(null);
            api.thumbs.setFocusVisible(null);
          }
        },
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === " " && !disabled) {
            api.thumbs.setActive(index);
          }
        },
        onKeyUp: (event: React.KeyboardEvent) => {
          if (event.key === " " && !disabled) {
            api.thumbs.setActive(null);
          }
        },
      });
    },
    [
      api.values,
      api.min,
      api.max,
      api.thumbs.hovered,
      api.thumbs.active,
      api.thumbs.focused,
      api.thumbs.focusVisible,
      api.valueIndexToChangeRef,
      api.thumbs.setHovered,
      api.thumbs.setActive,
      api.thumbs.setFocused,
      api.thumbs.setFocusVisible,
      disabled,
      stateProps,
    ],
  );

  const getThumbPositionProps = useCallback(
    (index: number, thumbSize?: { width: number }) => {
      const value = api.values[index] as number | undefined;
      const percent = value === undefined ? 0 : convertValueToPercentage(value, api.min, api.max);
      const thumbInBoundsOffset = thumbSize
        ? getThumbInBoundsOffset(thumbSize.width, percent, dir === "ltr" ? 1 : -1)
        : 0;

      return {
        style: {
          position: "absolute" as const,
          [dir === "ltr" ? "left" : "right"]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        },
      };
    },
    [api.values, api.min, api.max, dir],
  );

  const getHiddenInputProps = useCallback(
    (index: number) => {
      const value = api.values[index] as number | undefined;
      const inputName = name ? name + (api.values.length > 1 ? "[]" : "") : undefined;

      return inputProps({
        type: "range",
        min: api.min,
        max: api.max,
        step: api.step,
        value: value ?? api.min,
        name: inputName,
        form,
        disabled,
        style: visuallyHidden,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = Number.parseFloat(event.target.value);
          api.updateValues(newValue, index, { commit: true });
        },
      });
    },
    [api.values, name, form, api.min, api.max, api.step, disabled, api.updateValues],
  );

  return {
    // State
    min: api.min,
    max: api.max,
    step: api.step,
    values: api.values,
    disabled,

    refs: api.refs,

    isDragging: api.isDragging,

    rootProps,
    getRangeProps,
    getThumbProps,
    getThumbPositionProps,
    getHiddenInputProps,

    // this is used to style the track
    stateProps,

    updateValues: api.updateValues,
  };
}
