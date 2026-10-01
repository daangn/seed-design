---
"@seed-design/lynx-react-bottom-sheet": minor
---

(BREAKING CHANGE: Root ref로 바꾼 열림 상태는 더 이상 `onOpenChange`로 알리지 않습니다. `open`을 제어하면 Trigger·Backdrop·CloseButton은 `onOpenChange`만 호출하고, 시트는 바뀐 `open` 값을 따릅니다.) `onOpenChange`의 두 번째 인자로 `{ reason }`(`"trigger"`·`"closeButton"`·`"interactOutside"`·`"drag"`)을 전달합니다. 시트를 닫는 `CloseButton`과 `useBottomSheetCloseButton`을 추가하고, context에 `setOpen(open, { reason })`을 추가합니다.
