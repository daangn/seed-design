---
"@seed-design/lynx-react-keyboard-avoiding-scroll-view": minor
---

키보드에 가려지는 입력과 하단 버튼을 배치할 수 있는 `@seed-design/lynx-react-keyboard-avoiding-scroll-view`를 추가합니다.

- `KeyboardAvoidingScrollView.Root` 안에 `Content`·`Footer`를 조합하고, scroll ref·prop·event는 `Content`에 전달합니다.
- `useKeyboardAvoidingScrollViewContext`로 등록한 `Content` 안의 입력이 포커스되면 키보드와 하단 영역 위로 스크롤합니다. `Footer`는 키보드 바로 위로 이동하며, 그 안의 입력은 `Content`를 스크롤하지 않습니다.
- `Root`의 `keyboardGap`·`scrollBehavior`로 회피 간격과 이동 방식을 지정합니다.
- 내부 입력의 Lynx `avoid-keyboard`와 함께 사용하지 않습니다.
