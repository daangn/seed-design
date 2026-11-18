/**
 * `store.ts` atom의 React 바인딩. island 안에서만 import한다.
 *
 * 서버 snapshot은 호출하는 쪽이 준다.
 * - 일시 UI는 `false`. 서버 HTML에서 늘 닫혀 있으므로 hydration 불일치가 없다. hotkey가 hydrate 전에 눌렸으면
 *   hydrate 직후 한 번 다시 렌더링되어 열린다.
 * - `navState`는 `null`. 첫 hydrate는 props와 같은 값을 그리고, 첫 이동부터 store 값을 쓴다(`DocsNav`).
 * `useSyncExternalStore` 갱신은 transition이 아니라서 after-swap과 같은 task에서 commit된다(S1-b).
 */
import { useSyncExternalStore } from "react";
import type { ReadableAtom } from "./store";

export function useAtom<T>(atom: ReadableAtom<T>, serverValue: T): T {
  return useSyncExternalStore(atom.subscribe, atom.get, () => serverValue);
}
