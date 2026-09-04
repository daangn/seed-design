import { reactionButton } from "@seed-design/lynx-css/recipes/reaction-button";
import type { ReactionButtonVariantProps } from "@seed-design/lynx-css/recipes/reaction-button";
import clsx from "clsx";
import * as React from "@lynx-js/react";
import { cloneElement, useMemo } from "@lynx-js/react";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { isCountElement, type CountProps } from "../Count/Count";
import { getIconSlotName, IconSlotProvider } from "../Icon/Icon";
import { ProgressCircleRange, ProgressCircleRoot } from "../ProgressCircle";

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
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ReactionButton = React.forwardRef<unknown, ReactionButtonProps>((props, ref) => {
  const {
    children,
    className,
    style,
    size,
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    loading = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const [selected, setSelected] = useControllableState({
    value: pressedProp,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });
  const handleTap = React.useCallback(
    (...args: Parameters<NonNullable<LynxPressableProps["bindtap"]>>) => {
      setSelected(!selected);
      bindtap?.(...args);
    },
    [bindtap, selected, setSelected],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const classNames = reactionButton({ size, selected, pressed, disabled, loading });
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
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classNames.root, className)}
        style={style}
        accessibility-element={accessibilityElement}
        accessibility-traits={
          disabled ? "disabled" : selected ? "selected" : (accessibilityTraits ?? "button")
        }
        {...pressHandlers}
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
              <ProgressCircleRange />
            </ProgressCircleRoot>
          </view>
        ) : null}
      </view>
    </IconSlotProvider>
  );
});
ReactionButton.displayName = "ReactionButton";
