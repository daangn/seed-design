import { segmentedControl } from "@seed-design/lynx-css/recipes/segmented-control";
import * as React from "@lynx-js/react";
import clsx from "clsx";
import {
  SegmentedControlProvider,
  useSegmentedControl,
  useSegmentedControlContext,
  useSegmentedControlItem,
  type UseSegmentedControlProps,
} from "@seed-design/lynx-react-segmented-control";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxViewRef,
} from "../../types";
import { HStack } from "../Stack";
import { mergeProps } from "../../utils/merge-props";

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-segmented-control`의 선택 값·Item 등록·`--segment-count`/`--segment-index`
 * 입력 위에 SEED recipe, Scale Feedback, label·notification·Indicator 표현을 조립한다.
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput, name, form: Lynx에 HTML form 제출 모델이 없음
 * - focus, focusVisible: Lynx에 키보드 포커스 모델이 없음
 * - raw DOM change event: 선택 변경은 onValueChange로 노출
 */
export interface SegmentedControlRootProps
  extends Pick<UseSegmentedControlProps, "value" | "defaultValue" | "disabled" | "onValueChange">,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const SegmentedControlRoot = React.forwardRef<unknown, SegmentedControlRootProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      value,
      defaultValue,
      disabled,
      onValueChange,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      ...nativeProps
    } = props;
    const api = useSegmentedControl({
      value,
      defaultValue,
      disabled,
      onValueChange,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
    });
    const rootClassName = segmentedControl({ hasSelection: api.segmentIndex >= 0 }).root;

    return (
      <SegmentedControlProvider value={api}>
        <view
          {...mergeProps(
            ref ? { ref: ref as LynxViewRef } : {},
            nativeProps,
            api.rootProps,
            style ? { style } : {},
          )}
          className={clsx(rootClassName, className)}
        >
          {children}
        </view>
      </SegmentedControlProvider>
    );
  },
);
SegmentedControlRoot.displayName = "SegmentedControlRoot";

export interface SegmentedControlItemProps
  extends Omit<LynxStyledElementProps, "children">,
    LynxAccessibilityProps,
    LynxPressableProps {
  children: string | number;
  notification?: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export const SegmentedControlItem = React.forwardRef<unknown, SegmentedControlItemProps>(
  (props, ref) => {
    const {
      children,
      notification,
      className,
      style,
      value,
      disabled,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const api = useSegmentedControlItem({
      value,
      disabled,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
    });
    // The pressed overlays use the `:active` selector, so the Background press state is not wired.
    const { bindtouchstart, bindtouchend, bindtouchcancel, ...itemProps } = api.itemProps;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: api.disabled,
    });
    const classes = segmentedControl({ selected: api.checked, disabled: api.disabled });
    const label =
      typeof children === "string" || typeof children === "number" ? String(children) : undefined;

    return (
      <view
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          scaleFeedbackTriggerProps,
          nativeProps,
          itemProps,
        )}
        accessibility-label={accessibilityLabel ?? label}
        className={clsx(classes.item, className)}
        style={style}
      >
        <view accessibility-elements-hidden={true} className={classes.itemBackground} />
        <view accessibility-elements-hidden={true} className={classes.itemSelectedBackground} />
        <view className={classes.itemContent} {...scaleFeedbackTargetProps}>
          {notification ? (
            <HStack position="relative" align="flex-start">
              <text className={classes.label}>{children}</text>
              <view accessibility-elements-hidden={true}>{notification}</view>
            </HStack>
          ) : (
            <text className={classes.label}>{children}</text>
          )}
        </view>
      </view>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";

export interface SegmentedControlIndicatorProps extends LynxStyledElementProps {}

export const SegmentedControlIndicator = React.forwardRef<unknown, SegmentedControlIndicatorProps>(
  (props, ref) => {
    const { className, style, ...nativeProps } = props;
    const { segmentCount, segmentIndex } = useSegmentedControlContext();
    const registered = segmentCount > 0;
    // Items register after the first render. Lynx animates a property change that lands in the
    // same update as the transition enable, so enable transitions one update after registration.
    const [transitionEnabled, setTransitionEnabled] = React.useState(false);
    React.useEffect(() => {
      "background only";
      setTransitionEnabled(registered);
    }, [registered]);
    const indicatorClassName = segmentedControl({
      hasSelection: segmentIndex >= 0,
      transitionEnabled: transitionEnabled && registered,
    }).indicator;

    return (
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        accessibility-elements-hidden={true}
        className={clsx(indicatorClassName, className)}
        style={style}
      />
    );
  },
);
SegmentedControlIndicator.displayName = "SegmentedControlIndicator";
