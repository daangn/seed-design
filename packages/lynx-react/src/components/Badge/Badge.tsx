import * as React from "@lynx-js/react";
import { badge, type BadgeVariantProps } from "@seed-design/lynx-css/recipes/badge";
import clsx from "clsx";

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

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(badge);

type BadgeSlot = "prefix" | "action";

interface BadgeContextValue {
  registerSlot: (slot: BadgeSlot) => () => void;
  variantProps: BadgeVariantProps;
}

const BadgeContext = React.createContext<BadgeContextValue | null>(null);

function useBadgeContext(consumer: "BadgePrefix" | "BadgeAction") {
  const context = React.useContext(BadgeContext);

  if (context === null) {
    throw new Error(`<${consumer}/> must be rendered inside <BadgeRoot/>.`);
  }

  return context;
}

////////////////////////////////////////////////////////////////////////////////////

export interface BadgeRootProps
  extends Omit<BadgeVariantProps, "pressed">,
    LynxStyledElementProps {}

export const BadgeRoot = React.forwardRef<unknown, BadgeRootProps>((props, ref) => {
  const [variantProps, otherProps] = badge.splitVariantProps(props);
  const classes = badge(variantProps);
  const { children, className, ...nativeProps } = otherProps;
  const registeredSlots = React.useRef<Record<BadgeSlot, number>>({
    prefix: 0,
    action: 0,
  });
  const registerSlot = React.useCallback((slot: BadgeSlot) => {
    const otherSlot = slot === "prefix" ? "action" : "prefix";

    if (registeredSlots.current[otherSlot] > 0) {
      throw new Error("Badge.Prefix and Badge.Action cannot be used together.");
    }

    registeredSlots.current[slot] += 1;

    return () => {
      registeredSlots.current[slot] -= 1;
    };
  }, []);
  const contextValue: BadgeContextValue = {
    registerSlot,
    variantProps,
  };

  return (
    <ClassNamesProvider value={classes}>
      <BadgeContext.Provider value={contextValue}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          className={clsx(classes.root, className)}
        >
          {children}
        </view>
      </BadgeContext.Provider>
    </ClassNamesProvider>
  );
});
BadgeRoot.displayName = "BadgeRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface BadgePrefixProps extends LynxStyledElementProps {}

export const BadgePrefix = React.forwardRef<unknown, BadgePrefixProps>((props, ref) => {
  const context = useBadgeContext("BadgePrefix");
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;

  React.useEffect(() => context.registerSlot("prefix"), [context.registerSlot]);

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
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
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
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
  const context = useBadgeContext("BadgeAction");
  const {
    children,
    className,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const pressTap = usePressTap({
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });

  React.useEffect(() => context.registerSlot("action"), [context.registerSlot]);

  const handleTouchStart = React.useCallback(
    (...args: Parameters<typeof pressTap.bindtouchstart>) => {
      pressTap.bindtouchstart(...args);
      bindtouchstart?.(...args);
    },
    [bindtouchstart, pressTap.bindtouchstart],
  );
  const handleTouchEnd = React.useCallback(
    (...args: Parameters<typeof pressTap.bindtouchend>) => {
      pressTap.bindtouchend(...args);
      bindtouchend?.(...args);
    },
    [bindtouchend, pressTap.bindtouchend],
  );
  const handleTouchCancel = React.useCallback(
    (...args: Parameters<typeof pressTap.bindtouchcancel>) => {
      pressTap.bindtouchcancel(...args);
      bindtouchcancel?.(...args);
    },
    [bindtouchcancel, pressTap.bindtouchcancel],
  );

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      bindtap={pressTap.bindtap}
      bindtouchstart={handleTouchStart}
      bindtouchend={handleTouchEnd}
      bindtouchcancel={handleTouchCancel}
      {...(pressTap["main-thread:bindtap"]
        ? { "main-thread:bindtap": pressTap["main-thread:bindtap"] }
        : {})}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits}
      className={clsx(
        badge({ ...context.variantProps, pressed: pressTap.pressed }).action,
        className,
      )}
    >
      {children}
    </view>
  );
});
BadgeAction.displayName = "BadgeAction";

////////////////////////////////////////////////////////////////////////////////////
