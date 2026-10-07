import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import { useCollapsibleContext } from "./useCollapsibleContext.js";

type ViewProps = IntrinsicElements["view"];
type TriggerAccessibilityProps = Pick<
  ViewProps,
  | "accessibility-element"
  | "accessibility-role-description"
  | "accessibility-traits"
  | "accessibility-value"
>;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseCollapsibleTriggerProps
  extends TriggerAccessibilityProps,
    MainThreadTouchProps {
  bindtap?: ViewProps["bindtap"];
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
  /** @default "펼쳐짐" */
  expandedAccessibilityValue?: string;
  /** @default "접힘" */
  collapsedAccessibilityValue?: string;
}

export interface UseCollapsibleTriggerReturn {
  open: boolean;
  disabled: boolean;
  pressed: boolean;
  /**
   * Trigger native view에 펼칩니다. 소비자의 `main-thread:bindtouch*`는 view가 아니라 이 훅에 넘겨야
   * 눌림 상태와 합성된 handler로 포함됩니다.
   */
  triggerProps: TriggerAccessibilityProps &
    MainThreadTouchProps & {
      "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
      bindtap: NonNullable<ViewProps["bindtap"]>;
      bindtouchstart: NonNullable<ViewProps["bindtouchstart"]>;
      bindtouchend: NonNullable<ViewProps["bindtouchend"]>;
      bindtouchcancel: NonNullable<ViewProps["bindtouchcancel"]>;
    };
}

/**
 * 가까운 Collapsible의 열림 상태를 tap으로 전환하고 press·접근성 값을 제공하는 훅입니다.
 * 소비자 `bindtap`은 전환 뒤에 호출합니다.
 */
export function useCollapsibleTrigger({
  bindtap,
  "main-thread:bindtap": mainThreadOnTap,
  "main-thread:bindtouchstart": mainThreadOnTouchStart,
  "main-thread:bindtouchend": mainThreadOnTouchEnd,
  "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
  expandedAccessibilityValue = "펼쳐짐",
  collapsedAccessibilityValue = "접힘",
  "accessibility-element": accessibilityElement = true,
  "accessibility-role-description": accessibilityRoleDescription = "button",
  "accessibility-traits": accessibilityTraits,
  "accessibility-value": accessibilityValue,
}: UseCollapsibleTriggerProps = {}): UseCollapsibleTriggerReturn {
  const context = useCollapsibleContext();
  const handleTap = React.useCallback<NonNullable<ViewProps["bindtap"]>>(
    (event) => {
      "background only";
      context.toggle();
      bindtap?.(event);
    },
    [bindtap, context],
  );
  const {
    pressed,
    bindtap: pressTap,
    ...touchHandlers
  } = usePressTap({
    disabled: context.disabled,
    onTap: handleTap,
    mainThreadOnTouchStart,
    mainThreadOnTap,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  return {
    open: context.open,
    disabled: context.disabled,
    pressed,
    triggerProps: {
      bindtap: pressTap,
      ...touchHandlers,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits ?? (context.disabled ? "disabled" : "button"),
      "accessibility-value":
        accessibilityValue ??
        (context.open ? expandedAccessibilityValue : collapsedAccessibilityValue),
    },
  };
}
