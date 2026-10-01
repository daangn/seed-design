import * as React from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements } from "@lynx-js/types";
import { useSegmentedControl, type UseSegmentedControlProps } from "./useSegmentedControl.js";
import { SegmentedControlProvider } from "./useSegmentedControlContext.js";
import {
  useSegmentedControlItem,
  type UseSegmentedControlItemProps,
} from "./useSegmentedControlItem.js";
import { SegmentedControlItemProvider } from "./useSegmentedControlItemContext.js";

type ViewProps = IntrinsicElements["view"];

export interface SegmentedControlRootProps
  extends UseSegmentedControlProps,
    Omit<ViewProps, keyof UseSegmentedControlProps | "style"> {
  /** geometry 변수와 병합하므로 객체만 받습니다. */
  style?: CSSProperties;
}

/**
 * 스타일 없이 SegmentedControl의 선택 값·Item 등록·접근성과 `--segment-count`·`--segment-index`
 * style을 연결하는 native `<view>`입니다. 사용자 `style`은 geometry 변수 뒤에 병합됩니다.
 */
export const SegmentedControlRoot = React.forwardRef<unknown, SegmentedControlRootProps>(
  (props, ref) => {
    const {
      children,
      style,
      value,
      defaultValue,
      onValueChange,
      disabled,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      ...nativeProps
    } = props;
    const api = useSegmentedControl({
      value,
      defaultValue,
      onValueChange,
      disabled,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
    });

    return (
      <SegmentedControlProvider value={api}>
        <view
          {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
          {...nativeProps}
          {...api.rootProps}
          style={{ ...api.rootProps.style, ...style }}
        >
          {children}
        </view>
      </SegmentedControlProvider>
    );
  },
);
SegmentedControlRoot.displayName = "SegmentedControlRoot";

export interface SegmentedControlItemProps
  extends UseSegmentedControlItemProps,
    Omit<ViewProps, keyof UseSegmentedControlItemProps> {}

/**
 * 스타일 없이 Item 등록·선택·press·접근성을 연결하는 native `<view>`입니다.
 * 하위 요소는 `useSegmentedControlItemContext`로 `checked`·`disabled`·`pressed`를 읽습니다.
 */
export const SegmentedControlItem = React.forwardRef<unknown, SegmentedControlItemProps>(
  (props, ref) => {
    const {
      children,
      value,
      disabled,
      bindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const api = useSegmentedControlItem({
      value,
      disabled,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
    });
    const {
      bindtouchstart: pressStart,
      bindtouchend: pressEnd,
      bindtouchcancel: pressCancel,
      ...itemProps
    } = api.itemProps;

    return (
      <SegmentedControlItemProvider value={api}>
        <view
          {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
          {...nativeProps}
          {...itemProps}
          bindtouchstart={(event) => {
            bindtouchstart?.(event);
            pressStart(event);
          }}
          bindtouchend={(event) => {
            bindtouchend?.(event);
            pressEnd(event);
          }}
          bindtouchcancel={(event) => {
            bindtouchcancel?.(event);
            pressCancel(event);
          }}
        >
          {children}
        </view>
      </SegmentedControlItemProvider>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";
