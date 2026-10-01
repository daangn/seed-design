---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: Lynx Menu는 기본으로 native overlay 대신 Lynx view 안의 고정 `view` 레이어에 렌더링합니다. 이전처럼 Lynx view 밖까지 덮으려면 `container`를 지정하세요. `container`가 없으면 `onOpenChange`에 `"dismiss"` reason이 오지 않고, Android 뒤로 가기는 Menu가 아니라 host 화면을 닫습니다. Primitive `Menu.Content`는 더 이상 레이어와 스크롤 영역을 만들지 않습니다. 직접 조립했다면 `Menu.Positioner > Menu.Content > Menu.ScrollArea`로 바꾸세요.) Menu 동작을 `@seed-design/lynx-react-menu` 위에 다시 구성합니다. 새 `Menu.Positioner`는 `container`·`overlayLevel`·`overlayViewProps`를 받고, `container`가 없을 때 z-index `99`로 같은 화면의 형제 요소 위에 그립니다. `container`를 지정하면 backdrop이 바깥 탭을 받도록 overlay 레이어의 `event-through` 기본값을 `false`로 둡니다. Registry `ui:menu`의 `MenuContent`는 Positioner·Content·ScrollArea를 조립하고 `container`·`overlayLevel`을 받습니다. `npx @seed-design/cli@latest add ui:menu`로 스니펫을 갱신할 수 있습니다.
