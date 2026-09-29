import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import { useAccordionItemContext } from "./useAccordionItemContext.js";

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

export interface UseAccordionTriggerProps extends TriggerAccessibilityProps, MainThreadTouchProps {
  bindtap?: ViewProps["bindtap"];
  expandedAccessibilityValue?: string;
  collapsedAccessibilityValue?: string;
}

export interface UseAccordionTriggerReturn {
  open: boolean;
  disabled: boolean;
  pressed: boolean;
  /**
   * Trigger native view에 펼칩니다. 소비자의 `main-thread:bindtouch*`는 view가 아니라 이 훅에 넘겨야
   * 눌림 상태와 합성된 handler로 포함됩니다.
   */
  triggerProps: TriggerAccessibilityProps &
    MainThreadTouchProps & {
      bindtap: NonNullable<ViewProps["bindtap"]>;
      bindtouchstart: NonNullable<ViewProps["bindtouchstart"]>;
      bindtouchend: NonNullable<ViewProps["bindtouchend"]>;
      bindtouchcancel: NonNullable<ViewProps["bindtouchcancel"]>;
    };
}

export function useAccordionTrigger({
  bindtap,
  "main-thread:bindtouchstart": mainThreadOnTouchStart,
  "main-thread:bindtouchend": mainThreadOnTouchEnd,
  "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
  expandedAccessibilityValue = "펼쳐짐",
  collapsedAccessibilityValue = "접힘",
  "accessibility-element": accessibilityElement = true,
  "accessibility-role-description": accessibilityRoleDescription = "button",
  "accessibility-traits": accessibilityTraits,
  "accessibility-value": accessibilityValue,
}: UseAccordionTriggerProps = {}): UseAccordionTriggerReturn {
  const context = useAccordionItemContext();
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
