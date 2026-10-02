import { reactionButton } from "@seed-design/lynx-css/recipes/reaction-button";
import type { ReactionButtonVariantProps } from "@seed-design/lynx-css/recipes/reaction-button";
import { useToggle } from "@seed-design/lynx-react-toggle";
import clsx from "clsx";
import * as React from "@lynx-js/react";
import { cloneElement, useMemo } from "@lynx-js/react";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import { mergeProps } from "../../utils/merge-props";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { isCountElement, type CountProps } from "../Count/Count";
import { getIconSlotName, IconSlotProvider } from "../Icon/Icon";
import { ProgressCircleRange, ProgressCircleRoot, ProgressCircleTrack } from "../ProgressCircle";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HTML button 속성 및 native form 제출
 * - 키보드 focus / focusVisible
 * - `asChild`
 */
export interface ReactionButtonProps
  extends Omit<ReactionButtonVariantProps, "selected" | "pressed" | "disabled" | "loading">,
    Omit<LynxStyledElementProps, "flatten">,
    LynxPressableProps,
    LynxAccessibilityProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * 버튼의 비활성화 여부입니다. `true`이면 tap, `onPressedChange`, 눌림 상태가 막힙니다.
   * @default false
   */
  disabled?: boolean;
  /**
   * 버튼에 등록된 비동기 작업이 진행 중임을 나타냅니다. `disabled`와 같이 tap, `onPressedChange`,
   * 눌림 상태를 막습니다.
   * @default false
   */
  loading?: boolean;
}

export const ReactionButton = React.forwardRef<unknown, ReactionButtonProps>((props, ref) => {
  const [variantProps, otherProps] = reactionButton.splitVariantProps(props);
  const {
    children,
    className,
    style,
    defaultPressed,
    onPressedChange,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = otherProps;
  const { size, pressed: pressedProp, disabled = false, loading = false } = variantProps;
  const api = useToggle({
    pressed: pressedProp,
    defaultPressed,
    onPressedChange,
    disabled: disabled || loading,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
  });
  const selected = api.pressed;
  const pressed = api.active;
  // Press state follows the Scale Feedback Main Thread touch handlers.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: api.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classNames = reactionButton({ ...variantProps, selected, pressed, disabled, loading });
  const iconSlotContextValue = useMemo(
    () => ({
      classNames: { prefixIcon: classNames.prefixIcon },
      deps: [size ?? "small", selected, pressed, disabled, loading],
    }),
    [classNames.prefixIcon, size, selected, pressed, disabled, loading],
  );

  const prefixIconChildren: React.ReactNode[] = [];
  const labelChildren: React.ReactNode[] = [];
  const countChildren: React.ReactElement<CountProps>[] = [];

  for (const child of toArray(children)) {
    if (getIconSlotName(child) === "prefixIcon") {
      prefixIconChildren.push(child);
      continue;
    }

    if (isCountElement(child)) {
      countChildren.push(child);
      continue;
    }

    labelChildren.push(child);
  }

  return (
    <IconSlotProvider value={iconSlotContextValue}>
      <view
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          scaleFeedbackTargetProps,
          scaleFeedbackTriggerProps,
          rootProps,
          nativeProps,
        )}
        flatten={false}
        className={clsx(classNames.root, className)}
        style={style}
      >
        <view className={classNames.content}>
          {prefixIconChildren}
          {labelChildren.length > 0 ? (
            <text className={classNames.label}>{labelChildren}</text>
          ) : null}
          {countChildren.map((child) =>
            cloneElement(child, {
              className: clsx(classNames.count, child.props.className),
            }),
          )}
        </view>
        {loading ? (
          <view className={classNames.loadingIndicator}>
            <ProgressCircleRoot size="14" tone="inherit">
              <ProgressCircleTrack />
              <ProgressCircleRange />
            </ProgressCircleRoot>
          </view>
        ) : null}
      </view>
    </IconSlotProvider>
  );
});
ReactionButton.displayName = "ReactionButton";
