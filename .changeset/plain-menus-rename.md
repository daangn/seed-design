---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `SwipeableMenuSheet`를 `MenuSheet`로, `SwipeableMenuSheetCloseReason`을 `MenuSheetOpenChangeReason`으로 바꾸고 모든 `SwipeableMenuSheet*` 타입과 part를 `MenuSheet*`로 바꿔야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:menu-sheet`로 새 snippet을 설치하고 `ui:swipeable-menu-sheet` 호출부와 파일을 제거해야 합니다.) `SwipeableMenuSheet`의 공개 이름을 `MenuSheet`로 변경합니다.
