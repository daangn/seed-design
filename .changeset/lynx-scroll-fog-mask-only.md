---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

(BREAKING CHANGE: Lynx `ScrollFog`가 더 이상 내부 `scroll-view`를 렌더링하지 않습니다. 스크롤할 콘텐츠는 `<scroll-view scroll-orientation="vertical">` 또는 `"horizontal"`로 감싸 `ScrollFog` 안에 두세요. `ChipTabsList`처럼 스크롤을 소유한 컴포넌트는 그대로 감싸면 됩니다. `placement`는 세로(`top`·`bottom`) 또는 가로(`left`·`right`) 중 한 축의 방향만 받으며, 두 축을 섞은 값은 타입 오류가 됩니다. `hideScrollBar`는 제거되었으므로 자식 `<scroll-view>`에 `scroll-bar-enable={false}`를 지정하세요. Recipe `@seed-design/lynx-css/recipes/scroll-fog`의 `verticalScroll`·`horizontalScroll` slot과 mask slot의 `pointer-events: none`도 제거되었습니다.) Lynx `ScrollFog`는 지정한 edge의 mask만 적용하므로, 스크롤 host가 하나만 남고 소비자가 `<scroll-view>`의 ref·이벤트·스크롤바를 직접 제어할 수 있습니다.
