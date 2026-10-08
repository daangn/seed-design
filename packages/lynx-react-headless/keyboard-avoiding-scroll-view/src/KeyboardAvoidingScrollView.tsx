import {
  forwardRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

import {
  KeyboardAvoidingScrollViewRootProvider,
  useKeyboardAvoidingScrollView,
  type UseKeyboardAvoidingScrollViewProps,
} from "./useKeyboardAvoidingScrollView.js";
import {
  useKeyboardAvoidingScrollViewContent,
  type UseKeyboardAvoidingScrollViewContentProps,
} from "./useKeyboardAvoidingScrollViewContent.js";
import { KeyboardAvoidingScrollViewProvider } from "./useKeyboardAvoidingScrollViewContext.js";
import {
  useKeyboardAvoidingScrollViewFooter,
  type UseKeyboardAvoidingScrollViewFooterProps,
} from "./useKeyboardAvoidingScrollViewFooter.js";

type ViewProps = IntrinsicElements["view"];
type ScrollViewProps = IntrinsicElements["scroll-view"];

export interface KeyboardAvoidingScrollViewRootProps
  extends Omit<UseKeyboardAvoidingScrollViewProps, "ref">,
    Omit<ViewProps, keyof UseKeyboardAvoidingScrollViewProps | "children"> {
  children?: ReactNode;
}

/**
 * @platform Lynx
 *
 * 스타일 없이 Content와 Footer를 세로로 배치하는 native `<view>`입니다. 키보드 상태를 구독하고 하위 입력이 등록할 Provider를 엽니다.
 * AppBar 아래 화면 본문처럼 높이가 정해진 영역에 두고, 자식으로 `KeyboardAvoidingScrollViewContent`와 필요하면 `KeyboardAvoidingScrollViewFooter`를 둡니다.
 *
 * - Lynx 4.0 이후 입력 요소의 `avoid-keyboard`와 함께 쓰지 않습니다. 엔진이 LynxView 자체를 옮겨 회피가 겹칩니다.
 * - 가로 스크롤과 중첩 스크롤, 키보드 툴바 높이, 큰 textarea의 caret 단위 회피는 지원하지 않습니다.
 */
export const KeyboardAvoidingScrollViewRoot: ForwardRefExoticComponent<
  PropsWithoutRef<KeyboardAvoidingScrollViewRootProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, KeyboardAvoidingScrollViewRootProps>((props, ref) => {
  const { children, style, bindlayoutchange, keyboardGap, scrollBehavior, ...nativeProps } = props;
  const { context, rootContext, rootProps } = useKeyboardAvoidingScrollView({
    ref,
    style,
    bindlayoutchange,
    keyboardGap,
    scrollBehavior,
  });
  // 저장소 tsconfig가 `<view>`를 SVG 요소로 검사해 NodesRef ref를 거부하므로 record로 펼친다.
  const viewProps: Record<string, unknown> = rootProps;

  return (
    <KeyboardAvoidingScrollViewProvider value={context}>
      <KeyboardAvoidingScrollViewRootProvider value={rootContext}>
        <view {...viewProps} {...nativeProps}>
          {children}
        </view>
      </KeyboardAvoidingScrollViewRootProvider>
    </KeyboardAvoidingScrollViewProvider>
  );
});
KeyboardAvoidingScrollViewRoot.displayName = "KeyboardAvoidingScrollViewRoot";

export interface KeyboardAvoidingScrollViewContentProps
  extends Omit<UseKeyboardAvoidingScrollViewContentProps, "ref">,
    Omit<ScrollViewProps, keyof UseKeyboardAvoidingScrollViewContentProps | "children"> {
  children?: ReactNode;
}

/**
 * @platform Lynx
 *
 * Root의 남은 높이를 채우는 세로 native `<scroll-view>`입니다. 마지막 자식으로 렌더링하는 spacer와 스크롤 위치를 조정해
 * focus된 입력을 키보드와 Footer 위에 보이게 합니다.
 */
export const KeyboardAvoidingScrollViewContent: ForwardRefExoticComponent<
  PropsWithoutRef<KeyboardAvoidingScrollViewContentProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, KeyboardAvoidingScrollViewContentProps>((props, ref) => {
  const {
    children,
    style,
    bindlayoutchange,
    bindscroll,
    bindscrollend,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    ...nativeProps
  } = props;
  const { scrollViewProps, spacerProps } = useKeyboardAvoidingScrollViewContent({
    ref,
    style,
    bindlayoutchange,
    bindscroll,
    bindscrollend,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
  });
  // 저장소 tsconfig가 `<view>`를 SVG 요소로 검사해 NodesRef ref를 거부하므로 record로 펼친다.
  const spacerViewProps: Record<string, unknown> = spacerProps;

  return (
    <scroll-view {...scrollViewProps} {...nativeProps}>
      {children}
      <view {...spacerViewProps} />
    </scroll-view>
  );
});
KeyboardAvoidingScrollViewContent.displayName = "KeyboardAvoidingScrollViewContent";

export interface KeyboardAvoidingScrollViewFooterProps
  extends Omit<UseKeyboardAvoidingScrollViewFooterProps, "ref">,
    Omit<ViewProps, keyof UseKeyboardAvoidingScrollViewFooterProps | "children"> {
  children?: ReactNode;
}

/**
 * @platform Lynx
 *
 * Content 아래에 두는 native `<view>`입니다. 키보드가 Root 아래쪽을 가린 만큼 위로 이동해 키보드 바로 위에 붙습니다.
 * 어떤 입력이 키보드를 열었는지와 관계없이 이동하며, Footer 안의 입력은 Content를 스크롤하지 않습니다.
 */
export const KeyboardAvoidingScrollViewFooter: ForwardRefExoticComponent<
  PropsWithoutRef<KeyboardAvoidingScrollViewFooterProps> & RefAttributes<NodesRef>
> = forwardRef<NodesRef, KeyboardAvoidingScrollViewFooterProps>((props, ref) => {
  const { children, style, ...nativeProps } = props;
  const { context, footerProps } = useKeyboardAvoidingScrollViewFooter({
    ref,
    style,
  });
  // 저장소 tsconfig가 `<view>`를 SVG 요소로 검사해 NodesRef ref를 거부하므로 record로 펼친다.
  const viewProps: Record<string, unknown> = footerProps;

  return (
    <KeyboardAvoidingScrollViewProvider value={context}>
      <view {...viewProps} {...nativeProps}>
        {children}
      </view>
    </KeyboardAvoidingScrollViewProvider>
  );
});
KeyboardAvoidingScrollViewFooter.displayName = "KeyboardAvoidingScrollViewFooter";
