import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useAccordion, type UseAccordionProps } from "./useAccordion.js";
import { useAccordionContent } from "./useAccordionContent.js";
import { AccordionContext, AccordionItemContext } from "./useAccordionContext.js";
import { useAccordionItem, type UseAccordionItemProps } from "./useAccordionItem.js";
import { useAccordionTrigger, type UseAccordionTriggerProps } from "./useAccordionTrigger.js";

type ViewProps = IntrinsicElements["view"];

export interface AccordionRootProps extends UseAccordionProps, ViewProps {}

export const AccordionRoot = React.forwardRef<unknown, AccordionRootProps>((props, ref) => {
  const { children, values, defaultValues, onValuesChange, disabled, multiple, ...nativeProps } =
    props;
  const api = useAccordion({ values, defaultValues, onValuesChange, disabled, multiple });

  return (
    <AccordionContext.Provider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </AccordionContext.Provider>
  );
});
AccordionRoot.displayName = "AccordionRoot";

export interface AccordionItemProps extends UseAccordionItemProps, ViewProps {}

export const AccordionItem = React.forwardRef<unknown, AccordionItemProps>((props, ref) => {
  const { children, value, disabled, ...nativeProps } = props;
  const api = useAccordionItem({ value, disabled });

  return (
    <AccordionItemContext.Provider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

export interface AccordionHeaderProps extends ViewProps {}

export const AccordionHeader = React.forwardRef<unknown, AccordionHeaderProps>((props, ref) => {
  const { children, "accessibility-heading": accessibilityHeading = true, ...nativeProps } = props;
  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...nativeProps}
      accessibility-heading={accessibilityHeading}
    >
      {children}
    </view>
  );
});
AccordionHeader.displayName = "AccordionHeader";

export interface AccordionTriggerProps extends ViewProps, UseAccordionTriggerProps {}

export const AccordionTrigger = React.forwardRef<unknown, AccordionTriggerProps>((props, ref) => {
  const {
    children,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    expandedAccessibilityValue,
    collapsedAccessibilityValue,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = props;
  const { disabled, triggerProps } = useAccordionTrigger({
    bindtap,
    expandedAccessibilityValue,
    collapsedAccessibilityValue,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...nativeProps}
      {...triggerProps}
      main-thread:bindtap={disabled ? undefined : mainThreadBindtap}
      bindtouchstart={(event) => {
        bindtouchstart?.(event);
        triggerProps.bindtouchstart(event);
      }}
      bindtouchend={(event) => {
        bindtouchend?.(event);
        triggerProps.bindtouchend(event);
      }}
      bindtouchcancel={(event) => {
        bindtouchcancel?.(event);
        triggerProps.bindtouchcancel(event);
      }}
    >
      {children}
    </view>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends ViewProps {}

export const AccordionContent = React.forwardRef<unknown, AccordionContentProps>((props, ref) => {
  const {
    children,
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden,
    ...nativeProps
  } = props;
  const { contentProps, contentInnerProps } = useAccordionContent({
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden,
  });

  return (
    <view
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
      {...nativeProps}
      {...contentProps}
      style={
        typeof contentProps.style === "string"
          ? `${contentProps.style};overflow:hidden`
          : { ...contentProps.style, overflow: "hidden" }
      }
    >
      <view {...contentInnerProps} style={{ flexShrink: 0 }}>
        {children}
      </view>
    </view>
  );
});
AccordionContent.displayName = "AccordionContent";
