import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";

import {
  useKeyboardAvoidingScrollView,
  type UseKeyboardAvoidingScrollViewProps,
} from "./useKeyboardAvoidingScrollView.js";
import { KeyboardAvoidingScrollViewProvider } from "./useKeyboardAvoidingScrollViewContext.js";

type ScrollViewProps = IntrinsicElements["scroll-view"];

export interface KeyboardAvoidingScrollViewRootProps
  extends Omit<UseKeyboardAvoidingScrollViewProps, "ref">,
    Pick<
      ScrollViewProps,
      | "accessibility-label"
      | "accessibility-traits"
      | "accessibility-element"
      | "accessibility-value"
      | "accessibility-role-description"
      | "accessibility-elements-hidden"
      | "accessibility-heading"
      | "accessibility-actions"
      | "accessibility-exclusive-focus"
      | "ios-platform-accessibility-id"
    > {
  children?: ReactNode;
  className?: ScrollViewProps["className"];
  style?: CSSProperties;
  id?: ScrollViewProps["id"];
  hidden?: ScrollViewProps["hidden"];
  focusable?: ScrollViewProps["focusable"];
  bounces?: ScrollViewProps["bounces"];
  "enable-scroll"?: ScrollViewProps["enable-scroll"];
  "scroll-bar-enable"?: ScrollViewProps["scroll-bar-enable"];
  "upper-threshold"?: ScrollViewProps["upper-threshold"];
  "lower-threshold"?: ScrollViewProps["lower-threshold"];
  "initial-scroll-offset"?: ScrollViewProps["initial-scroll-offset"];
  "initial-scroll-to-index"?: ScrollViewProps["initial-scroll-to-index"];
  bindscrolltoupper?: ScrollViewProps["bindscrolltoupper"];
  bindscrolltolower?: ScrollViewProps["bindscrolltolower"];
  bindcontentsizechanged?: ScrollViewProps["bindcontentsizechanged"];
  bindtap?: ScrollViewProps["bindtap"];
  "main-thread:bindtap"?: ScrollViewProps["main-thread:bindtap"];
}

/**
 * @platform Lynx
 *
 * 스타일 없이 세로 native `<scroll-view>`와 하단 spacer를 렌더링하고, 하위 입력이 등록할 Provider를 엽니다.
 * 직접 만든 scroll host가 필요하면 `useKeyboardAvoidingScrollView`의 props를 펼치고 `KeyboardAvoidingScrollViewProvider`로 감쌉니다.
 *
 * - Lynx 4.0 이후 입력 요소의 `avoid-keyboard`와 함께 쓰지 않습니다. 엔진이 LynxView 자체를 옮겨 회피가 겹칩니다.
 * - 가로 스크롤과 중첩 스크롤, 키보드 툴바 높이, 큰 textarea의 caret 단위 회피는 지원하지 않습니다.
 */
export const KeyboardAvoidingScrollViewRoot: ForwardRefExoticComponent<
  PropsWithoutRef<KeyboardAvoidingScrollViewRootProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, KeyboardAvoidingScrollViewRootProps>((props, ref) => {
  const {
    children,
    keyboardGap,
    scrollBehavior,
    bindlayoutchange,
    bindscroll,
    bindscrollend,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const api = useKeyboardAvoidingScrollView({
    ref,
    keyboardGap,
    scrollBehavior,
    bindlayoutchange,
    bindscroll,
    bindscrollend,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
  });
  // 저장소 tsconfig가 `<view>`를 SVG 요소로 검사해 NodesRef ref를 거부하므로 record로 펼친다.
  const spacerProps: Record<string, unknown> = api.spacerProps;

  return (
    <KeyboardAvoidingScrollViewProvider value={api.context}>
      <scroll-view {...nativeProps} {...api.scrollViewProps}>
        {children}
        <view {...spacerProps} />
      </scroll-view>
    </KeyboardAvoidingScrollViewProvider>
  );
});
KeyboardAvoidingScrollViewRoot.displayName = "KeyboardAvoidingScrollViewRoot";
