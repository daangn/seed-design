import { pageBanner, type PageBannerVariantProps } from "@seed-design/lynx-css/recipes/page-banner";
import * as React from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider } from "../Icon/Icon";
import { ScaleFeedback } from "../ScaleFeedback";

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(pageBanner);

type TapHandler = NonNullable<LynxViewProps["bindtap"]>;

interface PageBannerContextValue {
  dismiss: () => void;
}

const PageBannerContext = React.createContext<PageBannerContextValue | null>(null);

function usePageBannerContext(consumer: string) {
  const context = React.useContext(PageBannerContext);

  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <PageBannerRoot/>.`);
  }

  return context;
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * Differences from React Web:
 * - Uses Lynx native `<view>` and `bindtap` instead of `asChild` and DOM events.
 * - Does not provide a web focus ring.
 */
export interface PageBannerRootProps
  extends Omit<PageBannerVariantProps, "pressed" | "closeButtonPressed">,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  defaultOpen?: boolean;
  open?: boolean;
  onDismiss?: () => void;
}

export const PageBannerRoot = React.forwardRef<unknown, PageBannerRootProps>((props, ref) => {
  if (
    process.env.NODE_ENV !== "production" &&
    props.variant === "solid" &&
    props.tone === "magic"
  ) {
    console.error(
      '`magic` tone is not available for `solid` variant in PageBanner components. Please use variant="weak" or a different tone instead.',
    );
  }

  const [variantProps, otherProps] = pageBanner.splitVariantProps(props);
  const {
    children,
    className,
    style,
    defaultOpen = true,
    open: openProp,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = otherProps;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
  });
  const isInteractive = bindtap != null || mainThreadBindtap != null;
  const pressTap = usePressTap({
    disabled: !isInteractive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
  });
  const classNames = pageBanner({ ...variantProps, pressed: pressTap.pressed });
  const dismiss = useMemoizedFn(() => {
    if (!open) return;

    setOpen(false);
    onDismiss?.();
  });
  const contextValue = React.useMemo(() => ({ dismiss }), [dismiss]);
  const iconSlotContextValue = React.useMemo(
    () => ({
      classNames: {
        prefixIcon: classNames.prefixIcon,
        suffixIcon: classNames.suffixIcon,
      },
      deps: [variantProps.tone ?? "neutral", variantProps.variant ?? "weak", pressTap.pressed],
    }),
    [
      classNames.prefixIcon,
      classNames.suffixIcon,
      pressTap.pressed,
      variantProps.tone,
      variantProps.variant,
    ],
  );

  if (!open) return null;

  return (
    <PageBannerContext.Provider value={contextValue}>
      <ClassNamesProvider value={classNames}>
        <PropsProvider value={variantProps}>
          <IconSlotProvider value={iconSlotContextValue}>
            <view
              {...(ref ? { ref: ref as LynxViewRef } : {})}
              {...nativeProps}
              {...(isInteractive ? pressTap : {})}
              accessibility-element={accessibilityElement ?? (isInteractive ? true : undefined)}
              accessibility-traits={accessibilityTraits ?? (isInteractive ? "button" : undefined)}
              className={clsx(classNames.root, className)}
              style={style}
            >
              {children}
            </view>
          </IconSlotProvider>
        </PropsProvider>
      </ClassNamesProvider>
    </PageBannerContext.Provider>
  );
});
PageBannerRoot.displayName = "PageBannerRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerContentProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const PageBannerContent = React.forwardRef<unknown, PageBannerContentProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classNames.content, className)}
      style={style}
    >
      {children}
    </view>
  );
});
PageBannerContent.displayName = "PageBannerContent";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerBodyProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const PageBannerBody = React.forwardRef<unknown, PageBannerBodyProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classNames.body, className)}
      style={style}
    >
      {children}
    </text>
  );
});
PageBannerBody.displayName = "PageBannerBody";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerTitleProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const PageBannerTitle = React.forwardRef<unknown, PageBannerTitleProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const classNames = useClassNames();

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classNames.title, className)}
      style={style}
    >
      {children}
      {"  "}
    </text>
  );
});
PageBannerTitle.displayName = "PageBannerTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerDescriptionProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps {}

export const PageBannerDescription = React.forwardRef<unknown, PageBannerDescriptionProps>(
  (props, ref) => {
    const { children, className, style, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        {...nativeProps}
        className={clsx(classNames.description, className)}
        style={style}
      >
        {children}
      </text>
    );
  },
);
PageBannerDescription.displayName = "PageBannerDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const PageBannerButton = React.forwardRef<unknown, PageBannerButtonProps>((props, ref) => {
  const {
    children,
    className,
    style,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const classNames = useClassNames();

  return (
    <ScaleFeedback>
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        {...nativeProps}
        accessibility-element={accessibilityElement}
        accessibility-traits={accessibilityTraits}
        className={clsx(classNames.button, className)}
        style={style}
      >
        {children}
      </text>
    </ScaleFeedback>
  );
});
PageBannerButton.displayName = "PageBannerButton";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerCloseButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const PageBannerCloseButton = React.forwardRef<unknown, PageBannerCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits = "button",
      ...nativeProps
    } = props;
    const parentVariantProps = useProps() ?? {};
    const { dismiss } = usePageBannerContext("PageBannerCloseButton");
    const handleTap = useMemoizedFn<TapHandler>((event) => {
      bindtap?.(event);
      dismiss();
    });
    const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressTapHandlers } =
      usePressTap({
        onTap: handleTap,
        mainThreadOnTap: mainThreadBindtap,
      });
    const classNames = pageBanner({
      ...parentVariantProps,
      closeButtonPressed: pressed,
    });
    const iconSlotContextValue = React.useMemo(
      () => ({
        classNames: { suffixIcon: classNames.closeButtonIcon },
        deps: [parentVariantProps.tone ?? "neutral", parentVariantProps.variant ?? "weak", pressed],
      }),
      [classNames.closeButtonIcon, parentVariantProps.tone, parentVariantProps.variant, pressed],
    );

    if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
      console.warn("PageBannerCloseButton requires `accessibility-label` for accessibility.");
    }

    return (
      <IconSlotProvider value={iconSlotContextValue}>
        <ScaleFeedback
          onTouchStart={bindtouchstart}
          onTouchEnd={bindtouchend}
          onTouchCancel={bindtouchcancel}
        >
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            {...pressTapHandlers}
            accessibility-element={accessibilityElement}
            accessibility-label={accessibilityLabel}
            accessibility-traits={accessibilityTraits}
            className={clsx(classNames.closeButton, className)}
            style={style}
          >
            {children}
          </view>
        </ScaleFeedback>
      </IconSlotProvider>
    );
  },
);
PageBannerCloseButton.displayName = "PageBannerCloseButton";
