import type { GlobalEventEmitter } from "@lynx-js/types";

import type { RawKeyboardState } from "./native-driver";

export type KeyboardEventListener = (state: RawKeyboardState) => void;

export interface KeyboardEventSource {
  subscribe(listener: KeyboardEventListener): () => void;
}

type GetGlobalEventEmitter = () => GlobalEventEmitter;

export function createKeyboardEventSource(getEmitter: GetGlobalEventEmitter): KeyboardEventSource {
  const subscriptions = new Set<{ listener: KeyboardEventListener }>();
  let emitter: GlobalEventEmitter | null = null;
  let currentState: RawKeyboardState = { visible: false, height: 0 };

  const handleNativeKeyboardEvent = (...args: unknown[]) => {
    "background only";

    const status = args[0];
    const height = args[1];
    currentState = {
      visible: status === "on",
      height:
        status === "on" && typeof height === "number" && Number.isFinite(height)
          ? Math.max(0, height)
          : 0,
    };

    for (const subscription of subscriptions) {
      subscription.listener(currentState);
    }
  };

  return {
    subscribe(listener) {
      "background only";

      const subscription = { listener };
      subscriptions.add(subscription);

      if (emitter === null) {
        try {
          const nextEmitter = getEmitter();
          nextEmitter.addListener("keyboardstatuschanged", handleNativeKeyboardEvent);
          emitter = nextEmitter;
        } catch {
          // GlobalEventEmitter가 없는 host에서는 기본 닫힘 상태로 fail-soft 처리한다.
        }
      }

      listener(currentState);

      let subscribed = true;

      return () => {
        "background only";

        if (!subscribed) return;
        subscribed = false;
        subscriptions.delete(subscription);

        // Lynx의 keyboard detection은 listener별 ref-count가 아니다. 모듈 수명 동안
        // 단일 native listener를 유지해 다른 구독자와 간섭하지 않고 최신 상태도 보존한다.
      };
    },
  };
}

export const lynxKeyboardEventSource = createKeyboardEventSource(() => {
  "background only";

  return lynx.getJSModule("GlobalEventEmitter");
});
