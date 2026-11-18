/**
 * island 사이에 공유하는 클라이언트 상태. React context는 island를 넘지 못하므로 module 단위 store를 쓴다.
 * ClientRouter 아래에서 module은 세션당 한 번 평가되므로 이동 뒤에도 같은 인스턴스다(배포 skew로 새 해시의 chunk가
 * 생기면 셸 서명이 달라져 전체 로드가 된다 — `navigation-guard.ts`).
 *
 * 두 종류를 둔다.
 * - 일시 UI(검색·모바일 패널 열림): 이동하면 닫힌다.
 * - 이동 뒤 nav 상태(`navState`): persist된 `DocsNav`가 읽는 현재 경로·섹션 nav·platform. props 갱신은 렌더러의
 *   `startTransition`이라 WebKit·Firefox에서 활성 항목이 본문보다 한 프레임 늦었다. 이 atom을 `useSyncExternalStore`로
 *   읽으면 after-swap 직후 microtask에서 commit되어 body 교체와 같은 task에서 끝난다(S1-b).
 *
 * 불변식
 * - 각 atom은 이 파일의 함수로만 바뀐다(`set`을 export하지 않는다).
 * - 일시 UI를 이동 때 닫는 규칙은 `resetTransientUi()` 하나이고 `client.ts`의 `astro:before-swap`만 부른다.
 * - `navState`의 쓰기는 `syncNavState()` 하나이고 `client.ts`의 `astro:after-swap`만 부른다. 값의 원천은 새 body의
 *   `#docs-nav-data`(`DocsShell.astro`가 `serializeNavState`로 쓴다)다. `null`이면 아직 이동이 없어 `DocsNav`가 props를 쓴다.
 * - React를 import하지 않는다(`client.ts`가 `.astro` `<script>`에서 import한다). React 바인딩은 `use-store.ts`.
 */
import type { SectionNav } from "./nav-model";

export interface ReadableAtom<T> {
  get(): T;
  subscribe(listener: () => void): () => void;
}

function atom<T>(initial: T): ReadableAtom<T> & { set(value: T): void } {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(next) {
      if (Object.is(next, value)) return;
      value = next;
      for (const listener of [...listeners]) listener();
    },
  };
}

// ───────────────────────── 일시 UI ─────────────────────────

const searchOpenAtom = atom(false);
const mobileNavOpenAtom = atom(false);

export const searchOpen: ReadableAtom<boolean> = searchOpenAtom;
export const mobileNavOpen: ReadableAtom<boolean> = mobileNavOpenAtom;

export function openSearch(): void {
  searchOpenAtom.set(true);
}
export function closeSearch(): void {
  searchOpenAtom.set(false);
}
/** Meta/Ctrl+K. 다시 누르면 닫힌다. `SiteHeader`가 hydrate되기 전에 눌려도 값이 남아 hydrate 직후 열린다. */
export function toggleSearch(): void {
  searchOpenAtom.set(!searchOpenAtom.get());
}
export function openMobileNav(): void {
  mobileNavOpenAtom.set(true);
}
export function closeMobileNav(): void {
  mobileNavOpenAtom.set(false);
}

/** `client.ts`의 `astro:before-swap`에서만 부른다. idempotent. */
export function resetTransientUi(): void {
  searchOpenAtom.set(false);
  mobileNavOpenAtom.set(false);
}

// ───────────────────────── 이동 뒤 nav 상태 ─────────────────────────

/** `DocsNav`가 그리는 데 필요한 값 전부. 첫 페이지는 같은 모양이 island props로 온다. */
export interface NavState {
  /** 사이드바 없는 문서(get-started·updates·404)는 null. */
  nav: SectionNav | null;
  currentPath: string;
  /** React·Lynx 섹션의 버전 전환기. */
  platform: "react" | "lynx" | null;
}

/** `DocsShell.astro`가 쓰고 `syncNavState`가 읽는 data script id. 이 둘 밖에서 쓰지 않는다. */
export const NAV_DATA_ID = "docs-nav-data";

const navStateAtom = atom<NavState | null>(null);

export const navState: ReadableAtom<NavState | null> = navStateAtom;

/** `DocsShell.astro`가 `<script type="application/json" id={NAV_DATA_ID} set:html={…}>`에 넣을 문자열. */
export function serializeNavState(state: NavState): string {
  return JSON.stringify(state).replace(/</g, "\\u003c");
}

/**
 * `client.ts`의 `astro:after-swap`(paint 전)에서만 부른다. 새 body의 `#docs-nav-data`를 읽어 넣는다.
 * data script가 없는 문서면 아무것도 하지 않는다.
 */
export function syncNavState(doc: Document): void {
  const element = doc.getElementById(NAV_DATA_ID);
  if (!element) return;
  navStateAtom.set(JSON.parse(element.textContent ?? "null") as NavState);
}
