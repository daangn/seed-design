---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `ScrollFog` 안의 콘텐츠를 직접 `<scroll-view scroll-orientation="vertical">` 또는 `<scroll-view scroll-orientation="horizontal">`로 감싸야 합니다. 자식이 이미 스크롤을 처리하면 추가로 감싸지 않습니다. `hideScrollBar` 대신 자식 `<scroll-view>`에 `scroll-bar-enable={false}`를 지정하고, `placement`에는 세로 또는 가로 한 축의 방향만 지정해야 합니다. `@seed-design/lynx-css/recipes/scroll-fog`를 직접 사용한다면 제거된 `verticalScroll`·`horizontalScroll` slot에 의존하는 코드를 삭제해야 합니다.) Lynx `ScrollFog`는 지정한 가장자리의 mask만 렌더링하며, 스크롤 ref·이벤트·스크롤바는 자식 `<scroll-view>`에서 제어합니다.
