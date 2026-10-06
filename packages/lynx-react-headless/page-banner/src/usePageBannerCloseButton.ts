import { useEffect, useMemo } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { usePageBannerContext } from "./usePageBannerContext.js";

type ViewProps = IntrinsicElements["view"];
type TapHandler = NonNullable<ViewProps["bindtap"]>;
type CloseButtonAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-label" | "accessibility-traits"
>;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UsePageBannerCloseButtonProps
  extends CloseButtonAccessibilityProps,
    MainThreadTouchProps {
  /** `dismiss`보다 먼저 실행됩니다. */
  bindtap?: ViewProps["bindtap"];

  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export interface UsePageBannerCloseButtonReturn {
  /** CloseButton을 누르고 있는 동안 `true`입니다. Root의 `pressed`와 따로 관리합니다. */
  pressed: boolean;
  /**
   * CloseButton native view에 펼칩니다. `bindtap`은 사용자 handler를 실행한 뒤 `dismiss`를 호출합니다.
   * Root tap·Scale Feedback과 분리하려면 다른 props와 합친 최종 props에 `getIndependentActionProps`를 적용합니다.
   * 소비자의 `main-thread:bindtouch*`는 눌림 상태와 합성된 handler로 포함됩니다.
   */
  closeButtonProps: Required<
    Pick<CloseButtonAccessibilityProps, "accessibility-element" | "accessibility-traits">
  > &
    Pick<CloseButtonAccessibilityProps, "accessibility-label"> &
    MainThreadTouchProps &
    Pick<UsePressTapReturn, "bindtap" | "bindtouchstart" | "bindtouchend" | "bindtouchcancel"> &
    Partial<Pick<UsePressTapReturn, "main-thread:bindtap">>;
}

/**
 * @platform Lynx
 *
 * `PageBannerRoot` 안에서 PageBanner를 닫는 버튼의 tap·눌림 상태와 접근성 기본값을 제공하는 headless 훅입니다.
 */
export function usePageBannerCloseButton(
  props: UsePageBannerCloseButtonProps = {},
): UsePageBannerCloseButtonReturn {
  const {
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
  } = props;
  const { dismiss } = usePageBannerContext();
  const handleTap = useMemoizedFn<TapHandler>((event) => {
    "background only";
    bindtap?.(event);
    dismiss();
  });
  const {
    pressed,
    bindtap: handlePressTap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": handleMainThreadTap,
    "main-thread:bindtouchstart": handleMainThreadTouchStart,
    "main-thread:bindtouchend": handleMainThreadTouchEnd,
    "main-thread:bindtouchcancel": handleMainThreadTouchCancel,
  } = usePressTap({
    onTap: handleTap,
    mainThreadOnTap: mainThreadBindtap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
      console.warn("PageBannerCloseButton requires `accessibility-label` for accessibility.");
    }
  }, [accessibilityElement, accessibilityLabel]);

  return useMemo<UsePageBannerCloseButtonReturn>(
    () => ({
      pressed,
      closeButtonProps: {
        bindtap: handlePressTap,
        bindtouchstart,
        bindtouchend,
        bindtouchcancel,
        ...(handleMainThreadTap ? { "main-thread:bindtap": handleMainThreadTap } : {}),
        ...(handleMainThreadTouchStart
          ? { "main-thread:bindtouchstart": handleMainThreadTouchStart }
          : {}),
        ...(handleMainThreadTouchEnd
          ? { "main-thread:bindtouchend": handleMainThreadTouchEnd }
          : {}),
        ...(handleMainThreadTouchCancel
          ? { "main-thread:bindtouchcancel": handleMainThreadTouchCancel }
          : {}),
        "accessibility-element": accessibilityElement,
        "accessibility-label": accessibilityLabel,
        "accessibility-traits": accessibilityTraits,
      },
    }),
    [
      pressed,
      handlePressTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      handleMainThreadTap,
      handleMainThreadTouchStart,
      handleMainThreadTouchEnd,
      handleMainThreadTouchCancel,
      accessibilityElement,
      accessibilityLabel,
      accessibilityTraits,
    ],
  );
}
