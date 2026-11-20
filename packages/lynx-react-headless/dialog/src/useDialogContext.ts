import { createContext, useContext, type Provider } from "@lynx-js/react";

export interface UseDialogContext {
  /** Root의 `skipAnimation` 값입니다. `true`이면 하위 부품의 `transition`을 끕니다. */
  skipAnimation: boolean;
}

const DialogContext = createContext<UseDialogContext | null>(null);

export const DialogProvider: Provider<UseDialogContext | null> = DialogContext.Provider;

/**
 * DialogRoot가 내려준 `skipAnimation`을 하위 요소에서 읽습니다.
 * 값은 열림·닫힘 단계가 바뀔 때마다 새 객체가 되므로, 이 hook을 부른 부품은 lynx-ui 부품과 같은 commit에서
 * 다시 렌더링됩니다. 부품을 감싸는 컴포넌트가 이 hook을 부르면 감싼 lynx-ui 부품의 갱신이 따로 commit되지 않습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useDialogContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseDialogContext | null : UseDialogContext {
  const context = useContext(DialogContext);
  if (!context && strict) {
    throw new Error("useDialogContext must be used within a DialogRoot");
  }
  return context as UseDialogContext;
}
