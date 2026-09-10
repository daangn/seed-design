import * as React from "@lynx-js/react";
import clsx from "clsx";

import {
  floatingActionButton,
  type FloatingActionButtonVariantProps,
} from "@seed-design/lynx-css/recipes/floating-action-button";

import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxTouchProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(floatingActionButton);

type FloatingActionButtonPublicVariantProps = Omit<FloatingActionButtonVariantProps, "pressed">;

interface FloatingActionButtonRootViewProps
  extends FloatingActionButtonVariantProps,
    LynxStyledElementProps,
    LynxTouchProps,
    LynxAccessibilityProps {
  flatten?: false;
}

const FloatingActionButtonRootView = React.forwardRef<unknown, FloatingActionButtonRootViewProps>(
  (props, ref) => {
    const [variantProps, otherProps] = floatingActionButton.splitVariantProps(props);
    const { children, className, ...nativeProps } = otherProps;
    const classNames = floatingActionButton(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <PropsProvider value={variantProps}>
          <view
            {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
            className={clsx(classNames.root, className)}
          >
            {children}
          </view>
        </PropsProvider>
      </ClassNamesProvider>
    );
  },
);
FloatingActionButtonRootView.displayName = "FloatingActionButtonRootView";

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * Web DOM button props, `asChild`, `aria-*`, and `onClick` are not supported.
 * Use native `bindtap` / `main-thread:bindtap` and `accessibility-*` props instead.
 */
export interface FloatingActionButtonRootProps
  extends FloatingActionButtonPublicVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const FloatingActionButtonRoot = React.forwardRef<unknown, FloatingActionButtonRootProps>(
  (props, ref) => {
    const {
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      disabled = false,
      "accessibility-element": accessibilityElement = true,
      "accessibility-role-description": accessibilityRoleDescription = "button",
      "accessibility-traits": accessibilityTraits,
      ...otherProps
    } = props;
    const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressTapHandlers } =
      usePressTap({
        disabled,
        onTap: bindtap,
        mainThreadOnTap: mainThreadBindtap,
      });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });

    return (
      <FloatingActionButtonRootView
        {...mergeProps(
          { ref },
          disabled ? {} : scaleFeedbackTargetProps,
          disabled ? {} : scaleFeedbackTriggerProps,
          disabled ? {} : pressTapHandlers,
          otherProps,
        )}
        disabled={disabled}
        pressed={pressed}
        accessibility-element={accessibilityElement}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-traits={accessibilityTraits ?? (disabled ? "disabled" : undefined)}
        flatten={false}
      />
    );
  },
);
FloatingActionButtonRoot.displayName = "FloatingActionButtonRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface FloatingActionButtonIconProps extends Omit<InternalIconProps, "deps"> {}

export const FloatingActionButtonIcon = React.forwardRef<unknown, FloatingActionButtonIconProps>(
  (props, ref) => {
    const { className, ...iconProps } = props;
    const classNames = useClassNames();

    return (
      <InternalIcon
        {...mergeProps(ref ? { ref } : {}, iconProps)}
        className={clsx(classNames.icon, className)}
        deps={[classNames.icon]}
        accessibility-elements-hidden={true}
      />
    );
  },
);
FloatingActionButtonIcon.displayName = "FloatingActionButtonIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface FloatingActionButtonLabelProps extends LynxStyledElementProps {}

export const FloatingActionButtonLabel = React.forwardRef<unknown, FloatingActionButtonLabelProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classNames = useClassNames();
    const variantProps = useProps();

    if (variantProps?.extended === false) {
      return null;
    }

    return (
      <text
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classNames.label, className)}
        accessibility-elements-hidden={true}
      >
        {children}
      </text>
    );
  },
);
FloatingActionButtonLabel.displayName = "FloatingActionButtonLabel";
