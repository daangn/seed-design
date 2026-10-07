import { useEffect, useMemo, type Ref } from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";

import { mergeStyle } from "./mergeStyle.js";
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
   * Footer `<view>`의 style입니다. 사용자 값은 이동·숨김·flex·transition 기본값보다 우선합니다.
   * 기본 `transition`은 키보드 애니메이션에 맞춘 `transform` 전환이며 첫 배치 때는 전환을 끕니다.
   * inline style이므로 `className`의 `transition`은 기본값보다 우선하지 않습니다.
   */
  style?: IntrinsicElements["view"]["style"];
}

export interface UseKeyboardAvoidingScrollViewFooterReturn {
  /** Footer 안의 입력이 등록할 때 쓰는 Provider 값입니다. 이 입력은 Content를 스크롤하지 않습니다. */
  context: UseKeyboardAvoidingScrollViewContext;
  /** Footer `<view>`의 기본 props입니다. 사용자 native props는 기본값보다 우선합니다. */
  footerProps: {
    ref?: Ref<NodesRef>;
    style: NonNullable<IntrinsicElements["view"]["style"]>;
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

  // 기본 transform은 0과 이동 위치 사이를 같은 translateY 값으로 보간한다.
  const footerStyle = useMemo(
    () =>
      mergeStyle(
        {
          transition: footerTransitionEnabled ? FOOTER_TRANSITION : INSTANT_TRANSITION,
          // 첫 화면은 키보드 상태와 Root 위치를 재기 전에 그려지므로, 자리 잡기 전에는 보이지 않게 둔다.
          ...(footerPlaced ? {} : { opacity: 0 }),
          flexShrink: 0,
          transform: `translateY(${-footerOffset}px)`,
        },
        style,
      ),
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
