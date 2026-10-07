import type { GlobalEventEmitter } from "@lynx-js/types";

import { getKeyboardAvoidingPlatform, type RawKeyboardState } from "./native-driver.js";

export type KeyboardEventListener = (state: RawKeyboardState) => void;

export interface KeyboardEventSource {
  subscribe(listener: KeyboardEventListener): () => void;
  /**
   * 처음 구독할 때 시작한 native 감지가 초기 상태를 보낼 때까지 남은 시간(ms)입니다.
   * 0이면 구독 때 받은 상태를 첫 위치로 믿을 수 있습니다.
   */
  getInitialStateDelay(): number;
}

type GetGlobalEventEmitter = () => GlobalEventEmitter;

/**
 * Lynx Android는 `keyboardstatuschanged` listener를 처음 붙일 때 감지를 시작하고, 감지용 window의 첫 layout에서
 * 내비게이션 바가 가린 높이 같은 초기 상태를 보낸다. iOS는 키보드가 바뀔 때만 보낸다.
 */
const ANDROID_INITIAL_STATE_WAIT_MS = 100;

export function createKeyboardEventSource(
  getEmitter: GetGlobalEventEmitter,
  getInitialStateWait: () => number = () => 0,
): KeyboardEventSource {
  const subscriptions = new Set<{ listener: KeyboardEventListener }>();
  let emitter: GlobalEventEmitter | null = null;
  let detectionStartedAt: number | null = null;
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
          detectionStartedAt = Date.now();
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
    getInitialStateDelay() {
      "background only";

      if (detectionStartedAt === null) return 0;
      return Math.max(0, detectionStartedAt + getInitialStateWait() - Date.now());
    },
  };
}

export const lynxKeyboardEventSource = createKeyboardEventSource(
  () => {
    "background only";

    return lynx.getJSModule("GlobalEventEmitter");
  },
  () => {
    "background only";

    return getKeyboardAvoidingPlatform() === "Android" ? ANDROID_INITIAL_STATE_WAIT_MS : 0;
  },
);
