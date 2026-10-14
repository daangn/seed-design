---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx Bottom Sheet에 닫기 버튼을 추가합니다.

- `BottomSheet.CloseButton`을 탭하면 시트가 닫히고 `onOpenChange`에 `"closeButton"` reason이 전달됩니다.
- CloseButton이 렌더링되는 동안 Title이 버튼 자리만큼 여백을 둡니다.
- Registry `BottomSheetContent`에 `showCloseButton`(기본값 `true`)을 추가했습니다. `npx @seed-design/cli@latest add ui:bottom-sheet`로 다시 설치해야 적용됩니다.
