import * as React from "react";
import { clamp } from "@radix-ui/number";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { usePrevious } from "@radix-ui/react-use-previous";
import { useSize } from "@radix-ui/react-use-size";

import { Primitive } from "@seed-design/react-primitive";

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

type Direction = "ltr" | "rtl";

const PAGE_KEYS = ["PageUp", "PageDown"];
const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

type SlideDirection = "from-left" | "from-right";
const BACK_KEYS: Record<SlideDirection, string[]> = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
};

/* -------------------------------------------------------------------------------------------------
 * Slider
 * -----------------------------------------------------------------------------------------------*/

type SliderContextValue = {
  name: string | undefined;
  disabled: boolean | undefined;
  min: number;
  max: number;
  values: number[];
  valueIndexToChangeRef: React.MutableRefObject<number>;
  thumbs: Set<HTMLSpanElement>;
  form: string | undefined;
};

export interface SliderRootProps
  extends Omit<SliderHorizontalProps, keyof SliderOrientationPrivateProps | "defaultValue"> {
  name?: string;
  disabled?: boolean;
  dir?: Direction;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?(value: number[]): void;
  onValueCommit?(value: number[]): void;
  form?: string;
}

export const SliderRoot = React.forwardRef<HTMLSpanElement, SliderRootProps>(
  (props, forwardedRef) => {
    const {
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {},
      onValueCommit = () => {},
      ...sliderProps
    } = props;
    const thumbRefs = React.useRef<SliderContextValue["thumbs"]>(new Set());
    const valueIndexToChangeRef = React.useRef<number>(0);

    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value) => {
        const thumbs = [...thumbRefs.current];
        thumbs[valueIndexToChangeRef.current]?.focus();
        onValueChange(value);
      },
    });
    const valuesBeforeSlideStartRef = React.useRef(values);

    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }

    return (
      <SliderHorizontal
        aria-disabled={disabled}
        {...sliderProps}
        ref={forwardedRef}
        onPointerDown={composeEventHandlers(sliderProps.onPointerDown, () => {
          if (!disabled) valuesBeforeSlideStartRef.current = values;
        })}
        min={min}
        max={max}
        onSlideStart={disabled ? undefined : handleSlideStart}
        onSlideMove={disabled ? undefined : handleSlideMove}
        onSlideEnd={disabled ? undefined : handleSlideEnd}
        onHomeKeyDown={() => !disabled && updateValues(min, 0, { commit: true })}
        onEndKeyDown={() => !disabled && updateValues(max, values.length - 1, { commit: true })}
        onStepKeyDown={({ event, direction: stepDirection }) => {
          if (!disabled) {
            const isPageKey = PAGE_KEYS.includes(event.key);
            const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key));
            const multiplier = isSkipKey ? 10 : 1;
            const atIndex = valueIndexToChangeRef.current;
            const value = values[atIndex]!;
            const stepInDirection = step * multiplier * stepDirection;
            updateValues(value + stepInDirection, atIndex, { commit: true });
          }
        }}
      />
    );
  },
);
SliderRoot.displayName = "SliderRoot";

/* -------------------------------------------------------------------------------------------------
 * SliderHorizontal
 * -----------------------------------------------------------------------------------------------*/

type SliderOrientationPrivateProps = {
  min: number;
  max: number;
  onSlideStart?(value: number): void;
  onSlideMove?(value: number): void;
  onSlideEnd?(): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(step: { event: React.KeyboardEvent; direction: number }): void;
};
interface SliderOrientationProps
  extends Omit<SliderImplProps, keyof SliderImplPrivateProps>,
    SliderOrientationPrivateProps {}

interface SliderHorizontalProps extends SliderOrientationProps {
  dir?: Direction;
}

const SliderHorizontal = React.forwardRef<HTMLSpanElement, SliderHorizontalProps>(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir = "ltr",
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = React.useState<HTMLSpanElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = React.useRef<DOMRect>(undefined);

    const isSlidingFromLeft = dir === "ltr";

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.current || slider!.getBoundingClientRect();
      const input: [number, number] = [0, rect.width];
      const output: [number, number] = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);

      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }

    return (
      <SliderImpl
        {...sliderProps}
        ref={composedRefs}
        onSlideStart={(event) => {
          const value = getValueFromPointer(event.clientX);
          onSlideStart?.(value);
        }}
        onSlideMove={(event) => {
          const value = getValueFromPointer(event.clientX);
          onSlideMove?.(value);
        }}
        onSlideEnd={() => {
          rectRef.current = undefined;
          onSlideEnd?.();
        }}
        onStepKeyDown={(event) => {
          const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
          const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
          onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
        }}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

type SliderImplPrivateProps = {
  onSlideStart(event: React.PointerEvent): void;
  onSlideMove(event: React.PointerEvent): void;
  onSlideEnd(event: React.PointerEvent): void;
  onHomeKeyDown(event: React.KeyboardEvent): void;
  onEndKeyDown(event: React.KeyboardEvent): void;
  onStepKeyDown(event: React.KeyboardEvent): void;
};
interface SliderImplProps extends React.HTMLAttributes<HTMLSpanElement>, SliderImplPrivateProps {}

const SliderImpl = React.forwardRef<HTMLSpanElement, SliderImplProps>((props, forwardedRef) => {
  const {
    onSlideStart,
    onSlideMove,
    onSlideEnd,
    onHomeKeyDown,
    onEndKeyDown,
    onStepKeyDown,
    ...sliderProps
  } = props;

  return (
    <Primitive.span
      {...sliderProps}
      ref={forwardedRef}
      onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        if (event.key === "Home") {
          onHomeKeyDown(event);
          // Prevent scrolling to page start
          event.preventDefault();
        } else if (event.key === "End") {
          onEndKeyDown(event);
          // Prevent scrolling to page end
          event.preventDefault();
        } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
          onStepKeyDown(event);
          // Prevent scrolling for directional key presses
          event.preventDefault();
        }
      })}
      onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);
        // Prevent browser focus behavior because we focus a thumb manually when values change.
        event.preventDefault();
        // Touch devices have a delay before focusing so won't focus if touch immediately moves
        // away from target (sliding). We want thumb to focus regardless.
        if (context.thumbs.has(target)) {
          target.focus();
        } else {
          onSlideStart(event);
        }
      })}
      onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
        const target = event.target as HTMLElement;
        if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
      })}
      onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
        const target = event.target as HTMLElement;
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId);
          onSlideEnd(event);
        }
      })}
    />
  );
});

// SliderTrack is not here because it became a purely stylistic component

/* -------------------------------------------------------------------------------------------------
 * SliderRange
 * -----------------------------------------------------------------------------------------------*/

export interface SliderRangeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const SliderRange = React.forwardRef<HTMLSpanElement, SliderRangeProps>(
  (props, forwardedRef) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map((value) =>
      convertValueToPercentage(value, context.min, context.max),
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);

    return (
      <Primitive.span
        {...props}
        ref={composedRefs}
        style={{
          ...props.style,
          [props.dir === "ltr" ? "left" : "right"]: `${offsetStart}%`,
          [props.dir === "ltr" ? "right" : "left"]: `${offsetEnd}%`,
        }}
      />
    );
  },
);
SliderRange.displayName = "SliderRange";

/* -------------------------------------------------------------------------------------------------
 * SliderThumb
 * -----------------------------------------------------------------------------------------------*/

export interface SliderThumbProps extends Omit<SliderThumbImplProps, "index"> {}

export const SliderThumb = React.forwardRef<HTMLSpanElement, SliderThumbProps>(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = React.useState<HTMLSpanElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = React.useMemo(
      () => (thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1),
      [getItems, thumb],
    );
    return <SliderThumbImpl {...props} ref={composedRefs} index={index} />;
  },
);
SliderThumb.displayName = "SliderThumb";

interface SliderThumbImplProps extends React.HTMLAttributes<HTMLSpanElement> {
  index: number;
  name?: string;
}

const SliderThumbImpl = React.forwardRef<HTMLSpanElement, SliderThumbImplProps>(
  (props, forwardedRef) => {
    const { index, name, ...thumbProps } = props;
    const [thumb, setThumb] = React.useState<HTMLSpanElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    // We cast because index could be `-1` which would return undefined
    const value = context.values[index] as number | undefined;
    const percent =
      value === undefined ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const thumbInBoundsOffset = size ? getThumbInBoundsOffset(size.width, percent, 1) : 0;

    React.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);

    return (
      <span
        style={{
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [props.dir === "ltr" ? "left" : "right"]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        }}
      >
        <Primitive.span
          role="slider"
          aria-label={props["aria-label"] || label}
          aria-valuemin={context.min}
          aria-valuenow={value}
          aria-valuemax={context.max}
          aria-orientation="horizontal" // NOTE: fix when vertical is supported
          tabIndex={context.disabled ? undefined : 0}
          {...thumbProps}
          ref={composedRefs}
          /**
           * There will be no value on initial render while we work out the index so we hide thumbs
           * without a value, otherwise SSR will render them in the wrong position before they
           * snap into the correct position during hydration which would be visually jarring for
           * slower connections.
           */
          style={value === undefined ? { display: "none" } : props.style}
          onFocus={composeEventHandlers(props.onFocus, () => {
            context.valueIndexToChangeRef.current = index;
          })}
        />
        {isFormControl && (
          <SliderBubbleInput
            key={index}
            name={
              name ??
              (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : undefined)
            }
            form={context.form}
            value={value}
          />
        )}
      </span>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SliderBubbleInput
 * -----------------------------------------------------------------------------------------------*/

interface SliderBubbleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SliderBubbleInput = React.forwardRef<HTMLInputElement, SliderBubbleInputProps>(
  ({ value, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLInputElement>(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);

    // Bubble value change to parents (e.g form change event)
    React.useEffect(() => {
      const input = ref.current;
      if (!input) return;

      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value") as PropertyDescriptor;
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("input", { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);

    /**
     * We purposefully do not use `type="hidden"` here otherwise forms that
     * wrap it will not be able to access its value via the FormData API.
     *
     * We purposefully do not add the `value` attribute here to allow the value
     * to be set programmatically and bubble to any parent form `onChange` event.
     * Adding the `value` will cause React to consider the programmatic
     * dispatch a duplicate and it will get swallowed.
     */
    return (
      <Primitive.input
        style={{ display: "none" }}
        {...props}
        ref={composedRefs}
        defaultValue={value}
      />
    );
  },
);
SliderBubbleInput.displayName = "SliderBubbleInput";
