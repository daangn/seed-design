import type { NodesRef } from "@lynx-js/types";
import * as React from "@lynx-js/react";
import clsx from "clsx";
import {
  SliderProvider,
  useSlider,
  useSliderContext,
  type UseSliderContext,
  type UseSliderProps,
} from "@seed-design/lynx-react-slider";
import { slider } from "@seed-design/lynx-css/recipes/slider";
import { sliderTick, type SliderTickVariantProps } from "@seed-design/lynx-css/recipes/slider-tick";
import {
  sliderMarker,
  type SliderMarkerVariantProps,
} from "@seed-design/lynx-css/recipes/slider-marker";

import type { LynxHostProps } from "../../types";
import { mergeProps } from "../../utils/merge-props";

export type SliderValues = number[];

/**
 * @platform Lynx
 *
 * 웹 전용 HiddenInput/name, DOM form 이벤트, keyboard/focus/hover 상태는 제공하지 않습니다.
 * 값 변경은 native touch gesture로 처리하며 Thumb는 `accessibility-*` 속성을 직접 노출합니다.
 * touch 좌표는 Root의 가로 범위를 기준으로 값으로 바꿉니다.
 */
export interface SliderRootProps
  extends Omit<LynxHostProps<"view">, keyof UseSliderProps>,
    UseSliderProps {
  children?: React.ReactNode;
}

export interface SliderControlProps extends LynxHostProps<"view"> {
  children?: React.ReactNode;
}
export interface SliderTrackProps extends LynxHostProps<"view"> {
  children?: React.ReactNode;
}
export interface SliderRangeProps extends LynxHostProps<"view"> {
  children?: React.ReactNode;
}
export interface SliderThumbProps extends LynxHostProps<"view"> {
  thumbIndex: number;
  children?: React.ReactNode;
}
export interface SliderTickProps extends LynxHostProps<"view">, SliderTickVariantProps {
  value: number;
  children?: React.ReactNode;
}
export interface SliderMarkersProps extends LynxHostProps<"view"> {
  children?: React.ReactNode;
}
export interface SliderMarkerProps
  extends LynxHostProps<"view">,
    Omit<SliderMarkerVariantProps, "dir" | "disabled"> {
  value: number;
  children?: React.ReactNode;
}
export interface SliderValueIndicatorRootProps extends LynxHostProps<"view"> {
  thumbIndex: number;
  children?: React.ReactNode;
}
export interface SliderValueIndicatorArrowProps extends LynxHostProps<"view"> {
  children?: React.ReactNode;
}
export interface SliderValueIndicatorArrowTipProps extends LynxHostProps<"view"> {
  children?: React.ReactNode;
}
export interface SliderValueIndicatorLabelProps extends LynxHostProps<"text"> {
  thumbIndex: number;
  children?: React.ReactNode;
}

export interface SliderClassNames {
  root: string;
  control: string;
  track: string;
  range: string;
  thumb: string;
  markers: string;
  valueIndicatorMotion: string;
  valueIndicatorRoot: string;
  valueIndicatorArrow: string;
  valueIndicatorArrowTip: string;
  valueIndicatorLabel: string;
}

interface StyledSliderContextValue extends UseSliderContext {
  classes: SliderClassNames;
}

function isStyledSliderContext(context: UseSliderContext): context is StyledSliderContextValue {
  return "classes" in context;
}

function useStyledSliderContext(consumer: string): StyledSliderContextValue {
  const context = useSliderContext({ strict: false });
  if (!context || !isStyledSliderContext(context)) {
    throw new Error(`<${consumer}/> must be rendered inside <Slider.Root/>.`);
  }
  return context;
}

/**
 * `@seed-design/lynx-react-slider`의 값·touch drag·좌표 측정 위에 SEED recipe를 조립합니다.
 */
export const SliderRoot = React.forwardRef<NodesRef, SliderRootProps>((props, forwardedRef) => {
  const api = useSlider(props);
  const {
    children,
    className,
    style,
    values: _values,
    defaultValues: _defaultValues,
    onValuesChange: _onValuesChange,
    onValuesCommit: _onValuesCommit,
    min: _min,
    max: _max,
    step: _step,
    allowedValues: _allowedValues,
    minStepsBetweenThumbs: _minStepsBetweenThumbs,
    dir: _dir,
    disabled: _disabled,
    readOnly: _readOnly,
    invalid: _invalid,
    getAccessibilityLabel: _getAccessibilityLabel,
    getAccessibilityValueText: _getAccessibilityValueText,
    getValueIndicatorLabel: _getValueIndicatorLabel,
    valueIndicatorTrigger: _valueIndicatorTrigger,
    ...nativeProps
  } = props;
  const classes = React.useMemo(
    () =>
      slider({
        disabled: api.disabled,
        dragging: api.isDragging,
        valueIndicatorEverShown: api.valueIndicatorEverShown,
      }),
    [api.disabled, api.isDragging, api.valueIndicatorEverShown],
  );
  const contextValue = React.useMemo<StyledSliderContextValue>(
    () => ({ ...api, classes }),
    [api, classes],
  );

  return (
    <SliderProvider value={contextValue}>
      <view
        {...mergeProps(api.rootProps, nativeProps, forwardedRef ? { ref: forwardedRef } : {}, {
          ref: api.refs.root,
        })}
        className={clsx(classes.root, className)}
        style={style}
      >
        {children}
      </view>
    </SliderProvider>
  );
});
SliderRoot.displayName = "SliderRoot";

export const SliderControl = React.forwardRef<NodesRef, SliderControlProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useStyledSliderContext("Slider.Control");
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
  const context = useStyledSliderContext("Slider.Track");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(
        slider({ disabled: context.disabled, dragging: context.isDragging }).track,
        className,
      )}
    >
      {children}
    </view>
  );
});
SliderTrack.displayName = "SliderTrack";

export const SliderRange = React.forwardRef<NodesRef, SliderRangeProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useStyledSliderContext("Slider.Range");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, context.rangeProps, nativeProps)}
      className={clsx(
        slider({ disabled: context.disabled, dragging: context.isDragging }).range,
        className,
      )}
    >
      {children}
    </view>
  );
});
SliderRange.displayName = "SliderRange";

export const SliderThumb = React.forwardRef<NodesRef, SliderThumbProps>((props, forwardedRef) => {
  const { children, thumbIndex, className, ...nativeProps } = props;
  const context = useStyledSliderContext("Slider.Thumb");
  if (context.values[thumbIndex] === undefined) return null;
  return (
    <view
      {...mergeProps(
        {
          "accessibility-traits": context.disabled
            ? ("disabled" as const)
            : nativeProps["accessibility-traits"],
        },
        forwardedRef ? { ref: forwardedRef } : {},
        { ref: context.getThumbRef(thumbIndex) },
        context.getThumbProps(thumbIndex),
        nativeProps,
      )}
      className={clsx(
        slider({
          disabled: context.disabled,
          dragging: context.isDragging,
          thumbDragging: context.isDragging && context.activeThumbIndex === thumbIndex,
        }).thumb,
        className,
      )}
    >
      {children}
    </view>
  );
});
SliderThumb.displayName = "SliderThumb";

export const SliderTick = React.forwardRef<NodesRef, SliderTickProps>((props, ref) => {
  const [variantProps, restProps] = sliderTick.splitVariantProps(props);
  const { children, className, value, ...nativeProps } = restProps;
  const context = useStyledSliderContext("Slider.Tick");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, context.getTickProps(value), nativeProps)}
      className={clsx(sliderTick(variantProps), className)}
    >
      {children}
    </view>
  );
});
SliderTick.displayName = "SliderTick";

export const SliderMarkers = React.forwardRef<NodesRef, SliderMarkersProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useStyledSliderContext("Slider.Markers");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(slider({ disabled: context.disabled }).markers, className)}
    >
      {children}
    </view>
  );
});
SliderMarkers.displayName = "SliderMarkers";

export const SliderMarker = React.forwardRef<NodesRef, SliderMarkerProps>((props, ref) => {
  const [variantProps, restProps] = sliderMarker.splitVariantProps(props);
  const { children, className, value, ...nativeProps } = restProps;
  const context = useStyledSliderContext("Slider.Marker");
  const markerProps = mergeProps(ref ? { ref } : {}, context.getMarkerProps(value), nativeProps);
  const markerClassName = clsx(
    sliderMarker({ ...variantProps, dir: context.dir, disabled: context.disabled }),
    className,
  );
  // Lynx는 `<view>` 바로 아래 문자열을 그리지 않고, 앱의 `text` 전역 색상이 상속을 덮을 수 있다.
  // 문자열·숫자 label은 Recipe의 위치·타이포그래피를 가진 `<text>`로 직접 렌더링한다.
  if (typeof children === "string" || typeof children === "number") {
    return (
      <text {...markerProps} className={markerClassName}>
        {children}
      </text>
    );
  }
  return (
    <view {...markerProps} className={markerClassName}>
      {children}
    </view>
  );
});
SliderMarker.displayName = "SliderMarker";

/**
 * 위치 변수는 transition을 담당하는 바깥 motion `<view>`에 두고, 이 컴포넌트의 ref·props는 안쪽 본문에 연결합니다.
 */
export const SliderValueIndicatorRoot = React.forwardRef<NodesRef, SliderValueIndicatorRootProps>(
  (props, ref) => {
    const { children, className, style, thumbIndex, ...nativeProps } = props;
    const context = useStyledSliderContext("Slider.ValueIndicatorRoot");
    if (context.values[thumbIndex] === undefined) return null;
    const {
      isShown,
      rootProps: { style: positionStyle, ...rootProps },
      rootRef,
    } = context.getValueIndicatorProps(thumbIndex);
    const classes = slider({
      disabled: context.disabled,
      dragging: context.isDragging,
      valueIndicatorShown: isShown,
      valueIndicatorEverShown: context.valueIndicatorEverShown,
    });
    return (
      <view
        className={classes.valueIndicatorMotion}
        style={positionStyle}
        accessibility-elements-hidden={true}
      >
        <view
          {...mergeProps(rootProps, nativeProps, ref ? { ref } : {}, { ref: rootRef })}
          className={clsx(classes.valueIndicatorRoot, className)}
          style={style}
        >
          {children}
        </view>
      </view>
    );
  },
);
SliderValueIndicatorRoot.displayName = "SliderValueIndicatorRoot";

export const SliderValueIndicatorArrow = React.forwardRef<NodesRef, SliderValueIndicatorArrowProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useStyledSliderContext("Slider.ValueIndicatorArrow");
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(
          slider({ disabled: context.disabled, dragging: context.isDragging }).valueIndicatorArrow,
          className,
        )}
      >
        {children}
      </view>
    );
  },
);
SliderValueIndicatorArrow.displayName = "SliderValueIndicatorArrow";

export const SliderValueIndicatorArrowTip = React.forwardRef<
  NodesRef,
  SliderValueIndicatorArrowTipProps
>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useStyledSliderContext("Slider.ValueIndicatorArrowTip");
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(
        slider({ disabled: context.disabled, dragging: context.isDragging }).valueIndicatorArrowTip,
        className,
      )}
    >
      {children}
    </view>
  );
});
SliderValueIndicatorArrowTip.displayName = "SliderValueIndicatorArrowTip";

export const SliderValueIndicatorLabel = React.forwardRef<NodesRef, SliderValueIndicatorLabelProps>(
  (props, ref) => {
    const { children, className, style, thumbIndex, ...nativeProps } = props;
    const context = useStyledSliderContext("Slider.ValueIndicatorLabel");
    if (context.values[thumbIndex] === undefined) return null;
    return (
      <text
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(
          slider({
            disabled: context.disabled,
            dragging: context.isDragging,
            valueIndicatorEverShown: context.valueIndicatorEverShown,
          }).valueIndicatorLabel,
          className,
        )}
        style={style}
      >
        {children ?? context.getValueIndicatorProps(thumbIndex).labelProps.children}
      </text>
    );
  },
);
SliderValueIndicatorLabel.displayName = "SliderValueIndicatorLabel";
