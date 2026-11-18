import { useState } from "react";

/**
 * 메뉴 module(SEED Menu·NavigationMenu와 floating-ui, 약 30KB gzip)을 첫 로드에 받지 않고 사용자가 버튼에 다가갈 때 받기
 * 위한 상태. 서버 HTML과 hydrate는 같은 모양의 정적 버튼(`triggerProps`를 단 것)이고, `requested`가 true가 되면 호출부가
 * `React.lazy` 메뉴를 그 버튼 대신 그린다(`Suspense` fallback도 같은 버튼이다).
 *
 * - `"click"`(누르면 여는 메뉴): 포인터가 올라오거나 focus를 받으면 module만 미리 받고(`preload`), 누르면 바꿔 그리며
 *   메뉴가 열린 채로 시작한다(`clicked`). 누르는 도중(pointerdown과 click 사이)에 버튼이 바뀌면 click이 사라지므로
 *   누르기 전에는 바꾸지 않는다.
 * - `"hover"`(포인터를 올리면 여는 메뉴): 포인터가 올라오거나 focus를 받으면 바로 바꿔 그린다. 받았을 때 포인터가 아직
 *   위에 있거나(`hovering`) 이미 눌렀으면 열린 채로 시작한다. 정적 버튼에 focus가 있었으면(`focused`) 메뉴 버튼에
 *   `autoFocus`를 넘겨 focus를 잃지 않게 한다.
 */
export function useMenuIntent(mode: "click" | "hover", preload: () => unknown) {
  const [state, setState] = useState({
    requested: false,
    clicked: false,
    hovering: false,
    focused: false,
  });
  const approach = (patch: Partial<typeof state>) => {
    if (mode === "click") {
      void preload();
      return;
    }
    setState((s) => ({ ...s, requested: true, ...patch }));
  };
  return {
    ...state,
    triggerProps: {
      onPointerEnter: () => approach({ hovering: true }),
      onPointerLeave: () => setState((s) => (s.hovering ? { ...s, hovering: false } : s)),
      onFocus: () => approach({ focused: true }),
      onBlur: () => setState((s) => (s.focused ? { ...s, focused: false } : s)),
      onClick: () => setState((s) => ({ ...s, requested: true, clicked: true })),
    },
  };
}
