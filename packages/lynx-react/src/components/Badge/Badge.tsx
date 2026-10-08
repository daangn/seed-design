import * as React from "@lynx-js/react";
import {
  badge,
  type BadgeSlotName,
  type BadgeVariantProps,
} from "@seed-design/lynx-css/recipes/badge";
import clsx from "clsx";

import { mergeProps } from "../../utils/merge-props";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxTextRef, LynxViewRef } from "../../types";

type BadgeClassNames = Record<BadgeSlotName, string>;

const BadgeClassNamesContext = React.createContext<BadgeClassNames | null>(null);

function useBadgeClassNames(consumer: string): BadgeClassNames {
  const context = React.useContext(BadgeClassNamesContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <BadgeRoot/>.`);
  return context;
}

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeRootProps extends BadgeVariantProps, LynxHostProps<"view"> {}

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

export interface BadgePrefixProps extends LynxHostProps<"view"> {}

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

export interface BadgeLabelProps extends LynxHostProps<"text"> {}

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

export interface BadgeActionProps extends LynxHostProps<"view"> {}

export const BadgeAction = React.forwardRef<unknown, BadgeActionProps>((props, ref) => {
  const classes = useBadgeClassNames("BadgeAction");
  const { children, className, ...nativeProps } = props;
  const { scaleFeedbackTargetProps, scaleFeedbackTriggerProps } = useScaleFeedback();

  return (
    <view
      {...mergeProps(
        {
          flatten: false,
          "accessibility-element": true,
          "accessibility-traits": "button",
        } as const,
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        nativeProps,
      )}
      className={clsx(classes.action, className)}
    >
      {children}
    </view>
  );
});
BadgeAction.displayName = "BadgeAction";

////////////////////////////////////////////////////////////////////////////////////
