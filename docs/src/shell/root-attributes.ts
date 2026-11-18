/**
 * `<html>`에 클라이언트가 붙이는 속성의 단일 소유자: 테마와 배너 표시.
 *
 * 왜 한 모듈인가: ClientRouter의 `swapRootAttributes`는 현재 `<html>` 속성을 지우고 새 문서의 속성으로 덮는다.
 * 그래서 클라이언트가 붙인 속성은 모두 "첫 paint 전 적용"과 "swap 직전 새 문서에 재적용"이 필요하다. 이 두 경로와
 * 쓰기(토글·닫기)를 한 곳에 둔다. 기존 next-themes + ThemeSync + Fumadocs ThemeHotKey 세 갈래를 대체한다.
 *
 * 속성 계약(기존 Next 사이트와 같다 — baseline behaviour.md「Theme」)
 * - `class="light" | "dark"`(Tailwind `dark:` variant), `style="color-scheme: light|dark"`,
 *   `data-seed-user-color-scheme="light|dark"`(SEED 토큰). `data-seed-color-mode="system"`은 서버 고정값.
 * - localStorage `theme` = "light" | "dark"(그 밖의 값·없음 = 시스템 선호를 따른다).
 * - `<html data-theme-locked="light">`(landing, Phase 4)이면 저장값과 무관하게 그 테마이고 토글은 아무것도 하지 않는다.
 * - 배너: `data-banner-latest`(프리뷰·이전 버전 안내, `Banners.astro`), `data-banner-announcement`(기간 한정 새 소식).
 *   배너 마크업은 정적이고 CSS가 이 속성으로 보인다(자리 예약도 속성 기준이라 CLS가 없다).
 *
 * 로직은 한 벌이다. head inline script는 아래 `bootstrap` 함수의 소스(`Function.prototype.toString`)와 설정 JSON으로
 * 만들고, 실행 뒤 `window.__seedRootAttributes.apply`를 남긴다. `toggleTheme`·`dismissBanner`는 저장만 하고 그
 * `apply`를 부른다. 그래서 `bootstrap`은 import·closure 밖 값·TS 전용 런타임 문법을 쓰지 않는다.
 */
import { archivePaths } from "../../lib/docs-archive";
import { SITE_ANNOUNCEMENT_BANNER } from "../../components/site-announcement-banner-config";

export const THEME_STORAGE_KEY = "theme";

interface BootstrapConfig {
  themeKey: string;
  latest: {
    /** archive 빌드면 항상 보인다. */
    archive: boolean;
    /** 이 host에서는 숨긴다(정식 사이트와 로컬). */
    hiddenHosts: string[];
    /** 이 접미사로 끝나는 host도 숨긴다(로컬 개발 도메인). */
    hiddenHostSuffixes: string[];
    /** 닫힘 저장 키. fumadocs `Banner id="latest-version"`의 키를 그대로 써 기존 닫힘을 유지한다. */
    dismissKey: string;
  };
  announcement: {
    enabled: boolean;
    startDate: string | null;
    endDate: string | null;
    dismissKey: string;
  };
}

export interface RootAttributesApi {
  apply(root: HTMLElement): void;
}

declare global {
  interface Window {
    __seedRootAttributes?: RootAttributesApi;
  }
}

/**
 * self-contained. inline으로 한 번 실행된다(같은 본문이라 이후 페이지에서는 ClientRouter가 다시 실행하지 않는다).
 * 배포로 inline 본문이 바뀌어 swap 뒤 새 본문이 같은 realm에서 실행될 수 있다 → `window` 플래그로 막는다.
 */
function bootstrap(config: BootstrapConfig): void {
  if (window.__seedRootAttributes) return;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const read = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const today = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };
  const toggle = (root: HTMLElement, name: string, on: boolean) => {
    if (on) root.setAttribute(name, "");
    else root.removeAttribute(name);
  };
  const apply = (root: HTMLElement) => {
    const stored = read(config.themeKey);
    const theme =
      root.getAttribute("data-theme-locked") ||
      (stored === "light" || stored === "dark" ? stored : media.matches ? "dark" : "light");
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    root.setAttribute("data-seed-user-color-scheme", theme);

    const host = window.location.hostname;
    const latest = config.latest;
    toggle(
      root,
      "data-banner-latest",
      (latest.archive ||
        !(
          latest.hiddenHosts.includes(host) ||
          latest.hiddenHostSuffixes.some((suffix) => host.endsWith(suffix))
        )) &&
        read(latest.dismissKey) !== "true",
    );
    const announcement = config.announcement;
    const date = today();
    toggle(
      root,
      "data-banner-announcement",
      announcement.enabled &&
        (!announcement.startDate || date >= announcement.startDate) &&
        (!announcement.endDate || date <= announcement.endDate) &&
        read(announcement.dismissKey) !== "true",
    );
  };
  window.__seedRootAttributes = { apply };
  apply(document.documentElement);
  document.addEventListener("astro:before-swap", (event) => {
    apply((event as Event & { newDocument: Document }).newDocument.documentElement);
  });
  media.addEventListener("change", () => apply(document.documentElement));
}

const BANNER_KEYS = {
  latest: "nd-banner-nrqxizltoqwxmzlsonuw63q", // fumadocs Banner의 `nd-banner-${base32("latest-version")}`
  announcement: `seed-site-announcement-dismissed:${SITE_ANNOUNCEMENT_BANNER.id}`,
} as const;

export type BannerId = keyof typeof BANNER_KEYS;

/** `<head>`의 `<script is:inline set:html={...}>`에 넣을 문자열. 빌드 때 한 번 계산한다. */
export function rootAttributesBootstrap(): string {
  const config: BootstrapConfig = {
    themeKey: THEME_STORAGE_KEY,
    latest: {
      archive: !!archivePaths.prefix,
      hiddenHosts: ["seed-design.io", "v3.seed-design.io", "localhost", "127.0.0.1"],
      hiddenHostSuffixes: [".localhost", ".test"],
      dismissKey: BANNER_KEYS.latest,
    },
    announcement: {
      enabled: SITE_ANNOUNCEMENT_BANNER.enabled,
      startDate: SITE_ANNOUNCEMENT_BANNER.startDate ?? null,
      endDate: SITE_ANNOUNCEMENT_BANNER.endDate ?? null,
      dismissKey: BANNER_KEYS.announcement,
    },
  };
  return `(${bootstrap.toString()})(${JSON.stringify(config)});`;
}

function reapply(): void {
  window.__seedRootAttributes?.apply(document.documentElement);
}

/**
 * `d` 단축키와 헤더 버튼이 부른다. 저장 → 적용. transition을 끄지 않는다 → 요소가 이미 선언한 색 transition
 * (`transition-colors` 150ms, SEED recipe 등)이 그대로 걸린다. 기존 Next 사이트의 실제 동작과 같다: next-themes
 * `disableTransitionOnChange`는 `transition:none`을 넣었다가 1ms 뒤 지웠지만 그 사이 style을 확정하지 않아(값을 읽지 않는
 * `getComputedStyle`) 사용자 입력에서는 다음 style 계산 때 이미 지워져 있었다. 첫 로드(paint 전 bootstrap)와 이동
 * (swap 전 새 문서에 적용)은 바뀌기 전 style이 없어 transition이 걸리지 않는다.
 */
export function toggleTheme(): void {
  const root = document.documentElement;
  if (root.hasAttribute("data-theme-locked")) return;
  const next = root.getAttribute("data-seed-user-color-scheme") === "dark" ? "light" : "dark";
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // 저장할 수 없어도 이 문서에는 적용한다.
  }
  reapply();
}

/** 배너 닫기. 저장 → `<html>` 속성 → CSS가 배너를 숨긴다. */
export function dismissBanner(id: BannerId): void {
  try {
    window.localStorage.setItem(BANNER_KEYS[id], "true");
  } catch {
    // 저장할 수 없으면 이 문서에서만 숨긴다.
    document.documentElement.removeAttribute(`data-banner-${id}`);
    return;
  }
  reapply();
}
