import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useCollapsible, type UseCollapsibleProps } from "./useCollapsible.js";
import { useCollapsibleContent } from "./useCollapsibleContent.js";
import { CollapsibleProvider } from "./useCollapsibleContext.js";
import { useCollapsibleTrigger, type UseCollapsibleTriggerProps } from "./useCollapsibleTrigger.js";

type ViewProps = IntrinsicElements["view"];

export interface CollapsibleRootProps
  extends UseCollapsibleProps,
    Omit<ViewProps, keyof UseCollapsibleProps> {}

/**
 * 스타일 없이 열림 상태와 내용 높이 측정을 하위 요소에 제공하는 native `<view>`입니다.
 * 하위 요소는 `useCollapsibleContext`로 `open`·`disabled`·`toggle`을 읽습니다.
 */
export const CollapsibleRoot = React.forwardRef<unknown, CollapsibleRootProps>((props, ref) => {
  const { children, open, defaultOpen, onOpenChange, disabled, ...nativeProps } = props;
  const api = useCollapsible({ open, defaultOpen, onOpenChange, disabled });

  return (
    <CollapsibleProvider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </CollapsibleProvider>
  );
});
CollapsibleRoot.displayName = "CollapsibleRoot";

export interface CollapsibleTriggerProps
  extends UseCollapsibleTriggerProps,
    Omit<ViewProps, keyof UseCollapsibleTriggerProps> {}

/**
 * tap으로 열림 상태를 전환하는 native `<view>`입니다. press와 펼침 접근성 값을 연결합니다.
 */
export const CollapsibleTrigger = React.forwardRef<unknown, CollapsibleTriggerProps>(
  (props, ref) => {
    const {
      children,
      bindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      expandedAccessibilityValue,
      collapsedAccessibilityValue,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
      ...nativeProps
    } = props;
    const { triggerProps } = useCollapsibleTrigger({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      expandedAccessibilityValue,
      collapsedAccessibilityValue,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
    });

    return (
      <view
        {...triggerProps}
        {...nativeProps}
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
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
  },
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps extends ViewProps {}

/**
 * 닫히면 높이를 0으로 접고 접근성 트리에서 숨기는 native `<view>`입니다.
 * 안쪽 측정용 `<view>`가 children을 감쌉니다.
 */
export const CollapsibleContent = React.forwardRef<unknown, CollapsibleContentProps>(
  (props, ref) => {
    const {
      children,
      style,
      "accessibility-elements-hidden": accessibilityElementsHidden,
      ...nativeProps
    } = props;
    const { contentProps, contentInnerProps } = useCollapsibleContent({
      style,
      "accessibility-elements-hidden": accessibilityElementsHidden,
    });

    return (
      <view {...contentProps} {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
        <view {...contentInnerProps} style={{ flexShrink: 0 }}>
          {children}
        </view>
      </view>
    );
  },
);
CollapsibleContent.displayName = "CollapsibleContent";
