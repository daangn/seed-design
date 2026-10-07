import { useEffect, useMemo, type Ref } from "@lynx-js/react";
import type { CSSProperties, NodesRef } from "@lynx-js/types";

import { useKeyboardAvoidingScrollViewRootContext } from "./useKeyboardAvoidingScrollView.js";
import type { UseKeyboardAvoidingScrollViewContext } from "./useKeyboardAvoidingScrollViewContext.js";

/**
 * 키보드는 처음에 빠르게 움직이고 끝에서 천천히 멈춘다. 같은 모양의 곡선이어야 열리는 동안 Footer가 키보드에 가리지 않는다.
 * iOS 26.5 시뮬레이터에서 0.25s ease-out은 버튼이 약 118ms 가려졌고, 이 값은 1프레임 이하였다.
 */
const FOOTER_TRANSITION = "transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)";
/** 첫 위치를 놓는 동안 쓴다. `transition` key를 유지해야 이후 기본값이나 `style.transition`으로 바뀐다. */
const INSTANT_TRANSITION = "transform 0s";

export interface UseKeyboardAvoidingScrollViewFooterProps {
  /** Footer `<view>`에 연결할 ref입니다. */
  ref?: Ref<NodesRef>;
  /**
   * Footer `<view>`의 style입니다. 키보드를 따라 이동하는 `transform`과 `flexShrink`는 덮어쓸 수 없습니다.
   * 기본 `transition`은 키보드 애니메이션에 맞춘 `transform` 전환이며, `style.transition`으로 바꿉니다.
   * inline style이므로 `className`의 `transition`은 기본값보다 우선하지 않습니다.
   * Footer가 처음 자리를 잡을 때는 어떤 `transition`도 적용하지 않습니다.
   */
  style?: CSSProperties;
}

export interface UseKeyboardAvoidingScrollViewFooterReturn {
  /** Footer 안의 입력이 등록할 때 쓰는 Provider 값입니다. 이 입력은 Content를 스크롤하지 않습니다. */
  context: UseKeyboardAvoidingScrollViewContext;
  /** Footer `<view>`에 마지막으로 펼칩니다. */
  footerProps: {
    ref?: Ref<NodesRef>;
    style: CSSProperties;
    flatten: false;
  };
}

/**
 * 가까운 Root에 Footer를 등록하고, 키보드가 Root 아래쪽을 가린 높이만큼 Footer를 위로 옮기는 props를 반환합니다.
 */
export function useKeyboardAvoidingScrollViewFooter(
  props: UseKeyboardAvoidingScrollViewFooterProps = {},
): UseKeyboardAvoidingScrollViewFooterReturn {
  const { ref, style } = props;
  const { footerOffset, footerPlaced, footerTransitionEnabled, footerContext, registerFooter } =
    useKeyboardAvoidingScrollViewRootContext("KeyboardAvoidingScrollViewFooter");

  useEffect(() => registerFooter(), [registerFooter]);

  // transform key를 항상 두어 0과 이동 위치 사이를 같은 translateY 값으로 보간한다.
  const footerStyle = useMemo<CSSProperties>(
    () => ({
      transition: FOOTER_TRANSITION,
      ...style,
      ...(footerTransitionEnabled ? {} : { transition: INSTANT_TRANSITION }),
      // 첫 화면은 키보드 상태와 Root 위치를 재기 전에 그려지므로, 자리 잡기 전에는 보이지 않게 둔다.
      ...(footerPlaced ? {} : { opacity: 0 }),
      flexShrink: 0,
      transform: `translateY(${-footerOffset}px)`,
    }),
    [style, footerOffset, footerPlaced, footerTransitionEnabled],
  );

  return useMemo<UseKeyboardAvoidingScrollViewFooterReturn>(
    () => ({
      context: footerContext,
      footerProps: {
        ...(ref ? { ref } : {}),
        style: footerStyle,
        flatten: false,
      },
    }),
    [footerContext, ref, footerStyle],
  );
}
