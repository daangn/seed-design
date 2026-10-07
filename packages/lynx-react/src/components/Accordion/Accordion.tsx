import * as React from "@lynx-js/react";
import type { ReactElement } from "@lynx-js/react";
import clsx from "clsx";

import {
  AccordionItemProvider,
  AccordionProvider,
  useAccordion,
  useAccordionContext,
  useAccordionItem,
  useAccordionItemContext,
  type UseAccordionProps,
  type UseAccordionReturn,
  type UseAccordionItemProps,
  type UseAccordionItemReturn,
} from "@seed-design/lynx-react-accordion";
import {
  CollapsibleProvider,
  useCollapsibleContent,
  useCollapsibleTrigger,
  type UseCollapsibleTriggerProps,
} from "@seed-design/lynx-react-collapsible";
import { accordion, type AccordionVariantProps } from "@seed-design/lynx-css/recipes/accordion";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxIconElementProps, LynxTextRef, LynxViewRef } from "../../types";
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
  const context = useAccordionItemContext();
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
    Omit<LynxHostProps<"view">, keyof UseAccordionProps | keyof PublicAccordionVariantProps> {}

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
    <AccordionProvider value={contextValue}>
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
    </AccordionProvider>
  );
});
AccordionRoot.displayName = "AccordionRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionItemProps
  extends UseAccordionItemProps,
    Omit<LynxHostProps<"view">, keyof UseAccordionItemProps> {}

export const AccordionItem = React.forwardRef<unknown, AccordionItemProps>((props, ref) => {
  const { children, className, value, disabled: itemDisabled, ...nativeProps } = props;
  const api = useAccordionItem({ value, disabled: itemDisabled });
  const rootContext = useAccordionContext();
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
    <AccordionItemProvider value={contextValue}>
      <CollapsibleProvider value={contextValue}>
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
      </CollapsibleProvider>
    </AccordionItemProvider>
  );
});
AccordionItem.displayName = "AccordionItem";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionHeaderProps extends LynxHostProps<"view"> {}

export const AccordionHeader = React.forwardRef<unknown, AccordionHeaderProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(
        { "accessibility-heading": true },
        nativeProps,
        ref ? { ref: ref as LynxViewRef } : {},
      )}
      className={clsx(classes.header, className)}
    >
      {children}
    </view>
  );
});
AccordionHeader.displayName = "AccordionHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionTriggerProps
  extends Omit<LynxHostProps<"view">, "bindtap">,
    Pick<UseCollapsibleTriggerProps, "bindtap"> {
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
    ...nativeProps
  } = props;
  const { open, disabled, pressed, triggerProps } = useCollapsibleTrigger({
    bindtap,
    expandedAccessibilityValue,
    collapsedAccessibilityValue,
    "accessibility-element": nativeProps["accessibility-element"],
    "accessibility-role-description": nativeProps["accessibility-role-description"],
    "accessibility-traits": nativeProps["accessibility-traits"],
    "accessibility-value": nativeProps["accessibility-value"],
  });
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = triggerProps;
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
          pressHandlers,
          scaleFeedbackTriggerProps,
          nativeProps,
          ref ? { ref: ref as LynxViewRef } : {},
        )}
        className={clsx(classes.trigger, className)}
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

export interface AccordionContentProps extends LynxHostProps<"view"> {}

export const AccordionContent = React.forwardRef<unknown, AccordionContentProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { contentProps, contentInnerProps } = useCollapsibleContent();
  const classes = useClassNames();

  return (
    <view
      {...mergeProps(contentProps, nativeProps, ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.content, className)}
    >
      <view className={classes.contentInner} {...contentInnerProps}>
        {children}
      </view>
    </view>
  );
});
AccordionContent.displayName = "AccordionContent";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionBodyProps extends LynxHostProps<"view"> {}

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

export interface AccordionTitleProps extends LynxHostProps<"text"> {}

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

export interface AccordionDescriptionProps extends LynxHostProps<"text"> {}

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

export interface AccordionPrefixProps extends LynxHostProps<"view"> {}

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

export interface AccordionSuffixIconProps extends LynxHostProps<"view"> {
  icon?: ReactElement<LynxIconElementProps>;
}

export const AccordionSuffixIcon = React.forwardRef<unknown, AccordionSuffixIconProps>(
  (props, ref) => {
    const { icon, children, className, style, ...nativeProps } = props;
    const { open, disabled } = useAccordionItemContext();
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
