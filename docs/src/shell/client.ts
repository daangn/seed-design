/**
 * 문서 셸의 내비게이션 수명 주기 배선. `DocsShell.astro`의 번들 `<script>`가 import한다.
 * 모든 문서 페이지에 같은 script라 세션(ClientRouter가 유지되는 동안) 동안 한 번만 평가된다.
 *
 * 이 모듈은 "언제"만 정한다. "무엇을"은 각 소유 모듈에 있다.
 * - 전역 단축키: `HOTKEYS` 표(이 파일). 이 script 전에 누른 Meta/Ctrl+K는 `early-search-hotkey.ts`가 받아 둔다.
 * - 전체 로드 경계(빌드 경계·배포 skew): `navigation-guard.ts`.
 * - swap 직전: 일시 UI 닫기 `store.ts#resetTransientUi`. 테마·배너 재적용은 `root-attributes.ts` bootstrap이 직접 등록한다.
 * - swap 직후(paint 전): `DocsNav`가 읽는 nav 상태 `store.ts#syncNavState`(가장 먼저), widget 동기화
 *   `widgets.ts#syncWidgets`, 탭 스트립 스크롤 기준점. 사이드바 `scrollTop` 복원은 `DocsNav`가 직접 등록한다.
 * - 클릭 위임: 배너 닫기(`root-attributes.ts#dismissBanner`).
 * - page-load: 최근 본 페이지 기록. GA page_view는 보내지 않는다(GA4 향상된 측정이 history 변경을 잡는다, 오너 결정 8).
 * - PostHog 초기화(env가 있을 때, 한 번).
 *
 * 불변식
 * - 등록 가드는 module 변수가 아니라 `window` 플래그다. 배포 skew에서 셸 서명이 같아 기본 swap이 일어나도 새 해시의
 *   이 script가 같은 realm에서 실행된다(S1-c). listener가 두 벌이 되면 `d`가 두 번 토글돼 아무 일도 안 일어난 것처럼 보인다.
 * - 모든 리스너는 `document`나 `window`에 등록한다. body 아래 요소에 등록하지 않는다(swap 때 사라진다).
 * - React를 import하지 않는다(학습 docs-astro-script-react-refresh-preamble).
 * - 페이지별 초기화는 `astro:after-swap`(paint 전 DOM 보정)이나 `astro:page-load`(그 밖)에 둔다.
 */
import type { TransitionBeforePreparationEvent } from "astro:transitions/client";
import { recordRecentPage } from "../../lib/recent-pages";
import { initWidgets, syncWidgets } from "../mdx/widgets";
import { takeEarlySearchRequest } from "./early-search-hotkey";
import { installNavigationGuard } from "./navigation-guard";
import { type BannerId, dismissBanner, toggleTheme } from "./root-attributes";
import { resetTransientUi, syncNavState, toggleSearch } from "./store";

interface Hotkey {
  /** `KeyboardEvent.key` 소문자. */
  key: string;
  /** true면 Meta(macOS) 또는 Ctrl. false/없음이면 수식키가 없어야 한다. */
  meta?: boolean;
  /** 입력 중(input, textarea, select, contenteditable)에도 동작하는가. 기본 false. */
  whileTyping?: boolean;
  run(): void;
}

/**
 * baseline(behaviour.json `hotkeys`)과 같은 동작:
 * - `d`: 테마 토글. 검색 입력에 `d`를 쳐도 바뀌지 않는다.
 * - Meta/Ctrl+K: 검색 열기·닫기. 입력 중에도 동작한다. Esc 닫기는 검색 다이얼로그 기본 동작.
 * - `/`: 아무것도 하지 않는다(표에 없다).
 * - Meta+B(사이드바 접기)는 두지 않는다. 의도된 baseline 차이다(R5).
 */
const HOTKEYS: Hotkey[] = [
  { key: "d", run: toggleTheme },
  { key: "k", meta: true, whileTyping: true, run: toggleSearch },
];

declare global {
  interface Window {
    __seedDocsShell?: true;
  }
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    !!target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")
  );
}

function onKeydown(event: KeyboardEvent): void {
  if (event.repeat || event.isComposing || event.defaultPrevented) return;
  const meta = event.metaKey || event.ctrlKey;
  const typing = isTyping(event.target);
  const hotkey = HOTKEYS.find(
    (item) =>
      item.key === event.key.toLowerCase() &&
      !!item.meta === meta &&
      !event.altKey &&
      (item.meta || !event.shiftKey) &&
      (item.whileTyping || !typing),
  );
  if (!hotkey) return;
  event.preventDefault();
  hotkey.run();
}

/** 배너 닫기(`Banners.astro`의 `data-banner-dismiss`). 새 소식 링크는 닫으면서 그대로 이동한다. */
function onClick(event: MouseEvent): void {
  const target =
    event.target instanceof Element ? event.target.closest("[data-banner-dismiss]") : null;
  if (target) dismissBanner(target.getAttribute("data-banner-dismiss") as BannerId);
}

/** 탭 스트립(`data-scroll-anchor`) 링크에서 시작한 이동이면 새 페이지의 같은 기준점으로 스크롤한다. */
let keepScrollAnchor = false;

function onBeforePreparation(event: Event): void {
  const source = (event as TransitionBeforePreparationEvent).sourceElement;
  keepScrollAnchor = source instanceof Element && !!source.closest("[data-scroll-anchor]");
}

function onBeforeSwap(): void {
  resetTransientUi();
}

function onAfterSwap(): void {
  // paint 전. 새 DOM 보정만 한다.
  // 맨 앞: DocsNav가 같은 task에서 새 활성 항목·섹션 목록으로 commit한다(S1-b).
  syncNavState(document);
  syncWidgets(document);
  if (keepScrollAnchor) {
    keepScrollAnchor = false;
    // 스트립은 sticky라 스스로 스크롤되지 않는다. 바로 앞의 기준점 요소로 맞춘다(기존 docs-tab-strip.tsx와 같다).
    document
      .querySelector("[data-scroll-anchor]")
      ?.previousElementSibling?.scrollIntoView({ block: "start" });
  }
}

function onPageLoad(): void {
  recordRecentPage(location.pathname, location.search.slice(1));
}

/**
 * 기존 Next `instrumentation-client.ts`와 같은 설정. key가 없는 빌드(로컬, 미리보기)에서는 받지도 않도록 동적
 * import한다.
 */
function initAnalytics(): void {
  const key = import.meta.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.init(key, {
      api_host: import.meta.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      defaults: "2026-01-30",
      person_profiles: "identified_only",
    });
  });
}

export function initShell(): void {
  if (window.__seedDocsShell) return;
  window.__seedDocsShell = true;
  installNavigationGuard(); // before-preparation: 전체 로드 경계가 먼저
  // 이 script 전에 누른 Meta/Ctrl+K(`early-search-hotkey.ts`의 head inline listener)를 넘겨받는다.
  if (takeEarlySearchRequest()) toggleSearch();
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onClick);
  document.addEventListener("astro:before-preparation", onBeforePreparation);
  document.addEventListener("astro:before-swap", onBeforeSwap);
  document.addEventListener("astro:after-swap", onAfterSwap);
  document.addEventListener("astro:page-load", onPageLoad);
  initWidgets();
  initAnalytics();
}

initShell();
