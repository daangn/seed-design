---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `Select.Content`를 `Select.Positioner > Select.Content > Select.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Select.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:select`로 재설치해야 합니다.) 선택 목록은 기본적으로 Lynx view 안의 고정 레이어에 표시합니다.

`container`를 지정하지 않으면 Android 뒤로 가기로 목록이 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다. `select` Recipe의 `backdrop` slot을 제거하므로 바깥 탭 영역은 `Select.Positioner`를 사용해야 합니다.
