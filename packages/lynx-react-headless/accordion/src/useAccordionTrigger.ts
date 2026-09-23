import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import { useAccordionItemContext } from "./useAccordionContext.js";

type ViewProps = IntrinsicElements["view"];
type TriggerAccessibilityProps = Pick<
  ViewProps,
  | "accessibility-element"
  | "accessibility-role-description"
  | "accessibility-traits"
  | "accessibility-value"
>;

export interface UseAccordionTriggerProps extends TriggerAccessibilityProps {
  bindtap?: ViewProps["bindtap"];
  expandedAccessibilityValue?: string;
  collapsedAccessibilityValue?: string;
}

export interface UseAccordionTriggerReturn {
  open: boolean;
  disabled: boolean;
  pressed: boolean;
  triggerProps: TriggerAccessibilityProps & {
    bindtap: NonNullable<ViewProps["bindtap"]>;
    bindtouchstart: NonNullable<ViewProps["bindtouchstart"]>;
    bindtouchend: NonNullable<ViewProps["bindtouchend"]>;
    bindtouchcancel: NonNullable<ViewProps["bindtouchcancel"]>;
  };
}

export function useAccordionTrigger({
  bindtap,
  expandedAccessibilityValue = "펼쳐짐",
  collapsedAccessibilityValue = "접힘",
  "accessibility-element": accessibilityElement = true,
  "accessibility-role-description": accessibilityRoleDescription = "button",
  "accessibility-traits": accessibilityTraits,
  "accessibility-value": accessibilityValue,
}: UseAccordionTriggerProps = {}): UseAccordionTriggerReturn {
  const context = useAccordionItemContext("AccordionTrigger");
  const handleTap = React.useCallback<NonNullable<ViewProps["bindtap"]>>(
    (event) => {
      context.toggle();
      bindtap?.(event);
    },
    [bindtap, context],
  );
  const {
    pressed,
    bindtap: pressTap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
  } = usePressTap({
    disabled: context.disabled,
    onTap: handleTap,
  });

  return {
    open: context.open,
    disabled: context.disabled,
    pressed,
    triggerProps: {
      bindtap: pressTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits ?? (context.disabled ? "disabled" : "button"),
      "accessibility-value":
        accessibilityValue ??
        (context.open ? expandedAccessibilityValue : collapsedAccessibilityValue),
    },
  };
}
