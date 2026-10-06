import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { getIndependentActionProps } from "./getIndependentActionProps.js";
import { usePageBanner, type UsePageBannerProps } from "./usePageBanner.js";
import { usePageBannerButton, type UsePageBannerButtonProps } from "./usePageBannerButton.js";
import {
  usePageBannerCloseButton,
  type UsePageBannerCloseButtonProps,
} from "./usePageBannerCloseButton.js";
import { PageBannerProvider } from "./usePageBannerContext.js";

type ViewProps = IntrinsicElements["view"];
type TouchProps = Pick<ViewProps, "bindtouchstart" | "bindtouchend" | "bindtouchcancel">;
type TouchHandler = NonNullable<ViewProps["bindtouchstart"]>;

function composeTouch(consumer: TouchHandler | undefined, press: TouchHandler): TouchHandler {
  return (event) => {
    consumer?.(event);
    press(event);
  };
}

export interface PageBannerRootProps
  extends UsePageBannerProps,
    Omit<ViewProps, keyof UsePageBannerProps> {}

/**
 * 스타일 없이 PageBanner의 표시 상태와 탭할 수 있는 Root를 연결하는 native `<view>`입니다.
 * 닫히면 아무것도 렌더링하지 않습니다. 하위 요소는 `usePageBannerContext`로 `pressed`·`dismiss`를 읽습니다.
 */
export const PageBannerRoot = React.forwardRef<unknown, PageBannerRootProps>((props, ref) => {
  const {
    children,
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const api = usePageBanner({
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
  });

  if (!api.open) return null;

  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...rootProps
  } = api.rootProps;
  const touchProps: TouchProps =
    pressStart && pressEnd && pressCancel
      ? {
          bindtouchstart: composeTouch(bindtouchstart, pressStart),
          bindtouchend: composeTouch(bindtouchend, pressEnd),
          bindtouchcancel: composeTouch(bindtouchcancel, pressCancel),
        }
      : { bindtouchstart, bindtouchend, bindtouchcancel };

  return (
    <PageBannerProvider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...rootProps}
        {...touchProps}
      >
        {children}
      </view>
    </PageBannerProvider>
  );
});
PageBannerRoot.displayName = "PageBannerRoot";

export interface PageBannerButtonProps
  extends UsePageBannerButtonProps,
    Omit<ViewProps, keyof UsePageBannerButtonProps> {}

/**
 * 스타일 없이 PageBanner 안의 독립 action을 연결하는 native `<view>`입니다.
 * tap·touch를 catch로 연결하므로 탭할 수 있는 Root의 tap과 눌림 상태가 함께 실행되지 않습니다.
 */
export const PageBannerButton = React.forwardRef<unknown, PageBannerButtonProps>((props, ref) => {
  const {
    children,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { buttonProps } = usePageBannerButton({
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
  });

  return (
    <view
      {...getIndependentActionProps({
        ...nativeProps,
        ...(ref ? { ref: ref as ViewProps["ref"] } : {}),
        ...buttonProps,
      })}
    >
      {children}
    </view>
  );
});
PageBannerButton.displayName = "PageBannerButton";

export interface PageBannerCloseButtonProps
  extends UsePageBannerCloseButtonProps,
    Omit<ViewProps, keyof UsePageBannerCloseButtonProps> {}

/**
 * 스타일 없이 PageBanner를 닫는 native `<view>`입니다. 사용자 `bindtap`을 실행한 뒤 `dismiss`를 호출합니다.
 * tap·touch를 catch로 연결하므로 탭할 수 있는 Root의 tap과 눌림 상태가 함께 실행되지 않습니다.
 */
export const PageBannerCloseButton = React.forwardRef<unknown, PageBannerCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      ...nativeProps
    } = props;
    const { closeButtonProps } = usePageBannerCloseButton({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "main-thread:bindtouchstart": mainThreadBindtouchstart,
      "main-thread:bindtouchend": mainThreadBindtouchend,
      "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
    });

    return (
      <view
        {...getIndependentActionProps({
          ...nativeProps,
          ...(ref ? { ref: ref as ViewProps["ref"] } : {}),
          ...closeButtonProps,
          bindtouchstart: composeTouch(bindtouchstart, closeButtonProps.bindtouchstart),
          bindtouchend: composeTouch(bindtouchend, closeButtonProps.bindtouchend),
          bindtouchcancel: composeTouch(bindtouchcancel, closeButtonProps.bindtouchcancel),
        })}
      >
        {children}
      </view>
    );
  },
);
PageBannerCloseButton.displayName = "PageBannerCloseButton";
