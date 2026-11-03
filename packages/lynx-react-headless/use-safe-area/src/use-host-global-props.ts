import { useGlobalProps } from "@lynx-js/react";
import type { GlobalProps } from "@lynx-js/types";

declare const __GLOBAL_PROPS_MODE__: "reactive" | "event" | undefined;

/**
 * `globalPropsMode`에 맞게 global props를 읽는다.
 *
 * `__GLOBAL_PROPS_MODE__`는 앱 빌드 때 치환되는 상수라 한 bundle 안에서 고른 함수가 바뀌지 않는다.
 * `"event"`에서는 `useGlobalProps()`로 변경을 구독한다. `"reactive"`에서는 host가 값을 바꾸면
 * 페이지 전체가 다시 렌더되므로 `lynx.__globalProps`를 바로 읽는다. 이 모드의 `useGlobalProps()`는
 * 같은 값을 돌려주면서 dev 빌드에서 호출마다 경고하기 때문이다.
 */
export const useHostGlobalProps: () => GlobalProps | undefined =
  typeof __GLOBAL_PROPS_MODE__ !== "undefined" && __GLOBAL_PROPS_MODE__ === "event"
    ? useGlobalProps
    : () => lynx.__globalProps;
