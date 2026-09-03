import * as React from "@lynx-js/react";
import type { ReactElement } from "@lynx-js/react";
import { clsx } from "cn";

import { accordion, type AccordionVariantProps } from "@seed-design/lynx-css/recipes/accordion";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { InternalIcon } from "../Icon/Icon";

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

interface AccordionContextValue {
  values: string[];
  disabled: boolean;
  variantProps: PublicAccordionVariantProps;
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(consumer: string): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <AccordionRoot/>.`);
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  variantProps: PublicAccordionVariantProps;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);
const AccordionItemPositionContext = React.createContext({ isLast: false });

function useAccordionItemContext(consumer: string): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <AccordionItem/>.`);
  }
  return context;
}

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(accordion);

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionRootProps extends PublicAccordionVariantProps, LynxStyledElementProps {
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

export const AccordionRoot = React.forwardRef<unknown, AccordionRootProps>((props, ref) => {
  const {
    children,
    className,
    values: valuesProp,
    defaultValues = [],
    onValuesChange,
    disabled = false,
    multiple = false,
    ...restProps
  } = props;
  const [variantProps, nativeProps] = accordion.splitVariantProps(restProps);
  const [rawValues, setValues] = useControllableState({
    value: valuesProp,
    defaultValue: defaultValues,
    onChange: onValuesChange,
  });
  const values = multiple ? rawValues : rawValues.slice(0, 1);

  const toggle = React.useCallback(
    (itemValue: string) => {
      if (disabled) return;

      if (!multiple) {
        setValues(values[0] === itemValue ? [] : [itemValue]);
        return;
      }

      setValues(
        values.includes(itemValue)
          ? values.filter((value) => value !== itemValue)
          : [...values, itemValue],
      );
    },
    [disabled, multiple, setValues, values],
  );

  const contextValue = React.useMemo<AccordionContextValue>(
    () => ({ values, disabled, variantProps, toggle }),
    [disabled, toggle, values, variantProps],
  );
  const classes = accordion({ ...variantProps, disabled });
  const items = toArray(children);

  return (
    <AccordionContext.Provider value={contextValue}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.root, className)}
        {...nativeProps}
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

export interface AccordionItemProps extends LynxStyledElementProps {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<unknown, AccordionItemProps>((props, ref) => {
  const { children, className, value, disabled: itemDisabled = false, ...nativeProps } = props;
  const accordionContext = useAccordionContext("AccordionItem");
  const { isLast } = React.useContext(AccordionItemPositionContext);
  const disabled = accordionContext.disabled || itemDisabled;
  const open = accordionContext.values.includes(value);
  const toggle = React.useCallback(() => accordionContext.toggle(value), [accordionContext, value]);
  const classes = accordion({
    ...accordionContext.variantProps,
    open,
    disabled,
    pressed: false,
  });
  const contextValue = React.useMemo<AccordionItemContextValue>(
    () => ({ value, open, disabled, variantProps: accordionContext.variantProps, toggle }),
    [accordionContext.variantProps, disabled, open, toggle, value],
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <ClassNamesProvider value={classes}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classes.item, className)}
          {...nativeProps}
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
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.header, className)}
      accessibility-heading={accessibilityHeading}
      {...nativeProps}
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
    Pick<LynxPressableProps, "bindtap"> {
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
  const context = useAccordionItemContext("AccordionTrigger");
  const handleTap = React.useCallback(
    (event: Parameters<NonNullable<LynxPressableProps["bindtap"]>>[0]) => {
      context.toggle();
      bindtap?.(event);
    },
    [bindtap, context],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled: context.disabled,
    onTap: handleTap,
  });
  const classes = accordion({
    ...context.variantProps,
    open: context.open,
    disabled: context.disabled,
    pressed,
  });

  return (
    <ClassNamesProvider value={classes}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.trigger, className)}
        accessibility-element={accessibilityElement}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-traits={accessibilityTraits ?? (context.disabled ? "disabled" : "button")}
        accessibility-value={
          accessibilityValue ??
          (context.open ? expandedAccessibilityValue : collapsedAccessibilityValue)
        }
        {...pressHandlers}
        {...nativeProps}
      >
        <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
        {children}
      </view>
    </ClassNamesProvider>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface AccordionContentProps extends LynxStyledElementProps, LynxAccessibilityProps {}

type ContentLayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;

function getContentLayoutHeight(event: Parameters<ContentLayoutChangeHandler>[0]): number | null {
  const eventWithHeight = event as Parameters<ContentLayoutChangeHandler>[0] & { height?: number };
  const height = event.detail?.height ?? event.params?.height ?? eventWithHeight.height;

  if (typeof height !== "number" || !Number.isFinite(height)) return null;
  return Math.max(0, height);
}

export const AccordionContent = React.forwardRef<unknown, AccordionContentProps>((props, ref) => {
  const {
    children,
    className,
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden = false,
    ...nativeProps
  } = props;
  const context = useAccordionItemContext("AccordionContent");
  const classes = useClassNames();
  const [contentHeight, setContentHeight] = React.useState(0);
  const handleContentLayoutChange = React.useCallback<ContentLayoutChangeHandler>((event) => {
    const height = getContentLayoutHeight(event);
    if (height !== null) setContentHeight((current) => (current === height ? current : height));
  }, []);

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.content, className)}
      style={{ ...style, height: context.open ? `${contentHeight}px` : "0px" }}
      accessibility-elements-hidden={!context.open || accessibilityElementsHidden}
      {...nativeProps}
    >
      <view className={classes.contentInner} bindlayoutchange={handleContentLayoutChange}>
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
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.body, className)}
      {...nativeProps}
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
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.title, className)}
      {...nativeProps}
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
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.description, className)}
        {...nativeProps}
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
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.prefix, className)}
      {...nativeProps}
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
    const context = useAccordionItemContext("AccordionSuffixIcon");
    const classes = useClassNames();
    const mergedClassName = clsx(classes.suffixIcon, className);

    if (icon) {
      return (
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          accessibility-elements-hidden={true}
          {...nativeProps}
        >
          <InternalIcon
            icon={icon}
            className={mergedClassName}
            style={style}
            deps={[context.open, context.disabled]}
          />
        </view>
      );
    }

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={mergedClassName}
        style={style}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {children}
      </view>
    );
  },
);
AccordionSuffixIcon.displayName = "AccordionSuffixIcon";
