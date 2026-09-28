import { createContext, useContext, type Context } from "@lynx-js/react";
import type { UseActionButtonReturn } from "./useActionButton.js";

export const ActionButtonContext: Context<UseActionButtonReturn | null> =
  createContext<UseActionButtonReturn | null>(null);

/**
 * `ActionButtonRoot`가 내려준 `useActionButton` 결과를 하위 요소에서 읽습니다.
 */
export function useActionButtonContext(consumer = "useActionButtonContext"): UseActionButtonReturn {
  const context = useContext(ActionButtonContext);
  if (!context) {
    throw new Error(`${consumer} must be rendered inside <ActionButtonRoot/>.`);
  }
  return context;
}
