import * as React from "@lynx-js/react";
import clsx from "clsx";

import { list } from "@seed-design/lynx-css/recipes/list";
import { listHeader, type ListHeaderVariantProps } from "@seed-design/lynx-css/recipes/list-header";
import { listItem, type ListItemVariantProps } from "@seed-design/lynx-css/recipes/list-item";

import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxTouchProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { CheckboxRoot, type CheckboxRootProps, useCheckboxContext } from "../Checkbox/Checkbox";
import { IconSlotProvider } from "../Icon/Icon";
import {
  RadioGroupItem,
  type RadioGroupItemProps,
  useRadioGroupItemContext,
} from "../RadioGroup/RadioGroup";
import { SwitchRoot, type SwitchRootProps, useSwitchContext } from "../Switch/Switch";

type PublicListItemVariantProps = Omit<ListItemVariantProps, "pressed" | "disabled">;

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(listItem);

function splitAccessibilityProps<T extends LynxAccessibilityProps>(props: T) {
  const {
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-element": accessibilityElement,
    "accessibility-value": accessibilityValue,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-elements-hidden": accessibilityElementsHidden,
    "accessibility-heading": accessibilityHeading,
    "accessibility-actions": accessibilityActions,
    "accessibility-exclusive-focus": accessibilityExclusiveFocus,
    "ios-platform-accessibility-id": iosPlatformAccessibilityId,
    ...restProps
  } = props;

  return [
    {
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      "accessibility-element": accessibilityElement,
      "accessibility-value": accessibilityValue,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-elements-hidden": accessibilityElementsHidden,
      "accessibility-heading": accessibilityHeading,
      ...(accessibilityActions === undefined
        ? {}
        : { "accessibility-actions": accessibilityActions }),
      "accessibility-exclusive-focus": accessibilityExclusiveFocus,
      "ios-platform-accessibility-id": iosPlatformAccessibilityId,
    },
    restProps,
  ] as const;
}

////////////////////////////////////////////////////////////////////////////////////

export interface ListRootProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const ListRoot = React.forwardRef<unknown, ListRootProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(list(), className)}
      style={style}
    >
      {children}
    </view>
  );
});
ListRoot.displayName = "ListRoot";

////////////////////////////////////////////////////////////////////////////////////

interface ListItemSurfaceProps
  extends PublicListItemVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxTouchProps {
  disabled?: boolean;
  pressed?: boolean;
}

const ListItemSurface = React.forwardRef<unknown, ListItemSurfaceProps>((props, ref) => {
  const { children, className, style, disabled = false, pressed = false, ...restProps } = props;
  const [variantProps, nativeProps] = listItem.splitVariantProps(restProps);
  const classes = listItem({ ...variantProps, disabled, pressed });

  return (
    <ClassNamesProvider value={classes}>
      <IconSlotProvider
        value={{
          classNames: {
            prefixIcon: classes.prefixIcon,
            suffixIcon: classes.suffixIcon,
          },
          deps: [disabled, pressed, variantProps.highlighted],
        }}
      >
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          className={clsx(classes.root, className)}
          style={style}
        >
          <view className={classes.highlightedOverlay} accessibility-elements-hidden={true} />
          <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
          <view className={classes.layout}>{children}</view>
        </view>
      </IconSlotProvider>
    </ClassNamesProvider>
  );
});
ListItemSurface.displayName = "ListItemSurface";

export interface ListItemProps
  extends PublicListItemVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const ListItem = React.forwardRef<unknown, ListItemProps>((props, ref) => {
  return <ListItemSurface ref={ref} {...props} />;
});
ListItem.displayName = "ListItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ListButtonItemProps
  extends PublicListItemVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxPressableProps {
  disabled?: boolean;
}

export const ListButtonItem = React.forwardRef<unknown, ListButtonItemProps>((props, ref) => {
  const {
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    ...restProps
  } = props;
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: bindtap,
    mainThreadOnTap,
  });

  return (
    <ListItemSurface
      ref={ref}
      disabled={disabled}
      pressed={pressed}
      accessibility-element={accessibilityElement}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : "button")}
      {...pressHandlers}
      {...restProps}
    />
  );
});
ListButtonItem.displayName = "ListButtonItem";

////////////////////////////////////////////////////////////////////////////////////

interface ListCheckboxItemSurfaceProps
  extends PublicListItemVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

function ListCheckboxItemSurface(props: ListCheckboxItemSurfaceProps) {
  const context = useCheckboxContext("ListCheckboxItem");

  return (
    <ListItemSurface
      {...props}
      disabled={context.disabled}
      pressed={context.pressed}
      accessibility-element={props["accessibility-element"] ?? true}
      accessibility-role-description={props["accessibility-role-description"] ?? "checkbox"}
      accessibility-value={
        props["accessibility-value"] ?? (context.checked ? "선택됨" : "선택 안 됨")
      }
      accessibility-traits={
        props["accessibility-traits"] ?? (context.disabled ? "disabled" : "button")
      }
    />
  );
}

export interface ListCheckboxItemProps
  extends PublicListItemVariantProps,
    Omit<CheckboxRootProps, "children" | "className" | "style" | "disabled">,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const ListCheckboxItem = React.forwardRef<unknown, ListCheckboxItemProps>((props, ref) => {
  const { children, className, style, disabled = false, ...restProps } = props;
  const [variantProps, remainingProps] = listItem.splitVariantProps(restProps);
  const [accessibilityProps, checkboxProps] = splitAccessibilityProps(remainingProps);
  const interactionRootClassName = listItem().interactionRoot;

  return (
    <CheckboxRoot
      ref={ref}
      {...checkboxProps}
      disabled={disabled}
      className={interactionRootClassName}
    >
      <ListCheckboxItemSurface
        {...variantProps}
        className={className}
        style={style}
        {...accessibilityProps}
      >
        {children}
      </ListCheckboxItemSurface>
    </CheckboxRoot>
  );
});
ListCheckboxItem.displayName = "ListCheckboxItem";

////////////////////////////////////////////////////////////////////////////////////

interface ListRadioItemSurfaceProps
  extends PublicListItemVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

function ListRadioItemSurface(props: ListRadioItemSurfaceProps) {
  const context = useRadioGroupItemContext("ListRadioItem");

  return (
    <ListItemSurface
      {...props}
      disabled={context.disabled}
      pressed={context.pressed}
      accessibility-element={props["accessibility-element"] ?? true}
      accessibility-role-description={props["accessibility-role-description"] ?? "radio"}
      accessibility-value={
        props["accessibility-value"] ?? (context.checked ? "선택됨" : "선택 안 됨")
      }
      accessibility-traits={
        props["accessibility-traits"] ?? (context.disabled ? "disabled" : "button")
      }
    />
  );
}

export interface ListRadioItemProps
  extends PublicListItemVariantProps,
    Omit<RadioGroupItemProps, "children" | "className" | "style" | "disabled">,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const ListRadioItem = React.forwardRef<unknown, ListRadioItemProps>((props, ref) => {
  const { children, className, style, disabled = false, value, ...restProps } = props;
  const [variantProps, remainingProps] = listItem.splitVariantProps(restProps);
  const [accessibilityProps] = splitAccessibilityProps(remainingProps);
  const interactionRootClassName = listItem().interactionRoot;

  return (
    <RadioGroupItem
      ref={ref}
      value={value}
      disabled={disabled}
      className={interactionRootClassName}
    >
      <ListRadioItemSurface
        {...variantProps}
        className={className}
        style={style}
        {...accessibilityProps}
      >
        {children}
      </ListRadioItemSurface>
    </RadioGroupItem>
  );
});
ListRadioItem.displayName = "ListRadioItem";

////////////////////////////////////////////////////////////////////////////////////

interface ListSwitchItemSurfaceProps
  extends PublicListItemVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

function ListSwitchItemSurface(props: ListSwitchItemSurfaceProps) {
  const context = useSwitchContext("ListSwitchItem");

  return (
    <ListItemSurface
      {...props}
      disabled={context.disabled}
      pressed={context.pressed}
      accessibility-element={props["accessibility-element"] ?? true}
      accessibility-role-description={props["accessibility-role-description"] ?? "switch"}
      accessibility-value={props["accessibility-value"] ?? (context.checked ? "켜짐" : "꺼짐")}
      accessibility-traits={
        props["accessibility-traits"] ?? (context.disabled ? "disabled" : "button")
      }
    />
  );
}

export interface ListSwitchItemProps
  extends PublicListItemVariantProps,
    Omit<SwitchRootProps, "children" | "className" | "style" | "disabled">,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const ListSwitchItem = React.forwardRef<unknown, ListSwitchItemProps>((props, ref) => {
  const { children, className, style, disabled = false, ...restProps } = props;
  const [variantProps, remainingProps] = listItem.splitVariantProps(restProps);
  const [accessibilityProps, switchProps] = splitAccessibilityProps(remainingProps);
  const interactionRootClassName = listItem().interactionRoot;

  return (
    <SwitchRoot ref={ref} {...switchProps} disabled={disabled} className={interactionRootClassName}>
      <ListSwitchItemSurface
        {...variantProps}
        className={className}
        style={style}
        {...accessibilityProps}
      >
        {children}
      </ListSwitchItemSurface>
    </SwitchRoot>
  );
});
ListSwitchItem.displayName = "ListSwitchItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ListContentProps extends LynxStyledElementProps {}

export const ListContent = React.forwardRef<unknown, ListContentProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classes.content, className)}
      style={style}
    >
      {children}
    </view>
  );
});
ListContent.displayName = "ListContent";

export interface ListPrefixProps extends LynxStyledElementProps {}

export const ListPrefix = React.forwardRef<unknown, ListPrefixProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classes.prefix, className)}
      style={style}
    >
      {children}
    </view>
  );
});
ListPrefix.displayName = "ListPrefix";

export interface ListSuffixProps extends LynxStyledElementProps {}

export const ListSuffix = React.forwardRef<unknown, ListSuffixProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classes.suffix, className)}
      style={style}
    >
      {children}
    </view>
  );
});
ListSuffix.displayName = "ListSuffix";

export interface ListTitleProps extends LynxStyledElementProps {}

export const ListTitle = React.forwardRef<unknown, ListTitleProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classes.title, className)}
      style={style}
    >
      {children}
    </text>
  );
});
ListTitle.displayName = "ListTitle";

export interface ListDetailProps extends LynxStyledElementProps {}

export const ListDetail = React.forwardRef<unknown, ListDetailProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classes = useClassNames();

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classes.detail, className)}
      style={style}
    >
      {children}
    </text>
  );
});
ListDetail.displayName = "ListDetail";

////////////////////////////////////////////////////////////////////////////////////

export interface ListHeaderProps
  extends ListHeaderVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {}

export const ListHeader = React.forwardRef<unknown, ListHeaderProps>((props, ref) => {
  const [variantProps, restProps] = listHeader.splitVariantProps(props);
  const { children, className, style, ...nativeProps } = restProps;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(listHeader(variantProps), className)}
      style={style}
    >
      {children}
    </text>
  );
});
ListHeader.displayName = "ListHeader";
