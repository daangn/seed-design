---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `Menu.Content`를 `Menu.Positioner > Menu.Content > Menu.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Menu.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:menu`로 재설치해야 합니다.) 메뉴는 기본적으로 Lynx view 안의 고정 레이어에 표시합니다.

`container`를 지정하지 않으면 Android 뒤로 가기로 메뉴가 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다. `menu` Recipe의 `backdrop` slot을 제거하므로 바깥 탭 영역은 `Menu.Positioner`를 사용해야 합니다.
