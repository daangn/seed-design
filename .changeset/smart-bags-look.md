---
"@seed-design/css": patch
---

[BottomSheetContent](/react/components/bottom-sheet)와 [MenuSheetContent](/react/components/menu-sheet)가 기본적으로 bottom safe area만큼 하단 padding을 갖도록 수정합니다.

- 별도로 safe area padding을 지정하는 경우 제거할 수 있습니다. BottomSheetContent 내부에서의 `<VStack paddingBottom="safeArea">` 등
