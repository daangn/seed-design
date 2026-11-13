"use client";

import { createContext, use } from "react";

/**
 * 결과 행·최근 페이지·컴포넌트·토큰 블록이 항목을 골랐을 때 부르는 함수. 다이얼로그(`search.tsx`)가 닫기와 이동을
 * 함께 묶어 내려준다. 이동은 문서 셸의 ClientRouter(`astro:transitions/client`의 `navigate`)가 맡고, ClientRouter가
 * 없는 문서(landing)에서는 같은 함수가 전체 로드로 넘긴다.
 */
export const SelectResultContext = createContext<(url: string) => void>(() => {});

export function useSelectResult(): (url: string) => void {
  return use(SelectResultContext);
}
