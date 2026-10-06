import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { KeyboardAvoidanceRegistration } from "./useKeyboardAvoidingScrollView.js";

/**
 * 독립 native 입력이 `KeyboardAvoidingScrollView`에 회피 대상을 알리는 동작입니다.
 * `owner`가 현재 활성 입력이 아니면 `blur`·`layoutChanged`는 무시됩니다.
 */
export interface UseKeyboardAvoidingScrollViewContext {
  /** 입력의 `bindfocus`에서 호출합니다. 다른 입력이 활성이면 그 입력을 이어받습니다. */
  focus(registration: KeyboardAvoidanceRegistration): void;
  /** 입력의 `bindblur`에서 호출합니다. 30ms 안에 다른 입력이 focus되면 회피를 유지한 채 넘겨줍니다. */
  blur(owner: object): void;
  /** autoresize textarea처럼 활성 입력의 크기가 바뀌면 호출해 회피 위치를 다시 계산합니다. */
  layoutChanged(owner: object): void;
  /** 입력이 unmount될 때 호출합니다. 해당 입력의 진행 중인 측정 결과는 스크롤에 반영되지 않습니다. */
  unregister(owner: object): void;
}

const KeyboardAvoidingScrollViewContext =
  createContext<UseKeyboardAvoidingScrollViewContext | null>(null);

export const KeyboardAvoidingScrollViewProvider: Provider<UseKeyboardAvoidingScrollViewContext | null> =
  KeyboardAvoidingScrollViewContext.Provider;

/**
 * 가장 가까운 `KeyboardAvoidingScrollViewRoot`의 등록 동작을 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환하므로 스크롤 영역 없이도 쓰이는 입력에 사용합니다.
 */
export function useKeyboardAvoidingScrollViewContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false
  ? UseKeyboardAvoidingScrollViewContext | null
  : UseKeyboardAvoidingScrollViewContext {
  const context = useContext(KeyboardAvoidingScrollViewContext);
  if (!context && strict) {
    throw new Error(
      "useKeyboardAvoidingScrollViewContext must be used within a KeyboardAvoidingScrollViewRoot",
    );
  }
  return context as UseKeyboardAvoidingScrollViewContext;
}
