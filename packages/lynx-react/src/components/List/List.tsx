import * as React from "@lynx-js/react";
import clsx from "clsx";

import { list } from "@seed-design/lynx-css/recipes/list";
import { listHeader, type ListHeaderVariantProps } from "@seed-design/lynx-css/recipes/list-header";
import { listItem, type ListItemVariantProps } from "@seed-design/lynx-css/recipes/list-item";
import {
  CheckboxProvider,
  useCheckbox,
  type UseCheckboxProps,
} from "@seed-design/lynx-react-checkbox";
import {
  RadioGroupItemProvider,
  useRadioGroupItem,
  type UseRadioGroupItemProps,
} from "@seed-design/lynx-react-radio-group";
import { SwitchProvider, useSwitch, type UseSwitchProps } from "@seed-design/lynx-react-switch";

import { ScaleFeedbackContentContext } from "../../contexts";
import { useScaleFeedback, type ScaleFeedbackTargetProps } from "../../hooks/useScaleFeedback";
import { mergeProps } from "../../utils/merge-props";
import { usePressTap } from "../../hooks/usePressTap";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider } from "../Icon/Icon";

type PublicListItemVariantProps = Omit<
  ListItemVariantProps,
  "pressed" | "disabled" | "interactive"
>;

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(listItem);

////////////////////////////////////////////////////////////////////////////////////

export interface ListRootProps extends LynxHostProps<"view"> {}

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

interface ListItemSurfaceProps extends PublicListItemVariantProps, LynxHostProps<"view"> {
  disabled?: boolean;
  pressed?: boolean;
  scaleFeedbackTargetProps?: ScaleFeedbackTargetProps;
}

const ListItemSurface = React.forwardRef<unknown, ListItemSurfaceProps>((props, ref) => {
  const {
    children,
    className,
    style,
    disabled = false,
    pressed = false,
    scaleFeedbackTargetProps,
    ...restProps
  } = props;
  const [variantProps, nativeProps] = listItem.splitVariantProps(restProps);
  const classes = listItem({
    ...variantProps,
    disabled,
    pressed,
    interactive: !!scaleFeedbackTargetProps,
  });

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
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={clsx(classes.root, className)}
          style={style}
        >
          <view className={classes.highlightedOverlay} accessibility-elements-hidden={true} />
          <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
          <view className={classes.layout} {...scaleFeedbackTargetProps}>
            <ScaleFeedbackContentContext.Provider value={!!scaleFeedbackTargetProps}>
              {children}
            </ScaleFeedbackContentContext.Provider>
          </view>
        </view>
      </IconSlotProvider>
    </ClassNamesProvider>
  );
});
ListItemSurface.displayName = "ListItemSurface";

export interface ListItemProps extends PublicListItemVariantProps, LynxHostProps<"view"> {
  disabled?: boolean;
}

export const ListItem = React.forwardRef<unknown, ListItemProps>((props, ref) => {
  return <ListItemSurface ref={ref} {...props} />;
});
ListItem.displayName = "ListItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ListButtonItemProps extends PublicListItemVariantProps, LynxHostProps<"view"> {
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
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    disabled,
    onTap: bindtap,
    mainThreadOnTap,
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  return (
    <ListItemSurface
      ref={ref}
      disabled={disabled}
      pressed={pressed}
      accessibility-element={accessibilityElement}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : "button")}
      scaleFeedbackTargetProps={scaleFeedbackTargetProps}
      {...mergeProps(scaleFeedbackTriggerProps, pressHandlers, restProps)}
    />
  );
});
ListButtonItem.displayName = "ListButtonItem";

////////////////////////////////////////////////////////////////////////////////////

// Checkbox·Radio·Switch 행은 각 control의 Headless hook 결과를 행 root 하나에 연결하고 Provider로
// 내려준다. 행 자체가 control이므로 접근성 요소도 하나이며 값은 control 계약을 따른다.
// suffix의 Checkbox.Control 등은 이 Provider에서 상태를 읽는다.

export interface ListCheckboxItemProps
  extends PublicListItemVariantProps,
    Pick<
      UseCheckboxProps,
      "checked" | "defaultChecked" | "onCheckedChange" | "indeterminate" | "disabled"
    >,
    LynxHostProps<"view"> {}

export const ListCheckboxItem = React.forwardRef<unknown, ListCheckboxItemProps>((props, ref) => {
  const {
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...restProps
  } = props;
  const api = useCheckbox({
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
  });
  // Scale Feedback owns the Main Thread touch handlers and forwards press state to Background.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  return (
    <CheckboxProvider value={api}>
      <ListItemSurface
        ref={ref}
        disabled={disabled}
        pressed={api.pressed}
        scaleFeedbackTargetProps={scaleFeedbackTargetProps}
        {...mergeProps(scaleFeedbackTriggerProps, rootProps, restProps)}
      />
    </CheckboxProvider>
  );
});
ListCheckboxItem.displayName = "ListCheckboxItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ListRadioItemProps
  extends PublicListItemVariantProps,
    Pick<UseRadioGroupItemProps, "value" | "disabled">,
    LynxHostProps<"view"> {}

export const ListRadioItem = React.forwardRef<unknown, ListRadioItemProps>((props, ref) => {
  const {
    value,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...restProps
  } = props;
  const api = useRadioGroupItem({
    value,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
  });
  // Press state follows the Scale Feedback touch handlers, as in RadioGroupItem.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...itemProps } = api.itemProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: api.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  return (
    <RadioGroupItemProvider value={api}>
      <ListItemSurface
        ref={ref}
        disabled={api.disabled}
        pressed={api.pressed}
        scaleFeedbackTargetProps={scaleFeedbackTargetProps}
        {...mergeProps(scaleFeedbackTriggerProps, itemProps, restProps)}
      />
    </RadioGroupItemProvider>
  );
});
ListRadioItem.displayName = "ListRadioItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ListSwitchItemProps
  extends PublicListItemVariantProps,
    Pick<UseSwitchProps, "checked" | "defaultChecked" | "onCheckedChange" | "disabled">,
    LynxHostProps<"view"> {}

export const ListSwitchItem = React.forwardRef<unknown, ListSwitchItemProps>((props, ref) => {
  const {
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...restProps
  } = props;
  const api = useSwitch({
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
  });
  // Scale Feedback owns the Main Thread touch handlers and forwards press state to Background.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });

  return (
    <SwitchProvider value={api}>
      <ListItemSurface
        ref={ref}
        disabled={disabled}
        pressed={api.pressed}
        scaleFeedbackTargetProps={scaleFeedbackTargetProps}
        {...mergeProps(scaleFeedbackTriggerProps, rootProps, restProps)}
      />
    </SwitchProvider>
  );
});
ListSwitchItem.displayName = "ListSwitchItem";

////////////////////////////////////////////////////////////////////////////////////

export interface ListContentProps extends LynxHostProps<"view"> {}

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

export interface ListPrefixProps extends LynxHostProps<"view"> {}

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

export interface ListSuffixProps extends LynxHostProps<"view"> {}

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

export interface ListTitleProps extends LynxHostProps<"text"> {}

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

export interface ListDetailProps extends LynxHostProps<"text"> {}

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

export interface ListHeaderProps extends ListHeaderVariantProps, LynxHostProps<"text"> {}

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
