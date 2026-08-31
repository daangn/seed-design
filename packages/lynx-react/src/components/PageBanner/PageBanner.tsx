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

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(pageBanner);

type TapHandler = NonNullable<LynxViewProps["bindtap"]>;
type PageBannerTone = NonNullable<PageBannerVariantProps["tone"]>;
type PageBannerVariant = NonNullable<PageBannerVariantProps["variant"]>;

interface PageBannerContextValue {
  dismiss: () => void;
  tone: PageBannerTone;
  variant: PageBannerVariant;
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
 * 웹 대비 차이:
 * - `asChild`, DOM 이벤트, focus ring을 지원하지 않습니다.
 * - actionable 상태는 배경 pressed feedback만 적용하며 웹의 content scale feedback은 적용하지 않습니다.
 */
export interface PageBannerRootProps
  extends Omit<PageBannerVariantProps, "rootPressed" | "buttonPressed" | "closeButtonPressed">,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  defaultOpen?: boolean;
  open?: boolean;
  onDismiss?: () => void;
}

export const PageBannerRoot = React.forwardRef<unknown, PageBannerRootProps>((props, ref) => {
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
  const tone = variantProps.tone ?? "neutral";
  const variant = variantProps.variant ?? "weak";
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
  const classNames = pageBanner({ ...variantProps, rootPressed: pressTap.pressed });
  const dismiss = useMemoizedFn(() => {
    if (!open) return;

    setOpen(false);
    onDismiss?.();
  });
  const contextValue = React.useMemo(() => ({ dismiss, tone, variant }), [dismiss, tone, variant]);
  const iconSlotContextValue = React.useMemo(
    () => ({
      classNames: {
        prefixIcon: classNames.prefixIcon,
        suffixIcon: classNames.suffixIcon,
      },
      deps: [tone, variant, pressTap.pressed],
    }),
    [classNames.prefixIcon, classNames.suffixIcon, pressTap.pressed, tone, variant],
  );

  if (process.env.NODE_ENV !== "production" && tone === "magic" && variant === "solid") {
    console.error(
      '`magic` tone is not available for `solid` variant in PageBanner components. Please use variant="weak" or a different tone instead.',
    );
  }

  if (!open) return null;

  return (
    <PageBannerContext.Provider value={contextValue}>
      <ClassNamesProvider value={classNames}>
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
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const { tone, variant } = usePageBannerContext("PageBannerButton");
  const pressTap = usePressTap({ onTap: bindtap, mainThreadOnTap: mainThreadBindtap });
  const classNames = pageBanner({ tone, variant, buttonPressed: pressTap.pressed });

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      {...pressTap}
      accessibility-element={accessibilityElement}
      accessibility-traits={accessibilityTraits}
      className={clsx(classNames.button, className)}
      style={style}
    >
      {children}
    </text>
  );
});
PageBannerButton.displayName = "PageBannerButton";

////////////////////////////////////////////////////////////////////////////////////

export interface PageBannerCloseButtonProps
  extends LynxStyledElementProps,
    Omit<LynxPressableProps, "main-thread:bindtap">,
    LynxAccessibilityProps {}

export const PageBannerCloseButton = React.forwardRef<unknown, PageBannerCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits = "button",
      ...nativeProps
    } = props;
    const { dismiss, tone, variant } = usePageBannerContext("PageBannerCloseButton");
    const handleTap = useMemoizedFn<TapHandler>((event) => {
      bindtap?.(event);
      dismiss();
    });
    const pressTap = usePressTap({ onTap: handleTap });
    const classNames = pageBanner({ tone, variant, closeButtonPressed: pressTap.pressed });
    const iconSlotContextValue = React.useMemo(
      () => ({
        classNames: { suffixIcon: classNames.closeIcon },
        deps: [tone, variant, pressTap.pressed],
      }),
      [classNames.closeIcon, pressTap.pressed, tone, variant],
    );

    if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
      console.warn("PageBannerCloseButton requires `accessibility-label` for accessibility.");
    }

    return (
      <IconSlotProvider value={iconSlotContextValue}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          {...pressTap}
          accessibility-element={accessibilityElement}
          accessibility-label={accessibilityLabel}
          accessibility-traits={accessibilityTraits}
          className={clsx(classNames.closeButton, className)}
          style={style}
        >
          {children}
        </view>
      </IconSlotProvider>
    );
  },
);
PageBannerCloseButton.displayName = "PageBannerCloseButton";
