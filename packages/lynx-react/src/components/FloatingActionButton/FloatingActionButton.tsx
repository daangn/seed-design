import * as React from "@lynx-js/react";
import clsx from "clsx";

import {
  floatingActionButton,
  type FloatingActionButtonVariantProps,
} from "@seed-design/lynx-css/recipes/floating-action-button";
import { useActionButton, type UseActionButtonProps } from "@seed-design/lynx-react-action-button";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextProps,
  LynxTextRef,
  LynxTouchProps,
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
    LynxStyledElementProps,
    LynxTouchProps,
    LynxAccessibilityProps {
  flatten?: false;
}

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
            {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
            className={clsx(classNames.root, className)}
            style={
              {
                "--fab-label-width": `${labelWidth ?? 0}px`,
                ...style,
              } as LynxViewProps["style"]
            }
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
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

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
          ref ? { ref } : {},
          api.interactive ? scaleFeedbackTargetProps : {},
          api.interactive ? scaleFeedbackTriggerProps : {},
          api.interactive ? tapHandlers : {},
          otherProps,
        )}
        disabled={api.disabled}
        pressed={api.pressed}
        accessibility-element={accessibilityElement}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-traits={accessibilityTraits}
        flatten={false}
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
        {...mergeProps(ref ? { ref } : {}, iconProps)}
        className={className}
        deps={[classNames.icon]}
        disableDefaultResize={true}
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
          { bindlayoutchange: handleLayoutChange },
          nativeProps,
        )}
        className={clsx(classNames.label, className)}
        accessibility-elements-hidden={true}
      >
        {children}
      </text>
    );
  },
);
FloatingActionButtonLabel.displayName = "FloatingActionButtonLabel";
