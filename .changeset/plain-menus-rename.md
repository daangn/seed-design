---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: Lynx `SwipeableMenuSheet`의 이름을 `MenuSheet`로 바꿉니다. `SwipeableMenuSheet*` export와 namespace는 `MenuSheet*`·`MenuSheet`로, Registry `ui:swipeable-menu-sheet`는 `ui:menu-sheet`로 옮깁니다. BottomSheet·MenuSheet의 Root ref로 바꾼 열림 상태는 `onOpenChange`로 알리지 않습니다.) BottomSheet `onOpenChange`가 `{ reason }`을 전달합니다. MenuSheet를 연 상태에서 Trigger를 다시 탭한 뒤 drag로 닫으면, 이제 `"trigger"`가 아니라 `"drag"`가 전달됩니다. Registry `MenuSheetContent`는 `container`·`overlayLevel`을 받습니다.
