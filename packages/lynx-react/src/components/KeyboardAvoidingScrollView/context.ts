import { createContext, useContext, type Context } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";

import type { KeyboardAvoidanceRegistration as EngineRegistration } from "./engine";

export type KeyboardAvoidanceRegistration = EngineRegistration<NodesRef>;

export interface KeyboardAvoidanceActions {
  focus(registration: KeyboardAvoidanceRegistration): void;
  blur(owner: object): void;
  layoutChanged(owner: object): void;
  unregister(owner: object): void;
}

export const KeyboardAvoidanceActionsContext: Context<KeyboardAvoidanceActions | null> =
  createContext<KeyboardAvoidanceActions | null>(null);

/**
 * Lynx TextField가 선택적으로 소비하는 내부 연결점이다.
 * Provider 밖에서는 `null`을 반환해 TextField 자체 동작을 방해하지 않는다.
 */
export function useKeyboardAvoidanceActions(): KeyboardAvoidanceActions | null {
  return useContext(KeyboardAvoidanceActionsContext);
}
