---
"@seed-design/react": patch
"@seed-design/react-drawer": patch
---

(BREAKING CHANGE: `nested` prop을 사용하는 코드에서 해당 prop을 삭제해야 합니다.) Drawer의 동작에 영향을 주지 않던 dead prop인 `nested`를 제거합니다. 이 prop을 노출하는 Drawer 기반 컴포넌트에도 적용되며, 대체 prop은 필요하지 않습니다.
