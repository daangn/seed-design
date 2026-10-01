import * as React from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useSlider, type UseSliderProps } from "./useSlider.js";
import { SliderProvider, useSliderContext } from "./useSliderContext.js";

type ViewProps = IntrinsicElements["view"];
type TextProps = IntrinsicElements["text"];
type NativeViewProps = Omit<ViewProps, "children" | "style"> & {
  children?: React.ReactNode;
  style?: CSSProperties;
};

type SliderHookPropName = keyof UseSliderProps;

function assignNodeRef(ref: React.ForwardedRef<unknown>, node: NodesRef | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

/** 사용자 handler를 먼저 호출한 뒤 Slider handler를 호출합니다. 사용자 handler가 없으면 Slider handler를 그대로 씁니다. */
function chain<Args extends unknown[]>(
  user: ((...args: Args) => void) | undefined,
  own: (...args: Args) => void,
): (...args: Args) => void {
  if (!user) return own;
  return (...args) => {
    "background only";
    user(...args);
    own(...args);
  };
}

export type SliderRootProps = UseSliderProps & Omit<NativeViewProps, SliderHookPropName>;

/**
 * 스타일 없이 Slider의 값·touch drag·좌표 측정을 연결하는 native `<view>`입니다.
 * Root rect를 기준으로 touch 좌표를 값으로 바꾸므로, thumb이 움직이는 영역과 Root의 가로 범위를 맞춥니다.
 */
export const SliderRoot = React.forwardRef<unknown, SliderRootProps>((props, ref) => {
  const {
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
    children,
    catchtouchstart,
    catchtouchmove,
    catchtouchend,
    catchtouchcancel,
    bindlayoutchange,
    ...nativeProps
  } = props;
  const api = useSlider(props);
  const { rootProps } = api;
  const rootRef = api.refs.root;
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      "background only";
      rootRef(node);
      assignNodeRef(ref, node);
    },
    [rootRef, ref],
  );

  return (
    <SliderProvider value={api}>
      <view
        {...rootProps}
        {...nativeProps}
        ref={handleRef as ViewProps["ref"]}
        catchtouchstart={chain(catchtouchstart, rootProps.catchtouchstart)}
        catchtouchmove={chain(catchtouchmove, rootProps.catchtouchmove)}
        catchtouchend={chain(catchtouchend, rootProps.catchtouchend)}
        catchtouchcancel={chain(catchtouchcancel, rootProps.catchtouchcancel)}
        bindlayoutchange={chain(bindlayoutchange, rootProps.bindlayoutchange)}
      >
        {children}
      </view>
    </SliderProvider>
  );
});
SliderRoot.displayName = "SliderRoot";

export interface SliderRangeProps extends NativeViewProps {}

/** 선택 구간의 위치 변수(`--slider-range-left`, `--slider-range-width`)를 가진 `<view>`입니다. */
export const SliderRange = React.forwardRef<unknown, SliderRangeProps>((props, ref) => {
  const { children, style, ...nativeProps } = props;
  const { rangeProps } = useSliderContext();
  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...nativeProps}
      style={{ ...rangeProps.style, ...style }}
    >
      {children}
    </view>
  );
});
SliderRange.displayName = "SliderRange";

export interface SliderThumbProps extends NativeViewProps {
  thumbIndex: number;
}

/**
 * `thumbIndex`번째 값을 나타내는 조절 가능한 `<view>`입니다.
 * 위치 변수(`--slider-thumb-left`, `--slider-thumb-offset-ratio`)와 `adjustable` 접근성 값을 제공합니다.
 */
export const SliderThumb = React.forwardRef<unknown, SliderThumbProps>((props, ref) => {
  const { children, thumbIndex, style, bindtouchstart, ...nativeProps } = props;
  const { values, disabled, getThumbProps, getThumbRef } = useSliderContext();
  const thumbRef = getThumbRef(thumbIndex);
  const handleRef = React.useCallback(
    (node: NodesRef | null) => {
      "background only";
      thumbRef(node);
      assignNodeRef(ref, node);
    },
    [thumbRef, ref],
  );
  if (values[thumbIndex] === undefined) return null;
  const thumbProps = getThumbProps(thumbIndex);

  return (
    <view
      {...thumbProps}
      {...nativeProps}
      ref={handleRef as ViewProps["ref"]}
      style={{ ...thumbProps.style, ...style }}
      bindtouchstart={chain(bindtouchstart, thumbProps.bindtouchstart)}
      accessibility-traits={disabled ? "disabled" : nativeProps["accessibility-traits"]}
    >
      {children}
    </view>
  );
});
SliderThumb.displayName = "SliderThumb";

export interface SliderTickProps extends NativeViewProps {
  value: number;
}

/** `value` 위치의 눈금 `<view>`입니다. 접근성 트리에서 숨깁니다. */
export const SliderTick = React.forwardRef<unknown, SliderTickProps>((props, ref) => {
  const { children, value, style, ...nativeProps } = props;
  const { getTickProps } = useSliderContext();
  const tickProps = getTickProps(value);
  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...tickProps}
      {...nativeProps}
      style={{ ...tickProps.style, ...style }}
    >
      {children}
    </view>
  );
});
SliderTick.displayName = "SliderTick";

export interface SliderMarkerProps extends NativeViewProps {
  value: number;
}

/** `value` 위치의 marker `<view>`입니다. 접근성 트리에서 숨기므로 의미는 `getAccessibilityValueText`로도 전달합니다. */
export const SliderMarker = React.forwardRef<unknown, SliderMarkerProps>((props, ref) => {
  const { children, value, style, ...nativeProps } = props;
  const { getMarkerProps } = useSliderContext();
  const markerProps = getMarkerProps(value);
  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...markerProps}
      {...nativeProps}
      style={{ ...markerProps.style, ...style }}
    >
      {children}
    </view>
  );
});
SliderMarker.displayName = "SliderMarker";

export interface SliderValueIndicatorRootProps extends NativeViewProps {
  thumbIndex: number;
}

/**
 * `thumbIndex`번째 thumb 위에 표시할 Value Indicator `<view>`입니다.
 * 위치 변수와 폭 측정을 연결하며, 표시 여부는 `useSliderContext().getValueIndicatorProps(thumbIndex).isShown`으로 판단합니다.
 */
export const SliderValueIndicatorRoot = React.forwardRef<unknown, SliderValueIndicatorRootProps>(
  (props, ref) => {
    const { children, thumbIndex, style, bindlayoutchange, ...nativeProps } = props;
    const { values, getValueIndicatorProps } = useSliderContext();
    const { rootProps, rootRef } = getValueIndicatorProps(thumbIndex);
    const handleRef = React.useCallback(
      (node: NodesRef | null) => {
        "background only";
        rootRef(node);
        assignNodeRef(ref, node);
      },
      [rootRef, ref],
    );
    if (values[thumbIndex] === undefined) return null;

    return (
      <view
        {...rootProps}
        {...nativeProps}
        ref={handleRef as ViewProps["ref"]}
        style={{ ...rootProps.style, ...style }}
        bindlayoutchange={chain(bindlayoutchange, rootProps.bindlayoutchange)}
      >
        {children}
      </view>
    );
  },
);
SliderValueIndicatorRoot.displayName = "SliderValueIndicatorRoot";

export interface SliderValueIndicatorLabelProps extends Omit<TextProps, "children"> {
  thumbIndex: number;
  children?: React.ReactNode;
}

/** `children`이 없으면 `getValueIndicatorLabel`의 결과를 표시하는 `<text>`입니다. */
export const SliderValueIndicatorLabel = React.forwardRef<unknown, SliderValueIndicatorLabelProps>(
  (props, ref) => {
    const { thumbIndex, children, ...nativeProps } = props;
    const { values, getValueIndicatorProps } = useSliderContext();
    if (values[thumbIndex] === undefined) return null;
    return (
      <text {...(ref ? { ref: ref as TextProps["ref"] } : {})} {...nativeProps}>
        {children ?? getValueIndicatorProps(thumbIndex).labelProps.children}
      </text>
    );
  },
);
SliderValueIndicatorLabel.displayName = "SliderValueIndicatorLabel";
