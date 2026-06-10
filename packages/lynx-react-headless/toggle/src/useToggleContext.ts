import { createContext, useContext, type Context } from "@lynx-js/react";
import type { UseToggleReturn } from "./useToggle";

export interface UseToggleContext extends UseToggleReturn {}

export const ToggleContext: Context<UseToggleContext | null> =
  createContext<UseToggleContext | null>(null);

/**
 * Toggle Root가 내려준 `useToggle` 결과를 하위 슬롯에서 읽는다.
 * Context 누락 시 throw (fallback 금지 — 정상 렌더처럼 보여 버그를 감춤).
 */
export function useToggleContext(consumer = "useToggleContext"): UseToggleContext {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error(`${consumer} must be rendered inside a Toggle Root.`);
  }
  return context;
}
