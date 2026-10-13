import { invokeByRef } from "@lynx-js/lynx-ui-common";
import type { NodesRef } from "@lynx-js/types";

import type { Rect } from "./computePosition.js";

/**
 * 기준 요소의 화면 기준 rect를 측정합니다.
 *
 * `getRectByRef`와 달리 `androidEnableTransformProps`를 켜지 않습니다. Android에서 이 옵션은 가로
 * `scroll-view`의 스크롤 오프셋을 빼지 않아, 스크롤한 뒤에도 이전 위치를 돌려줍니다. 그래서 Android에서는
 * 기준 요소의 transform(눌림 scale, transform으로 움직이는 조상)이 rect에 반영되지 않습니다. iOS는 항상
 * transform을 반영합니다.
 */
export function measureReferenceRect(node: NodesRef): Promise<Rect> {
  "background only";
  return invokeByRef({ current: node }, "boundingClientRect", {
    relativeTo: "screen",
  }) as Promise<Rect>;
}
