---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `Select.Content`를 `Select.Positioner > Select.Content > Select.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Select.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. `select` Recipe의 `backdrop` slot을 직접 사용했다면 바깥 탭 영역을 `Select.Positioner`로 옮겨야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:select`로 재설치해야 합니다.)

`Select`의 선택 목록을 기본 native overlay에서 Lynx view 안의 고정 레이어로 변경하고, 레이어와 스크롤 영역을 별도 파트로 분리합니다.

- 이전에는 `Content`가 레이어와 스크롤 영역을 함께 제공했습니다. 이제 `Positioner`가 레이어와 바깥 탭 영역을, `ScrollArea`가 스크롤 영역을 담당합니다.
- `container`를 지정하지 않으면 Android 뒤로 가기로 목록이 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다. native container를 지정하면 기존 동작을 사용할 수 있습니다.
- `select` Recipe의 `backdrop` slot을 제거합니다.
