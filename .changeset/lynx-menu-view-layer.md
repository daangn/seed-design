---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `Menu.Content`를 `Menu.Positioner > Menu.Content > Menu.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Menu.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. `menu` Recipe의 `backdrop` 대신 `positioner`를 바깥 탭 영역에 사용해야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:menu`로 재설치해야 합니다.)

`Menu.Content`가 만들던 레이어와 스크롤 영역을 `Menu.Positioner`·`Menu.ScrollArea`로 분리합니다.

- 이전에는 `Content`만으로 native overlay와 스크롤 영역을 만들었습니다. 이제 `Positioner`가 레이어를, `Content`가 메뉴 표면을, `ScrollArea`가 목록의 스크롤 영역을 만듭니다.
- 기본 레이어는 native overlay에서 Lynx view 안의 고정 레이어로 바뀝니다. `container`를 지정하면 기존처럼 host 전체를 덮는 native overlay를 사용합니다.
- `container`가 없는 기본 레이어에서는 Android 뒤로 가기로 메뉴가 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다.
- 바깥 탭은 `Positioner`가 처리하므로 `menu` Recipe의 `backdrop` slot을 제거합니다. 최신 Registry snippet은 새 파트 구조를 조합합니다.
