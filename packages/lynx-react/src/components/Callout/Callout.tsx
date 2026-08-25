import { callout, type CalloutVariantProps } from "@seed-design/lynx-css/recipes/callout";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type { LynxPressableProps, LynxStyledElementProps, LynxTextRef, LynxViewRef } from "../../types";
import { IconSlotProvider } from "../Icon";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(callout);

interface CalloutContextValue {
  dismiss: () => void;
}

const CalloutContext = React.createContext<CalloutContextValue | null>(null);

function useCalloutContext(componentName: string) {
  const context = React.useContext(CalloutContext);
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Callout.Root.`);
  }
  return context;
}

export interface CalloutRootProps
  extends CalloutVariantProps,
    LynxStyledElementProps,
    LynxPressableProps {
  open?: boolean;
  defaultOpen?: boolean;
  onDismiss?: () => void;
}

export const CalloutRoot = React.forwardRef<unknown, CalloutRootProps>((props, ref) => {
  const [variantProps, otherProps] = callout.splitVariantProps(props);
  const {
    children,
    className,
    open: controlledOpen,
    defaultOpen = true,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = otherProps;
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
  });
  const dismiss = React.useCallback(() => {
    setOpen(false);
    onDismiss?.();
  }, [onDismiss, setOpen]);
  const { pressed, ...pressHandlers } = usePressTap({
    disabled: bindtap == null,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const classes = callout({ ...variantProps, pressed });

  if (!open) return null;

  return (
    <CalloutContext.Provider value={{ dismiss }}>
      <ClassNamesProvider value={classes}>
        <IconSlotProvider
          value={{
            classNames: {
              prefixIcon: classes.prefixIcon,
              suffixIcon: classes.suffixIcon,
            },
            deps: [variantProps.tone, pressed],
          }}
        >
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            {...pressHandlers}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </IconSlotProvider>
      </ClassNamesProvider>
    </CalloutContext.Provider>
  );
});
CalloutRoot.displayName = "CalloutRoot";

export interface CalloutContentProps extends LynxStyledElementProps {}

export const CalloutContent = React.forwardRef<unknown, CalloutContentProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classes.content, className)}
    >
      {children}
    </view>
  );
});
CalloutContent.displayName = "CalloutContent";

export interface CalloutTitleProps extends LynxStyledElementProps {}

export const CalloutTitle = React.forwardRef<unknown, CalloutTitleProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classes.title, className)}
    >
      {children}
    </text>
  );
});
CalloutTitle.displayName = "CalloutTitle";

export interface CalloutDescriptionProps extends LynxStyledElementProps {}

export const CalloutDescription = React.forwardRef<unknown, CalloutDescriptionProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { children, className, ...nativeProps } = props;
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        {...nativeProps}
        className={clsx(classes.description, className)}
      >
        {children}
      </text>
    );
  },
);
CalloutDescription.displayName = "CalloutDescription";

export interface CalloutLinkProps extends LynxStyledElementProps, LynxPressableProps {}

export const CalloutLink = React.forwardRef<unknown, CalloutLinkProps>((props, ref) => {
  const classes = useClassNames();
  const { children, className, ...nativeProps } = props;
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classes.link, className)}
    >
      {children}
    </text>
  );
});
CalloutLink.displayName = "CalloutLink";

export interface CalloutCloseButtonProps extends LynxStyledElementProps, LynxPressableProps {}

export const CalloutCloseButton = React.forwardRef<unknown, CalloutCloseButtonProps>(
  (props, ref) => {
    const classes = useClassNames();
    const { dismiss } = useCalloutContext("Callout.CloseButton");
    const { children, className, bindtap, ...nativeProps } = props;
    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        bindtap={(event) => {
          bindtap?.(event);
          dismiss();
        }}
        className={clsx(classes.closeButton, className)}
        accessibility-element={true}
        accessibility-role-description="button"
      >
        {children}
      </view>
    );
  },
);
CalloutCloseButton.displayName = "CalloutCloseButton";
