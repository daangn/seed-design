import { createContext, useContext, type Context } from "@lynx-js/react";
import type { UseCalloutReturn } from "./useCallout.js";

export const CalloutContext: Context<UseCalloutReturn | null> =
  createContext<UseCalloutReturn | null>(null);

/**
 * `CalloutRoot`가 내려준 `useCallout` 결과를 하위 요소에서 읽습니다.
 */
export function useCalloutContext(consumer = "useCalloutContext"): UseCalloutReturn {
  const context = useContext(CalloutContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <CalloutRoot/>.`);
  }
  return context;
}
