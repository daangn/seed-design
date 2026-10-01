---
"@seed-design/lynx-react-menu": minor
---

SEED 스타일 없이 Lynx 메뉴를 조합하는 `@seed-design/lynx-react-menu`를 추가합니다. React `@seed-design/react-menu`와 같은 `Root`·`Anchor`·`Trigger`·`Positioner`·`Content`·`Group`·`GroupLabel`·`Item` 파트와 `useMenu`·`useMenuItem`으로 controlled·uncontrolled 열림 상태, 비활성화, Trigger·Item 탭과 `onOpenChange` reason(`trigger`·`interactOutside`·`itemClick`·`dismiss`), 접근성과 ref, 콘텐츠 측정과 위치 계산을 제공합니다. Context는 `MenuProvider`·`useMenuContext({ strict })`, `MenuItemProvider`·`useMenuItemContext({ strict })`로 공개합니다. `Positioner`는 lynx-ui `OverlayView`를 사용하며 `container`를 지정하면 native overlay에 렌더링합니다. `Content`는 위치 계산을 마치기 전에 숨기고, 계산한 높이를 `maxHeight`로 적용하며, 닫힘 전환 신호가 없어도 200ms 뒤 정리합니다.
