import { createContext, useContext, type Context } from "@lynx-js/react";
import type { UseCheckboxReturn } from "./useCheckbox.js";

export const CheckboxContext: Context<UseCheckboxReturn | null> =
  createContext<UseCheckboxReturn | null>(null);

/**
 * `CheckboxRoot`가 내려준 `useCheckbox` 결과를 하위 요소에서 읽습니다.
 */
export function useCheckboxContext(consumer = "useCheckboxContext"): UseCheckboxReturn {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error(`${consumer} must be rendered inside <CheckboxRoot/>.`);
  }
  return context;
}
