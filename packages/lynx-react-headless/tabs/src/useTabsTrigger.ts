import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap } from "@seed-design/lynx-react-use-press-tap";
import { useTabsContext } from "./useTabsContext.js";
import { getTabsLayoutWidth } from "./Tabs.utils.js";
type NativeViewProps = IntrinsicElements["view"];
type LayoutChangeHandler = NonNullable<NativeViewProps["bindlayoutchange"]>;

export interface UseTabsTriggerProps
  extends Pick<
    NativeViewProps,
    | "children"
    | "bindtap"
    | "main-thread:bindtap"
    | "main-thread:bindtouchstart"
    | "main-thread:bindtouchend"
    | "main-thread:bindtouchcancel"
    | "accessibility-label"
  > {
  value: string;
  disabled?: boolean;
}
export function useTabsTrigger({
  value: triggerValue,
  disabled = false,
  children,
  bindtap,
  "accessibility-label": accessibilityLabel,
  "main-thread:bindtap": mainThreadBindtap,
  "main-thread:bindtouchstart": mainThreadBindtouchstart,
  "main-thread:bindtouchend": mainThreadBindtouchend,
  "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
}: UseTabsTriggerProps) {
  const context = useTabsContext();
  const selected = context.value === triggerValue;
  const visuallySelected = context.visualValue === triggerValue;

  React.useEffect(() => {
    "background only";
    return context.registerTrigger(triggerValue, disabled);
  }, [context.registerTrigger, triggerValue]);

  React.useEffect(() => {
    "background only";
    context.updateTriggerDisabled(triggerValue, disabled);
  }, [context.updateTriggerDisabled, triggerValue, disabled]);

  const handleTap = React.useCallback<NonNullable<NativeViewProps["bindtap"]>>(
    (...args) => {
      "background only";
      bindtap?.(...args);
      context.selectValue(triggerValue);
    },
    [bindtap, context.selectValue, triggerValue],
  );
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
    mainThreadOnTouchStart: mainThreadBindtouchstart,
    mainThreadOnTouchEnd: mainThreadBindtouchend,
    mainThreadOnTouchCancel: mainThreadBindtouchcancel,
  });
  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      "background only";
      const width = getTabsLayoutWidth(args[0]);
      if (width !== null) context.updateTriggerWidth(triggerValue, width);
    },
    [context.updateTriggerWidth, triggerValue],
  );
  const label =
    typeof children === "string" || typeof children === "number" ? String(children) : undefined;

  return React.useMemo(
    () => ({
      isSelected: selected,
      isVisuallySelected: visuallySelected,
      isDisabled: disabled,
      isPressed: pressed,
      triggerProps: {
        ...pressHandlers,
        bindlayoutchange: handleLayoutChange,
        "accessibility-element": true,
        "accessibility-role-description": "tab",
        "accessibility-label": accessibilityLabel ?? label,
        "accessibility-value": selected ? "selected" : "not selected",
        "accessibility-traits": disabled
          ? ("disabled" as const)
          : selected
            ? ("selected" as const)
            : ("button" as const),
      },
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
    }),
    [
      selected,
      visuallySelected,
      disabled,
      pressed,
      handleLayoutChange,
      accessibilityLabel,
      label,
      pressHandlers.bindtap,
      pressHandlers["main-thread:bindtap"],
      pressHandlers["main-thread:bindtouchstart"],
      pressHandlers["main-thread:bindtouchend"],
      pressHandlers["main-thread:bindtouchcancel"],
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
    ],
  );
}
export type UseTabsTriggerReturn = ReturnType<typeof useTabsTrigger>;
