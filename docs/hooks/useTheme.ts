"use client";

import { useSyncExternalStore } from "react";

export type ColorMode = "system" | "light-only" | "dark-only";
export type UserColorScheme = "light" | "dark";

export interface ThemeInfo {
  colorMode: ColorMode;
  userColorScheme: UserColorScheme;
}

// 서버에는 `<html>`이 없어 `Layout.astro`의 정적 값과 같은 기본값으로 그린다.
const SERVER_THEME_INFO: ThemeInfo = {
  colorMode: "system",
  userColorScheme: "light",
};

let snapshot = SERVER_THEME_INFO;

function getSnapshot(): ThemeInfo {
  const colorMode = document.documentElement.getAttribute("data-seed-color-mode") as ColorMode;
  const userColorScheme = document.documentElement.getAttribute("data-seed-user-color-scheme");
  const next: ThemeInfo = {
    colorMode: colorMode || "system",
    userColorScheme: userColorScheme === "dark" ? "dark" : "light",
  };

  // `useSyncExternalStore`는 값이 바뀌지 않았으면 같은 객체를 받아야 다시 그리지 않는다.
  if (next.colorMode !== snapshot.colorMode || next.userColorScheme !== snapshot.userColorScheme) {
    snapshot = next;
  }
  return snapshot;
}

function getServerSnapshot(): ThemeInfo {
  return SERVER_THEME_INFO;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-seed-color-mode", "data-seed-user-color-scheme"],
  });
  return () => observer.disconnect();
}

/**
 * `<html>`의 SEED 테마 속성을 읽는다. hydrate할 때는 서버와 같은 기본값으로 그린 뒤 실제 값으로 다시 그린다.
 * 처음부터 실제 값을 쓰면 다크 모드에서 서버 HTML과 달라 React가 island 전체를 새로 그린다(React error #418).
 * 클라이언트 이동에서는 그때 사이드바 스크롤 위치와 예제 상태가 사라진다.
 */
export function useTheme(): ThemeInfo {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
