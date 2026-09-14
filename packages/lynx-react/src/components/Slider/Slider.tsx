import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { NodesRef } from "@lynx-js/types";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextProps,
  LynxViewProps,
} from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { slider } from "@seed-design/lynx-css/recipes/slider";
import type { SliderVariantProps } from "@seed-design/lynx-css/recipes/slider";
import { sliderTick, type SliderTickVariantProps } from "@seed-design/lynx-css/recipes/slider-tick";
import {
  sliderMarker,
  type SliderMarkerVariantProps,
} from "@seed-design/lynx-css/recipes/slider-marker";
import {
  eventPageX,
  getStickyLabelOffset,
  getThumbInBoundsOffset,
  geometryFromRect,
  hasMinimumSteps,
  nearestValueIndex,
  normalizeValue,
  normalizeValues,
  percentageForValue,
  valueForPercentage,
} from "./Slider.utils";

export type SliderValues = number[];
type SliderNativeProps = Omit<LynxViewProps, "children" | "className" | "style"> &
  LynxStyledElementProps;
type LayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;

function getLayoutWidth(event: Parameters<LayoutChangeHandler>[0]): number | null {
  const eventWithWidth = event as Parameters<LayoutChangeHandler>[0] & { width?: number };
  const nextWidth = event.detail?.width ?? event.params?.width ?? eventWithWidth.width;
  if (typeof nextWidth !== "number" || !Number.isFinite(nextWidth)) return null;
  return Math.max(0, nextWidth);
}

/**
 * @platform Lynx
 *
 * 웹 전용 HiddenInput/name, DOM form 이벤트, keyboard/focus/hover 상태는 제공하지 않습니다.
 * 값 변경은 native touch gesture로 처리하며 Thumb는 `accessibility-*` 속성을 직접 노출합니다.
 */
export interface SliderRootProps extends SliderNativeProps, LynxAccessibilityProps {
  children?: React.ReactNode;
  values?: number[];
  defaultValues?: number[];
  min?: number;
  max?: number;
  step?: number;
  allowedValues?: number[];
  minStepsBetweenThumbs?: number;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  onValuesChange?: (values: number[]) => void;
  onValuesCommit?: (values: number[]) => void;
  getAccessibilityLabel?: (thumbIndex: number) => string;
  getAccessibilityValueText?: (value: number, thumbIndex: number) => string;
  getValueIndicatorLabel?: (params: { value: number; thumbIndex: number }) => React.ReactNode;
  valueIndicatorTrigger?: "auto" | "active";
}

export interface SliderControlProps extends SliderNativeProps {
  children?: React.ReactNode;
}
export interface SliderTrackProps extends SliderNativeProps {
  children?: React.ReactNode;
}
export interface SliderRangeProps extends SliderNativeProps {
  children?: React.ReactNode;
}
export interface SliderThumbProps extends SliderNativeProps, LynxAccessibilityProps {
  index?: number;
  children?: React.ReactNode;
}
export interface SliderTickProps extends SliderNativeProps, SliderTickVariantProps {
  value: number;
  children?: React.ReactNode;
}
export interface SliderMarkersProps extends SliderNativeProps {
  children?: React.ReactNode;
}
export interface SliderMarkerProps
  extends SliderNativeProps,
    Omit<SliderMarkerVariantProps, "dir" | "disabled"> {
  value: number;
  children?: React.ReactNode;
}
export interface SliderValueIndicatorRootProps extends SliderNativeProps {
  index?: number;
  children?: React.ReactNode;
}
export interface SliderValueIndicatorArrowProps extends SliderNativeProps {
  children?: React.ReactNode;
}
export interface SliderValueIndicatorLabelProps
  extends Omit<LynxTextProps, "children" | "className" | "style">,
    LynxStyledElementProps {
  index?: number;
  children?: React.ReactNode;
}

export interface SliderClassNames {
  root: string;
  control: string;
  track: string;
  range: string;
  thumb: string;
  markers: string;
  valueIndicatorRoot: string;
  valueIndicatorArrow: string;
  valueIndicatorLabel: string;
}

interface SliderDimensions {
  trackLeft: number;
  trackWidth: number;
  thumbWidth: number;
  indicatorWidths: Record<number, number>;
}

interface SliderFormatters {
  getAccessibilityLabel?: (index: number) => string;
  getAccessibilityValueText?: (value: number, index: number) => string;
  getValueIndicatorLabel: (params: { value: number; thumbIndex: number }) => React.ReactNode;
}

interface SliderInteraction {
  active: boolean;
  index: number | null;
  changed: boolean;
  pendingX: number | null;
}
interface SliderContextValue {
  values: SliderValues;
  min: number;
  max: number;
  step: number;
  valueIndicatorTrigger: "active";
  allowedValues?: number[];
  minStepsBetweenThumbs: number;
  dir: "ltr" | "rtl";
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  dragging: boolean;
  activeThumbIndex: number | null;
  valueIndicatorEverShown: boolean;
  classes: SliderClassNames;
  getClasses: (state?: SliderVariantProps) => SliderClassNames;
  trackRef: React.RefObject<NodesRef | null>;
  dimensions: SliderDimensions;
  registerThumb: (index: number, ref: React.RefObject<NodesRef | null>) => void;
  updateIndicatorWidth: (index: number, width: number) => void;
  registerIndicator: (index: number, ref: React.RefObject<NodesRef | null>) => void;
  startThumb: (index: number) => void;
  formatters: SliderFormatters;
  interaction: SliderInteraction;
}

const SliderContext = React.createContext<SliderContextValue | null>(null);
function useSliderContext(consumer: string): SliderContextValue {
  const context = React.useContext(SliderContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <Slider.Root/>.`);
  return context;
}

function dynamicStyle(
  style: LynxStyledElementProps["style"],
  values: Record<string, string | number>,
) {
  return { ...values, ...(style ?? {}) };
}

function defaultGetValueIndicatorLabel({ value }: { value: number }): React.ReactNode {
  return String(value);
}

export const SliderRoot = React.forwardRef<NodesRef, SliderRootProps>((props, forwardedRef) => {
  const [variantProps, restProps] = slider.splitVariantProps(props);
  const { disabled = false } = variantProps;
  const {
    children,
    className,
    style,
    values: valuesProp,
    defaultValues,
    min = 0,
    max = 100,
    step = 1,
    allowedValues,
    minStepsBetweenThumbs = 0,
    dir = "ltr",
    readOnly = false,
    invalid = false,
    onValuesChange,
    onValuesCommit,
    getAccessibilityLabel,
    getAccessibilityValueText,
    getValueIndicatorLabel = defaultGetValueIndicatorLabel,
    valueIndicatorTrigger = "auto",
    "consume-slide-event": consumeSlideEvent = [
      [-180, -135],
      [-45, 45],
      [135, 180],
    ],
    ...nativeProps
  } = restProps;
  const resolvedValueIndicatorTrigger =
    valueIndicatorTrigger === "auto" ? "active" : valueIndicatorTrigger;
  const getClasses = React.useCallback((state: SliderVariantProps = {}) => slider(state), []);

  const initialValues = React.useMemo(
    () => normalizeValues(defaultValues ?? valuesProp, min, max, step, allowedValues),
    [defaultValues, valuesProp, min, max, step, allowedValues],
  );
  const [values, setValues] = useControllableState<SliderValues>({
    value:
      valuesProp === undefined
        ? undefined
        : normalizeValues(valuesProp, min, max, step, allowedValues),
    defaultValue: initialValues,
    onChange: onValuesChange,
  });
  const valuesRef = React.useRef(values);
  valuesRef.current = values;
  const interaction = React.useRef<SliderInteraction>({
    active: false,
    index: null,
    changed: false,
    pendingX: null,
  });
  const pendingEndRef = React.useRef(false);
  const moveFrameRef = React.useRef<number | null>(null);
  const [valueIndicatorEverShown, setValueIndicatorEverShown] = React.useState(false);

  const trackRef = React.useRef<NodesRef>(null);
  const thumbRefs = React.useRef<Record<number, React.RefObject<NodesRef | null>>>({});
  const indicatorRefs = React.useRef<Record<number, React.RefObject<NodesRef | null>>>({});
  const [dragging, setDragging] = React.useState(false);
  const [activeThumbIndex, setActiveThumbIndex] = React.useState<number | null>(null);
  const [trackLeft, setTrackLeft] = React.useState(0);
  const trackLeftRef = React.useRef(0);
  const trackWidthRef = React.useRef(0);
  const [trackWidth, setTrackWidth] = React.useState(0);
  const [thumbWidth, setThumbWidth] = React.useState(0);
  const [indicatorWidths, setIndicatorWidths] = React.useState<Record<number, number>>({});
  const updateIndicatorWidth = React.useCallback((index: number, width: number) => {
    setIndicatorWidths((previous) => {
      if (previous[index] === width) return previous;
      return { ...previous, [index]: width };
    });
  }, []);
  const measureInFlight = React.useRef(false);
  const finalizeRef = React.useRef<(() => void) | undefined>(undefined);
  const updateFromRatioRef = React.useRef<((ratio: number) => void) | undefined>(undefined);

  const measure = React.useCallback(() => {
    const trackNode = trackRef.current;
    if (measureInFlight.current || !trackNode) return;
    measureInFlight.current = true;
    const thumbNode = thumbRefs.current[0]?.current;
    Promise.all([
      getRectByRef({ current: trackNode }),
      thumbNode ? getRectByRef({ current: thumbNode }) : Promise.resolve(null),
    ])
      .then(([trackRect, thumbRect]) => {
        const track = geometryFromRect(trackRect);
        const thumb = geometryFromRect(thumbRect);
        if (track) {
          trackLeftRef.current = track.left;
          trackWidthRef.current = track.width;
          setTrackLeft(track.left);
          setTrackWidth(track.width);
        }
        if (thumb) setThumbWidth(thumb.width);
        measureInFlight.current = false;
        const pending = interaction.current.pendingX;
        if (pending !== null && track) {
          interaction.current.pendingX = null;
          updateFromRatioRef.current?.(clampRatio((pending - track.left) / track.width));
        }
        if (pendingEndRef.current) finalizeRef.current?.();
      })
      .catch(() => {
        measureInFlight.current = false;
        if (!pendingEndRef.current) return;
        const pending = interaction.current.pendingX;
        if (pending !== null && trackWidthRef.current > 0) {
          interaction.current.pendingX = null;
          updateFromRatioRef.current?.(
            clampRatio((pending - trackLeftRef.current) / trackWidthRef.current),
          );
        }
        finalizeRef.current?.();
      });
  }, []);

  const registerThumb = React.useCallback(
    (index: number, ref: React.RefObject<NodesRef | null>) => {
      thumbRefs.current[index] = ref;
      if (index === 0) measure();
    },
    [measure],
  );
  const registerIndicator = React.useCallback(
    (index: number, ref: React.RefObject<NodesRef | null>) => {
      indicatorRefs.current[index] = ref;
      const indicatorNode = ref.current;
      if (!indicatorNode) return;
      getRectByRef({ current: indicatorNode })
        .then((rect) => {
          const geometry = geometryFromRect(rect);
          if (geometry) updateIndicatorWidth(index, geometry.width);
        })
        .catch(() => undefined);
    },
    [updateIndicatorWidth],
  );
  const updateFromRatio = React.useCallback(
    (ratio: number) => {
      if (disabled || readOnly || !interaction.current.active) return;
      const current = valuesRef.current;
      const requested = valueForPercentage(ratio * 100, min, max, dir);
      const index = interaction.current.index ?? nearestValueIndex(current, requested);
      const nextValue = normalizeValue(requested, min, max, step, allowedValues);
      const next = [...current];
      next[index] = nextValue;
      next.sort((a, b) => a - b);
      if (!allowedValues?.length && !hasMinimumSteps(next, minStepsBetweenThumbs, step)) return;
      if (next.every((value, valueIndex) => value === current[valueIndex])) return;
      valuesRef.current = next;
      interaction.current.index = next.indexOf(nextValue);
      interaction.current.changed = true;
      setActiveThumbIndex(interaction.current.index);
      setValues(next);
    },
    [allowedValues, dir, disabled, max, min, minStepsBetweenThumbs, readOnly, setValues, step],
  );
  updateFromRatioRef.current = updateFromRatio;

  const cancelPendingMove = React.useCallback(() => {
    if (moveFrameRef.current === null) return;
    cancelAnimationFrame(moveFrameRef.current);
    moveFrameRef.current = null;
  }, []);

  const flushPendingMove = React.useCallback(() => {
    "background only";
    moveFrameRef.current = null;
    if (!interaction.current.active || disabled || readOnly) return;
    const pending = interaction.current.pendingX;
    if (pending === null) return;
    const track = trackWidthRef.current;
    if (!track) {
      measure();
      return;
    }
    interaction.current.pendingX = null;
    updateFromRatio(clampRatio((pending - trackLeftRef.current) / track));
  }, [disabled, measure, readOnly, updateFromRatio]);

  const finalize = React.useCallback(() => {
    if (!interaction.current.active) return;
    interaction.current.active = false;
    interaction.current.pendingX = null;
    pendingEndRef.current = false;
    setDragging(false);
    setActiveThumbIndex(null);
    if (interaction.current.changed && !disabled && !readOnly)
      onValuesCommit?.([...valuesRef.current]);
    interaction.current.index = null;
    interaction.current.changed = false;
  }, [disabled, onValuesCommit, readOnly]);
  finalizeRef.current = finalize;

  const begin = React.useCallback(
    (event: unknown) => {
      "background only";
      if (disabled || readOnly) {
        interaction.current.index = null;
        return;
      }
      const x = eventPageX(event);
      if (!Number.isFinite(x)) return;
      pendingEndRef.current = false;
      interaction.current.active = true;
      interaction.current.changed = false;
      interaction.current.pendingX = x;
      const current = valuesRef.current;
      if (interaction.current.index === null && trackWidthRef.current > 0) {
        const ratio = clampRatio((x - trackLeftRef.current) / trackWidthRef.current);
        interaction.current.index = nearestValueIndex(
          current,
          valueForPercentage(ratio * 100, min, max, dir),
        );
      }
      setActiveThumbIndex(interaction.current.index);
      setDragging(true);
      setValueIndicatorEverShown(true);
      measure();
      if (trackWidthRef.current > 0) {
        updateFromRatio(clampRatio((x - trackLeftRef.current) / trackWidthRef.current));
      }
    },
    [dir, disabled, max, measure, min, readOnly, updateFromRatio],
  );

  const move = React.useCallback(
    (event: unknown) => {
      "background only";
      if (!interaction.current.active || disabled || readOnly) return;
      const x = eventPageX(event);
      if (!Number.isFinite(x)) return;
      interaction.current.pendingX = x;
      if (moveFrameRef.current !== null) return;
      moveFrameRef.current = requestAnimationFrame(flushPendingMove);
    },
    [disabled, flushPendingMove, readOnly],
  );

  const finish = React.useCallback(
    (event: unknown) => {
      "background only";
      if (!interaction.current.active) return;
      cancelPendingMove();
      const x = eventPageX(event);
      if (Number.isFinite(x)) interaction.current.pendingX = x;
      if (interaction.current.pendingX !== null && measureInFlight.current) {
        pendingEndRef.current = true;
        setDragging(false);
        setActiveThumbIndex(null);
        measure();
        return;
      }
      if (interaction.current.pendingX !== null && trackWidthRef.current <= 0) {
        pendingEndRef.current = true;
        setDragging(false);
        setActiveThumbIndex(null);
        measure();
        return;
      }
      if (interaction.current.pendingX !== null && trackWidthRef.current > 0) {
        const pending = interaction.current.pendingX;
        interaction.current.pendingX = null;
        updateFromRatio(clampRatio((pending - trackLeftRef.current) / trackWidthRef.current));
      }
      finalizeRef.current?.();
    },
    [cancelPendingMove, measure, updateFromRatio],
  );

  const cancel = React.useCallback(() => {
    "background only";
    if (!interaction.current.active) return;
    cancelPendingMove();
    interaction.current.active = false;
    interaction.current.pendingX = null;
    pendingEndRef.current = false;
    setDragging(false);
    setActiveThumbIndex(null);
    interaction.current.index = null;
    interaction.current.changed = false;
  }, [cancelPendingMove]);

  const rootHandlers = {
    catchtouchstart: begin,
    catchtouchmove: move,
    catchtouchend: finish,
    catchtouchcancel: cancel,
  };

  React.useEffect(() => cancelPendingMove, [cancelPendingMove]);

  React.useEffect(() => {
    measure();
  }, [measure, values.length]);
  const classes = React.useMemo(
    () => getClasses({ disabled, dragging, valueIndicatorEverShown }),
    [disabled, dragging, getClasses, valueIndicatorEverShown],
  );
  const dimensions = React.useMemo<SliderDimensions>(
    () => ({ trackLeft, trackWidth, thumbWidth, indicatorWidths }),
    [indicatorWidths, thumbWidth, trackLeft, trackWidth],
  );
  const startThumb = React.useCallback((index: number) => {
    interaction.current.index = index;
  }, []);
  const formatters = React.useMemo<SliderFormatters>(
    () => ({ getAccessibilityLabel, getAccessibilityValueText, getValueIndicatorLabel }),
    [getAccessibilityLabel, getAccessibilityValueText, getValueIndicatorLabel],
  );

  const contextValue = React.useMemo<SliderContextValue>(
    () => ({
      values,
      min,
      max,
      step,
      allowedValues,
      minStepsBetweenThumbs,
      dir,
      disabled,
      readOnly,
      invalid,
      valueIndicatorTrigger: resolvedValueIndicatorTrigger,
      dragging,
      activeThumbIndex,
      valueIndicatorEverShown,
      classes,
      getClasses,
      trackRef,
      dimensions,
      registerThumb,
      updateIndicatorWidth,
      registerIndicator,
      startThumb,
      formatters,
      interaction: interaction.current,
    }),
    [
      activeThumbIndex,
      allowedValues,
      classes,
      dimensions,
      dir,
      disabled,
      dragging,
      formatters,
      getClasses,
      invalid,
      max,
      min,
      minStepsBetweenThumbs,
      readOnly,
      registerIndicator,
      registerThumb,
      resolvedValueIndicatorTrigger,
      startThumb,
      step,
      updateIndicatorWidth,
      valueIndicatorEverShown,
      values,
    ],
  );

  return (
    <SliderContext.Provider value={contextValue}>
      <view
        {...mergeProps(
          rootHandlers,
          nativeProps,
          { "consume-slide-event": consumeSlideEvent },
          forwardedRef ? { ref: forwardedRef } : {},
        )}
        className={clsx(classes.root, className)}
        style={style}
      >
        {children}
      </view>
    </SliderContext.Provider>
  );
});
SliderRoot.displayName = "SliderRoot";

export const SliderControl = React.forwardRef<NodesRef, SliderControlProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSliderContext("Slider.Control");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(context.classes.control, className)}
    >
      {children}
    </view>
  );
});
SliderControl.displayName = "SliderControl";

export const SliderTrack = React.forwardRef<NodesRef, SliderTrackProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSliderContext("Slider.Track");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, { ref: context.trackRef }, nativeProps)}
      className={clsx(
        context.getClasses({ disabled: context.disabled, dragging: context.dragging }).track,
        className,
      )}
    >
      {children}
    </view>
  );
});
SliderTrack.displayName = "SliderTrack";

export const SliderRange = React.forwardRef<NodesRef, SliderRangeProps>((props, ref) => {
  const { children: _children, className, style, ...nativeProps } = props;
  const context = useSliderContext("Slider.Range");
  const percentages = context.values.map((value) =>
    percentageForValue(value, context.min, context.max),
  );
  const end = context.values.length > 1 ? Math.max(...percentages) : (percentages[0] ?? 0);
  const start = context.values.length > 1 ? Math.min(...percentages) : 0;
  const left = context.dir === "ltr" ? start : 100 - end;
  const width = Math.max(0, end - start);
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(
        context.getClasses({ disabled: context.disabled, dragging: context.dragging }).range,
        className,
      )}
      style={dynamicStyle(style, {
        "--slider-range-left": `${left}%`,
        "--slider-range-width": `${width}%`,
      })}
    />
  );
});
SliderRange.displayName = "SliderRange";

export const SliderThumb = React.forwardRef<NodesRef, SliderThumbProps>((props, forwardedRef) => {
  const { children, index = 0, className, style, ...nativeProps } = props;
  const context = useSliderContext("Slider.Thumb");
  const value = context.values[index];
  const localRef = React.useRef<NodesRef>(null);
  React.useEffect(() => {
    context.registerThumb(index, localRef);
  }, [context.registerThumb, index]);
  if (value === undefined) return null;
  const percent = percentageForValue(value, context.min, context.max);
  const physicalPercent = context.dir === "ltr" ? percent : 100 - percent;
  const offset = getThumbInBoundsOffset(context.dimensions.thumbWidth, physicalPercent, 1);
  const accessibilityValue =
    context.formatters.getAccessibilityValueText?.(value, index) ??
    `minimum ${context.min}, maximum ${context.max}, current ${value}`;
  const {
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription = "adjustable",
    "accessibility-value": providedAccessibilityValue,
    "accessibility-traits": accessibilityTraits,
    ...restNativeProps
  } = nativeProps;
  return (
    <view
      {...mergeProps(
        forwardedRef ? { ref: forwardedRef } : {},
        { ref: localRef },
        restNativeProps,
        { bindtouchstart: () => context.startThumb(index) },
      )}
      className={clsx(
        context.getClasses({
          disabled: context.disabled,
          dragging: context.dragging,
          thumbDragging: context.dragging && context.activeThumbIndex === index,
        }).thumb,
        className,
      )}
      style={dynamicStyle(style, {
        "--slider-thumb-left": `${physicalPercent}%`,
        "--slider-thumb-offset": `${offset}px`,
      })}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel ?? context.formatters.getAccessibilityLabel?.(index)}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-value={providedAccessibilityValue ?? accessibilityValue}
      accessibility-traits={context.disabled ? "disabled" : accessibilityTraits}
    >
      {children}
    </view>
  );
});
SliderThumb.displayName = "SliderThumb";

export const SliderTick = React.forwardRef<NodesRef, SliderTickProps>((props, ref) => {
  const [variantProps, restProps] = sliderTick.splitVariantProps(props);
  const { children: _children, className, style, value, ...nativeProps } = restProps;
  const context = useSliderContext("Slider.Tick");
  const percent = percentageForValue(value, context.min, context.max);
  const physicalPercent = context.dir === "ltr" ? percent : 100 - percent;
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(sliderTick(variantProps), className)}
      style={dynamicStyle(style, {
        "--slider-tick-left": `${physicalPercent}%`,
        "--slider-tick-offset": `${getThumbInBoundsOffset(context.dimensions.thumbWidth, physicalPercent, 1)}px`,
      })}
      accessibility-elements-hidden={true}
    />
  );
});
SliderTick.displayName = "SliderTick";

export const SliderMarkers = React.forwardRef<NodesRef, SliderMarkersProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSliderContext("Slider.Markers");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(context.getClasses({ disabled: context.disabled }).markers, className)}
    >
      {children}
    </view>
  );
});
SliderMarkers.displayName = "SliderMarkers";

export const SliderMarker = React.forwardRef<NodesRef, SliderMarkerProps>((props, ref) => {
  const [variantProps, restProps] = sliderMarker.splitVariantProps(props);
  const { children, className, style, value, ...nativeProps } = restProps;
  const context = useSliderContext("Slider.Marker");
  const percent = percentageForValue(value, context.min, context.max);
  const physicalPercent = context.dir === "ltr" ? percent : 100 - percent;
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(
        sliderMarker({ ...variantProps, dir: context.dir, disabled: context.disabled }),
        className,
      )}
      style={dynamicStyle(style, {
        "--slider-marker-left": `${physicalPercent}%`,
        "--slider-marker-offset":
          percent === 0 || percent === 100
            ? "0px"
            : `${getThumbInBoundsOffset(context.dimensions.thumbWidth, physicalPercent, 1)}px`,
      })}
      accessibility-elements-hidden={true}
    >
      {children}
    </view>
  );
});
SliderMarker.displayName = "SliderMarker";

export const SliderValueIndicatorRoot = React.forwardRef<NodesRef, SliderValueIndicatorRootProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      index = 0,
      bindlayoutchange: userBindLayoutChange,
      ...nativeProps
    } = props;
    const context = useSliderContext("Slider.ValueIndicatorRoot");
    const value = context.values[index];
    const localRef = React.useRef<NodesRef>(null);
    React.useEffect(() => {
      context.registerIndicator(index, localRef);
    }, [context.registerIndicator, index, value]);
    const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
      (...args) => {
        "background only";
        userBindLayoutChange?.(...args);
        const width = getLayoutWidth(args[0]);
        if (width != null) context.updateIndicatorWidth(index, width);
      },
      [context, index, userBindLayoutChange],
    );
    if (value === undefined) return null;
    const percent = percentageForValue(value, context.min, context.max);
    const physicalPercent = context.dir === "ltr" ? percent : 100 - percent;
    const thumbOffset = getThumbInBoundsOffset(context.dimensions.thumbWidth, physicalPercent, 1);
    const indicatorOffset = getStickyLabelOffset(
      context.dimensions.indicatorWidths[index] ?? 0,
      physicalPercent,
      context.dimensions.thumbWidth,
      context.dimensions.trackWidth,
      1,
    );
    const shown = context.dragging && context.activeThumbIndex === index;
    const visible = !context.disabled && !context.readOnly && shown;
    return (
      <view
        {...mergeProps(
          nativeProps,
          ref ? { ref } : {},
          { ref: localRef },
          { bindlayoutchange: handleLayoutChange },
        )}
        className={clsx(
          context.getClasses({
            disabled: context.disabled,
            dragging: context.dragging,
            valueIndicatorShown: visible,
            valueIndicatorEverShown: context.valueIndicatorEverShown,
          }).valueIndicatorRoot,
          className,
        )}
        style={dynamicStyle(style, {
          "--slider-value-indicator-left": `${physicalPercent}%`,
          "--slider-value-indicator-offset": `${indicatorOffset}px`,
          "--slider-thumb-offset": `${thumbOffset}px`,
        })}
        accessibility-elements-hidden={true}
      >
        {children}
      </view>
    );
  },
);
SliderValueIndicatorRoot.displayName = "SliderValueIndicatorRoot";

export const SliderValueIndicatorArrow = React.forwardRef<NodesRef, SliderValueIndicatorArrowProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useSliderContext("Slider.ValueIndicatorArrow");
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(
          context.getClasses({ disabled: context.disabled, dragging: context.dragging })
            .valueIndicatorArrow,
          className,
        )}
      >
        {children}
      </view>
    );
  },
);
SliderValueIndicatorArrow.displayName = "SliderValueIndicatorArrow";

export const SliderValueIndicatorLabel = React.forwardRef<NodesRef, SliderValueIndicatorLabelProps>(
  (props, ref) => {
    const { children, className, style, index = 0, ...nativeProps } = props;
    const context = useSliderContext("Slider.ValueIndicatorLabel");
    const value = context.values[index];
    if (value === undefined) return null;
    return (
      <text
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(
          context.getClasses({
            disabled: context.disabled,
            dragging: context.dragging,
            valueIndicatorEverShown: context.valueIndicatorEverShown,
          }).valueIndicatorLabel,
          className,
        )}
        style={style}
      >
        {children ?? context.formatters.getValueIndicatorLabel({ value, thumbIndex: index })}
      </text>
    );
  },
);
SliderValueIndicatorLabel.displayName = "SliderValueIndicatorLabel";

function clampRatio(value: number): number {
  return Math.min(1, Math.max(0, value));
}
