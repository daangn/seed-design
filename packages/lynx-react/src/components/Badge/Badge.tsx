import * as React from "@lynx-js/react";
import {
  badge,
  type BadgeSlotName,
  type BadgeVariantProps,
} from "@seed-design/lynx-css/recipes/badge";
import clsx from "clsx";

import { mergeProps } from "../../utils/merge-props";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxTouchProps,
  LynxViewRef,
} from "../../types";

type BadgeClassNames = Record<BadgeSlotName, string>;

const BadgeClassNamesContext = React.createContext<BadgeClassNames | null>(null);

function useBadgeClassNames(consumer: string): BadgeClassNames {
  const context = React.useContext(BadgeClassNamesContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <BadgeRoot/>.`);
  return context;
}

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeRootProps extends BadgeVariantProps, LynxStyledElementProps {}

export const BadgeRoot = React.forwardRef<unknown, BadgeRootProps>((props, ref) => {
  const [variantProps, otherProps] = badge.splitVariantProps(props);
  const classes = badge(variantProps);
  const { children, className, ...nativeProps } = otherProps;

  return (
    <BadgeClassNamesContext.Provider value={classes}>
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes.root, className)}
      >
        {children}
      </view>
    </BadgeClassNamesContext.Provider>
  );
});
BadgeRoot.displayName = "BadgeRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgePrefixProps extends LynxStyledElementProps {}

export const BadgePrefix = React.forwardRef<unknown, BadgePrefixProps>((props, ref) => {
  const classes = useBadgeClassNames("BadgePrefix");
  const { children, className, ...nativeProps } = props;

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.prefix, className)}
    >
      {children}
    </view>
  );
});
BadgePrefix.displayName = "BadgePrefix";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeLabelProps extends LynxStyledElementProps {}

export const BadgeLabel = React.forwardRef<unknown, BadgeLabelProps>((props, ref) => {
  const classes = useBadgeClassNames("BadgeLabel");
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classes.label, className)}
    >
      {children}
    </text>
  );
});
BadgeLabel.displayName = "BadgeLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeActionProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxTouchProps,
    LynxAccessibilityProps {}

export const BadgeAction = React.forwardRef<unknown, BadgeActionProps>((props, ref) => {
  const classes = useBadgeClassNames("BadgeAction");
  const {
    children,
    className,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const { scaleFeedbackTargetProps, scaleFeedbackTriggerProps } = useScaleFeedback();

  return (
    <view
      {...mergeProps(
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        nativeProps,
        mainThreadBindtap ? { "main-thread:bindtap": mainThreadBindtap } : {},
      )}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits}
      className={clsx(classes.action, className)}
      flatten={false}
    >
      {children}
    </view>
  );
});
BadgeAction.displayName = "BadgeAction";

////////////////////////////////////////////////////////////////////////////////////
