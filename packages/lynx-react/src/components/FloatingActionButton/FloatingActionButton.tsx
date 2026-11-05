import * as React from "@lynx-js/react";
import clsx from "clsx";

import {
  floatingActionButton,
  type FloatingActionButtonVariantProps,
} from "@seed-design/lynx-css/recipes/floating-action-button";
import { useActionButton, type UseActionButtonProps } from "@seed-design/lynx-react-action-button";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxHostProps,
  LynxPressableProps,
  LynxTextProps,
  LynxTextRef,
  LynxViewRef,
  LynxViewProps,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";

const { ClassNamesProvider, useClassNames, withContext } =
  createSlotRecipeContext(floatingActionButton);

type FloatingActionButtonPublicVariantProps = Omit<
  FloatingActionButtonVariantProps,
  "pressed" | "transitionEnabled"
>;

const LabelWidthContext = React.createContext<((width: number) => void) | null>(null);

interface FloatingActionButtonRootViewProps
  extends FloatingActionButtonVariantProps,
    LynxHostProps<"view"> {}

const FloatingActionButtonRootView = React.forwardRef<unknown, FloatingActionButtonRootViewProps>(
  (props, ref) => {
    const [variantProps, otherProps] = floatingActionButton.splitVariantProps(props);
    const { children, className, style, ...nativeProps } = otherProps;
    const initiallyExtended = React.useRef(variantProps.extended !== false);
    const [labelWidth, setLabelWidth] = React.useState<number>();
    const classNames = floatingActionButton({
      ...variantProps,
      transitionEnabled: labelWidth !== undefined || !initiallyExtended.current,
    });

    return (
      <ClassNamesProvider value={classNames}>
        <LabelWidthContext.Provider value={setLabelWidth}>
          <view
            {...mergeProps(
              { style: { "--fab-label-width": `${labelWidth ?? 0}px` } as LynxViewProps["style"] },
              ref ? { ref: ref as LynxViewRef } : {},
              nativeProps,
              { style },
            )}
            className={clsx(classNames.root, className)}
          >
            {children}
          </view>
        </LabelWidthContext.Provider>
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
 * Tap, pressed state, and accessibility defaults come from `@seed-design/lynx-react-action-button`.
 */
export interface FloatingActionButtonRootProps
  extends FloatingActionButtonPublicVariantProps,
    Pick<UseActionButtonProps, "disabled">,
    Omit<LynxHostProps<"view">, "bindtap" | "main-thread:bindtap">,
    LynxPressableProps {}

export const FloatingActionButtonRoot = React.forwardRef<unknown, FloatingActionButtonRootProps>(
  (props, ref) => {
    const {
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      disabled,
      "accessibility-element": accessibilityElementProp,
      "accessibility-role-description": accessibilityRoleDescription = "button",
      "accessibility-traits": accessibilityTraitsProp,
      ...otherProps
    } = props;
    const api = useActionButton({
      disabled,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElementProp,
      "accessibility-traits": accessibilityTraitsProp,
    });
    // Press state follows the Scale Feedback Main Thread touch handlers.
    const {
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
      ...tapHandlers
    } = api.rootProps;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: !api.interactive,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });

    return (
      <FloatingActionButtonRootView
        {...mergeProps(
          {
            flatten: false,
            "accessibility-element": accessibilityElement,
            "accessibility-role-description": accessibilityRoleDescription,
            "accessibility-traits": accessibilityTraits,
          },
          ref ? { ref } : {},
          scaleFeedbackTargetProps,
          scaleFeedbackTriggerProps,
          tapHandlers,
          otherProps,
        )}
        disabled={api.disabled}
        pressed={api.pressed}
      />
    );
  },
);
FloatingActionButtonRoot.displayName = "FloatingActionButtonRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface FloatingActionButtonIconProps
  extends Omit<InternalIconProps, "deps" | "disableDefaultResize"> {}

const StyledIcon = withContext<unknown, InternalIconProps>(InternalIcon, "icon");

export const FloatingActionButtonIcon = React.forwardRef<unknown, FloatingActionButtonIconProps>(
  (props, ref) => {
    const { className, ...iconProps } = props;
    const classNames = useClassNames();

    return (
      <StyledIcon
        {...mergeProps({ "accessibility-elements-hidden": true }, ref ? { ref } : {}, iconProps)}
        className={className}
        deps={[classNames.icon]}
        disableDefaultResize={true}
      />
    );
  },
);
FloatingActionButtonIcon.displayName = "FloatingActionButtonIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface FloatingActionButtonLabelProps extends LynxHostProps<"text"> {}

export const FloatingActionButtonLabel = React.forwardRef<unknown, FloatingActionButtonLabelProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classNames = useClassNames();
    const setLabelWidth = React.useContext(LabelWidthContext);

    if (!setLabelWidth) {
      throw new Error("FloatingActionButtonLabel must be used within FloatingActionButtonRoot.");
    }

    const handleLayoutChange = React.useCallback<NonNullable<LynxTextProps["bindlayoutchange"]>>(
      (event) => {
        "background only";
        const width = event.detail.width;
        if (Number.isFinite(width) && width >= 0) setLabelWidth(width);
      },
      [setLabelWidth],
    );

    return (
      <text
        {...mergeProps(
          ref ? { ref: ref as LynxTextRef } : {},
          { bindlayoutchange: handleLayoutChange, "accessibility-elements-hidden": true },
          nativeProps,
        )}
        className={clsx(classNames.label, className)}
      >
        {children}
      </text>
    );
  },
);
FloatingActionButtonLabel.displayName = "FloatingActionButtonLabel";
