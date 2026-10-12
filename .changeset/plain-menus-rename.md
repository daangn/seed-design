---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `SwipeableMenuSheet`를 `MenuSheet`로, `SwipeableMenuSheetCloseReason`을 `MenuSheetOpenChangeReason`으로 바꾸고 모든 `SwipeableMenuSheet*` 타입과 part를 `MenuSheet*`로 바꿔야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:menu-sheet`로 새 snippet을 설치하고 `ui:swipeable-menu-sheet` 호출부와 파일을 제거해야 합니다.)

메뉴 시트의 공개 이름을 `SwipeableMenuSheet*`에서 `MenuSheet*`로 변경합니다.

- 이전 컴포넌트·part·Props 타입 이름은 더 이상 export하지 않으며, 닫힘 사유 타입 `SwipeableMenuSheetCloseReason`은 `MenuSheetOpenChangeReason`으로 바뀝니다.
- Registry snippet도 `ui:swipeable-menu-sheet`에서 `ui:menu-sheet`으로 바뀝니다. CSS Recipe 이름 `menuSheet`과 `seed-menu-sheet-*` class는 그대로입니다.
