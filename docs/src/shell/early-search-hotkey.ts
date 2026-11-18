/**
 * 셸 script(`client.ts`)가 실행되기 전에 누른 Meta/Ctrl+K를 받아 둔다. `client.ts`는 module script라 HTML 파싱이 끝나고
 * chunk를 받은 뒤에야 실행된다. 느린 네트워크에서는 그 전에 화면이 먼저 보이므로, 그 사이의 입력을 놓치지 않으려고
 * `<head>` inline으로 한 번 등록한다. `client.ts`의 `initShell`이 이 listener를 떼고 받아 둔 입력을 `toggleSearch`로 넘긴다.
 *
 * 단축키 정의의 원천은 `client.ts`의 `HOTKEYS`다. 여기의 조건은 그 Meta/Ctrl+K 항목과 같게 둔다.
 * `client.ts`를 싣는 문서(문서 셸, landing)에만 넣는다. 다른 문서에 넣으면 Meta/Ctrl+K 기본 동작만 막힌다.
 */

export interface EarlySearchHotkey {
  /** 받아 둔 입력 수가 홀수면 true(다시 누르면 닫히는 toggle과 같다). */
  pending: boolean;
  listener: (event: KeyboardEvent) => void;
}

declare global {
  interface Window {
    __seedEarlySearch?: EarlySearchHotkey;
  }
}

/** self-contained. `Function.prototype.toString`으로 inline에 넣으므로 import·closure 밖 값을 쓰지 않는다. */
function install(): void {
  if (window.__seedEarlySearch) return;
  const state: EarlySearchHotkey = {
    pending: false,
    listener(event) {
      if (event.repeat || event.isComposing || event.defaultPrevented) return;
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || event.altKey)
        return;
      event.preventDefault();
      state.pending = !state.pending;
    },
  };
  window.__seedEarlySearch = state;
  document.addEventListener("keydown", state.listener);
}

/** `<head>`의 `<script is:inline set:html={...}>`에 넣을 문자열. */
export function earlySearchHotkeyScript(): string {
  return `(${install.toString()})();`;
}

/** `client.ts`의 `initShell`에서 한 번 부른다. inline listener를 떼고, 받아 둔 입력이 있으면 true. */
export function takeEarlySearchRequest(): boolean {
  const state = window.__seedEarlySearch;
  if (!state) return false;
  document.removeEventListener("keydown", state.listener);
  const pending = state.pending;
  state.pending = false;
  return pending;
}
