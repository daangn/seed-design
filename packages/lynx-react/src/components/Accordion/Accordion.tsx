import * as React from "@lynx-js/react";
import type { ReactElement } from "@lynx-js/react";
import clsx from "clsx";

import {
  AccordionContext,
  AccordionItemContext,
  useAccordion,
  useAccordionContent,
  useAccordionContext,
  useAccordionItem,
  useAccordionItemContext,
  useAccordionTrigger,
  type UseAccordionProps,
  type UseAccordionReturn,
  type UseAccordionItemProps,
  type UseAccordionItemReturn,
  type UseAccordionTriggerProps,
} from "@seed-design/lynx-react-accordion";
import { accordion, type AccordionVariantProps } from "@seed-design/lynx-css/recipes/accordion";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { InternalIcon } from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `asChild`: Lynx에 Slot 기반 polymorphic 렌더링이 없음
 * - `headingLevel`: Lynx 접근성 heading은 level을 받지 않음
 * - DOM ARIA와 키보드 탐색: Lynx native 접근성 속성과 tap 상호작용으로 대체
 * - `size="responsive"`: Lynx preset은 viewport media query를 지원하지 않음
 */

type PublicAccordionVariantProps = Omit<AccordionVariantProps, "open" | "pressed" | "disabled">;

interface StyledAccordionContextValue extends UseAccordionReturn {
  variantProps: PublicAccordionVariantProps;
}

interface StyledAccordionItemContextValue extends UseAccordionItemReturn {
  variantProps: PublicAccordionVariantProps;
}

const AccordionItemPositionContext = React.createContext({ isLast: false });

function useStyledAccordionItemContext(consumer: string): StyledAccordionItemContextValue {
  const context = useAccordionItemContext(consumer);
  if (!("variantProps" in context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <AccordionItem/>.`);
  }
  return context as StyledAccordionItemContextValue;
}

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(accordion);

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionRootProps
  extends UseAccordionProps,
    PublicAccordionVariantProps,
    LynxStyledElementProps {}

export const AccordionRoot = React.forwardRef<unknown, AccordionRootProps>((props, ref) => {
  const {
    children,
    className,
    values,
    defaultValues = [],
    onValuesChange,
    disabled = false,
    multiple = false,
    ...restProps
  } = props;
  const [variantProps, nativeProps] = accordion.splitVariantProps(restProps);
  const api = useAccordion({ values, defaultValues, onValuesChange, disabled, multiple });
  const contextValue = React.useMemo<StyledAccordionContextValue>(
    () => ({ ...api, variantProps }),
    [api, variantProps],
  );
  const classes = accordion({ ...variantProps, disabled });
  const items = toArray(children);

  return (
    <AccordionContext.Provider value={contextValue}>
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes.root, className)}
      >
        {items.map((item, index) => (
          <AccordionItemPositionContext.Provider
            key={React.isValidElement(item) ? (item.key ?? index) : index}
            value={{ isLast: index === items.length - 1 }}
          >
            {item}
          </AccordionItemPositionContext.Provider>
        ))}
      </view>
    </AccordionContext.Provider>
  );
});
AccordionRoot.displayName = "AccordionRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps extends UseAccordionItemProps, LynxStyledElementProps {}

export const AccordionItem = React.forwardRef<unknown, AccordionItemProps>((props, ref) => {
  const { children, className, value, disabled: itemDisabled, ...nativeProps } = props;
  const api = useAccordionItem({ value, disabled: itemDisabled });
  const rootContext = useAccordionContext("AccordionItem");
  if (!("variantProps" in rootContext)) {
    throw new Error("<AccordionItem/> must be rendered inside a styled <AccordionRoot/>.");
  }
  const variantProps = rootContext.variantProps as PublicAccordionVariantProps;
  const contextValue = React.useMemo<StyledAccordionItemContextValue>(
    () => ({ ...api, variantProps }),
    [api, variantProps],
  );
  const { isLast } = React.useContext(AccordionItemPositionContext);
  const { open, disabled } = api;
  const classes = accordion({
    ...variantProps,
    open,
    disabled,
    pressed: false,
  });

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <ClassNamesProvider value={classes}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={clsx(classes.item, className)}
        >
          {children}
          {!isLast ? (
            <view className={classes.divider} accessibility-elements-hidden={true} />
          ) : null}
        </view>
      </ClassNamesProvider>
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const AccordionHeader = React.forwardRef<unknown, AccordionHeaderProps>((props, ref) => {
  const {
    children,
    className,
    "accessibility-heading": accessibilityHeading = true,
    ...nativeProps
  } = props;
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.header, className)}
      accessibility-heading={accessibilityHeading}
    >
      {children}
    </view>
  );
});
AccordionHeader.displayName = "AccordionHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    Pick<UseAccordionTriggerProps, "bindtap"> {
  expandedAccessibilityValue?: string;
  collapsedAccessibilityValue?: string;
}

export const AccordionTrigger = React.forwardRef<unknown, AccordionTriggerProps>((props, ref) => {
  const {
    children,
    className,
    bindtap,
    expandedAccessibilityValue = "펼쳐짐",
    collapsedAccessibilityValue = "접힘",
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = props;
  const { open, disabled, pressed, triggerProps } = useAccordionTrigger({
    bindtap,
    expandedAccessibilityValue,
    collapsedAccessibilityValue,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });
  const {
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "accessibility-element": triggerAccessibilityElement,
    "accessibility-role-description": triggerAccessibilityRoleDescription,
    "accessibility-traits": triggerAccessibilityTraits,
    "accessibility-value": triggerAccessibilityValue,
    ...pressHandlers
  } = triggerProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    // The headless hook exposes native event types; its press handlers also accept zero arguments.
    onTouchStart: bindtouchstart as () => void,
    onTouchEnd: bindtouchend as () => void,
    onTouchCancel: bindtouchcancel as () => void,
  });
  const { variantProps } = useStyledAccordionItemContext("AccordionTrigger");
  const classes = accordion({
    ...variantProps,
    open,
    disabled,
    pressed,
  });

  return (
    <ClassNamesProvider value={classes}>
      <view
        {...mergeProps(
          ref ? { ref: ref as LynxViewRef } : {},
          pressHandlers,
          scaleFeedbackTriggerProps,
          nativeProps,
        )}
        className={clsx(classes.trigger, className)}
        accessibility-element={triggerAccessibilityElement}
        accessibility-role-description={triggerAccessibilityRoleDescription}
        accessibility-traits={triggerAccessibilityTraits}
        accessibility-value={triggerAccessibilityValue}
      >
        <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
        <view className={classes.triggerContent} {...scaleFeedbackTargetProps}>
          {children}
        </view>
      </view>
    </ClassNamesProvider>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const AccordionContent = React.forwardRef<unknown, AccordionContentProps>((props, ref) => {
  const {
    children,
    className,
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden,
    ...nativeProps
  } = props;
  const { contentProps, contentInnerProps } = useAccordionContent({
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden,
  });
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.content, className)}
      {...contentProps}
    >
      <view className={classes.contentInner} {...contentInnerProps}>
        {children}
      </view>
    </view>
  );
});
AccordionContent.displayName = "AccordionContent";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionBodyProps extends LynxStyledElementProps {}

export const AccordionBody = React.forwardRef<unknown, AccordionBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.body, className)}
    >
      {children}
    </view>
  );
});
AccordionBody.displayName = "AccordionBody";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTitleProps extends LynxStyledElementProps {}

export const AccordionTitle = React.forwardRef<unknown, AccordionTitleProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classes.title, className)}
    >
      {children}
    </text>
  );
});
AccordionTitle.displayName = "AccordionTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionDescriptionProps extends LynxStyledElementProps {}

export const AccordionDescription = React.forwardRef<unknown, AccordionDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useClassNames();

    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classes.description, className)}
      >
        {children}
      </text>
    );
  },
);
AccordionDescription.displayName = "AccordionDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionPrefixProps extends LynxStyledElementProps {}

export const AccordionPrefix = React.forwardRef<unknown, AccordionPrefixProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.prefix, className)}
    >
      {children}
    </view>
  );
});
AccordionPrefix.displayName = "AccordionPrefix";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionSuffixIconProps extends LynxStyledElementProps {
  icon?: ReactElement<LynxIconElementProps>;
}

export const AccordionSuffixIcon = React.forwardRef<unknown, AccordionSuffixIconProps>(
  (props, ref) => {
    const { icon, children, className, style, ...nativeProps } = props;
    const { open, disabled } = useAccordionItemContext("AccordionSuffixIcon");
    const classes = useClassNames();
    const mergedClassName = clsx(classes.suffixIcon, className);

    if (icon) {
      return (
        <view
          {...mergeProps(
            { "accessibility-elements-hidden": true },
            ref ? { ref: ref as LynxViewRef } : {},
            nativeProps,
          )}
        >
          <InternalIcon
            icon={icon}
            className={mergedClassName}
            style={style}
            deps={[open, disabled]}
          />
        </view>
      );
    }

    return (
      <view
        {...mergeProps(
          { "accessibility-elements-hidden": true },
          ref ? { ref: ref as LynxViewRef } : {},
          nativeProps,
        )}
        className={mergedClassName}
        style={style}
      >
        {children}
      </view>
    );
  },
);
AccordionSuffixIcon.displayName = "AccordionSuffixIcon";
