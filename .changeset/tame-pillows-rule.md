---
"@seed-design/react-prevent-scroll": minor
"@seed-design/react-drawer": minor
"@seed-design/react-dialog": minor
"@seed-design/react-dismissible-layer": minor
---

(BREAKING CHANGE: Drawer/BottomSheet의 `noBodyStyles`, `preventScrollRestoration` prop을 제거하세요.) Dialog와 Drawer(BottomSheet)의 모달 body 스크롤 잠금을 새로운 `usePreventScroll`(`@seed-design/react-prevent-scroll`) 기반으로 교체합니다.

- 모달이 열려 있는 동안 배경 스크롤이 안정적으로 잠기며, 기존 vaul 기반 body position-fixed 방식을 대체합니다.
- `dismissible-layer`는 backdrop-only 모델로 전환되어 더 이상 body의 pointer-events를 차단하지 않습니다.
- 제거되는 `noBodyStyles`, `preventScrollRestoration`은 새 스크롤 잠금이 기존 기본 동작(`noBodyStyles=true`, `preventScrollRestoration=false`)을 그대로 대체합니다.
