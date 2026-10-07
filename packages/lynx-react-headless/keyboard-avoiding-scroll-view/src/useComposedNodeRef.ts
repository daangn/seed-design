import { useMemo, type Ref } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";

export interface NodeRefObject {
  current: NodesRef | null;
}

/**
 * 회피 엔진이 읽는 내부 ref와 소비자 ref를 함께 연결합니다. 소비자 ref가 없으면 내부 ref를 그대로 씁니다.
 */
export function useComposedNodeRef(
  internalRef: NodeRefObject,
  forwardedRef: Ref<NodesRef> | undefined,
): Ref<NodesRef> {
  return useMemo<Ref<NodesRef>>(() => {
    if (!forwardedRef) return internalRef;

    return (node: NodesRef | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    };
  }, [internalRef, forwardedRef]);
}
