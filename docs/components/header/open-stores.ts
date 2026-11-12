import { useSyncExternalStore } from "react";

/**
 * island 사이에서 나누는 열림 상태. island끼리는 React context를 나누지 못하지만 같은 JS 모듈은 공유한다.
 * 서버와 hydration 때는 늘 닫힌 상태다.
 */
function createOpenStore() {
  let open = false;
  const listeners = new Set<() => void>();
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    set(next: boolean | ((open: boolean) => boolean)) {
      const value = typeof next === "function" ? next(open) : next;
      if (value === open) return;
      open = value;
      for (const listener of listeners) listener();
    },
    useOpen() {
      return useSyncExternalStore(
        subscribe,
        () => open,
        () => false,
      );
    },
  };
}

/** 검색 창. 헤더의 검색 버튼이 열고 검색 island(`components/search/docs-search.tsx`)가 그린다. */
export const searchOpenStore = createOpenStore();

/** 모바일 메뉴 패널. 헤더의 메뉴 버튼이 열고 내비게이션 island가 그린다. */
export const mobileNavOpenStore = createOpenStore();
