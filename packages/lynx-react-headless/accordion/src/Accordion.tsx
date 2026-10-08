import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import {
  CollapsibleContent,
  CollapsibleProvider,
  CollapsibleTrigger,
  type CollapsibleContentProps,
  type CollapsibleTriggerProps,
} from "@seed-design/lynx-react-collapsible";
import { useAccordion, type UseAccordionProps } from "./useAccordion.js";
import { AccordionProvider } from "./useAccordionContext.js";
import { AccordionItemProvider } from "./useAccordionItemContext.js";
import { useAccordionItem, type UseAccordionItemProps } from "./useAccordionItem.js";

type ViewProps = IntrinsicElements["view"];

export interface AccordionRootProps
  extends UseAccordionProps,
    Omit<ViewProps, keyof UseAccordionProps> {}

export const AccordionRoot = React.forwardRef<unknown, AccordionRootProps>((props, ref) => {
  const { children, values, defaultValues, onValuesChange, disabled, multiple, ...nativeProps } =
    props;
  const api = useAccordion({ values, defaultValues, onValuesChange, disabled, multiple });

  return (
    <AccordionProvider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </AccordionProvider>
  );
});
AccordionRoot.displayName = "AccordionRoot";

export interface AccordionItemProps
  extends UseAccordionItemProps,
    Omit<ViewProps, keyof UseAccordionItemProps> {}

/**
 * Item의 Collapsible 상태를 `AccordionItemProvider`와 `CollapsibleProvider`로 함께 제공합니다.
 */
export const AccordionItem = React.forwardRef<unknown, AccordionItemProps>((props, ref) => {
  const { children, value, disabled, ...nativeProps } = props;
  const api = useAccordionItem({ value, disabled });

  return (
    <AccordionItemProvider value={api}>
      <CollapsibleProvider value={api}>
        <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
          {children}
        </view>
      </CollapsibleProvider>
    </AccordionItemProvider>
  );
});
AccordionItem.displayName = "AccordionItem";

export interface AccordionHeaderProps extends ViewProps {}

export const AccordionHeader = React.forwardRef<unknown, AccordionHeaderProps>((props, ref) => {
  const { children, "accessibility-heading": accessibilityHeading = true, ...nativeProps } = props;
  return (
    <view
      accessibility-heading={accessibilityHeading}
      {...nativeProps}
      {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
    >
      {children}
    </view>
  );
});
AccordionHeader.displayName = "AccordionHeader";

type AccordionTriggerStateAccessibilityKey = "accessibility-traits" | "accessibility-value";

/**
 * 열림·disabled 상태를 나타내는 `accessibility-value`·`accessibility-traits`는 React
 * `AccordionTrigger`의 `aria-expanded`·`aria-disabled`처럼 컴포넌트 값을 유지한다.
 * 상태 문구는 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 바꾼다.
 */
export interface AccordionTriggerProps
  extends Omit<CollapsibleTriggerProps, AccordionTriggerStateAccessibilityKey> {}

/** Item의 열림 상태를 전환하는 `CollapsibleTrigger`입니다. */
export const AccordionTrigger = React.forwardRef<unknown, AccordionTriggerProps>((props, ref) => {
  // 타입에서 제외했지만 하이픈 속성은 JSX 검사를 통과하므로 런타임에서도 버린다.
  const {
    "accessibility-traits": _accessibilityTraits,
    "accessibility-value": _accessibilityValue,
    ...triggerProps
  } = props as CollapsibleTriggerProps;

  return <CollapsibleTrigger ref={ref} {...triggerProps} />;
});
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends CollapsibleContentProps {}

/** Item이 닫히면 접히는 `CollapsibleContent`입니다. */
export const AccordionContent = CollapsibleContent;
