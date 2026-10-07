---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `<KeyboardAvoidingScrollView>`를 `<KeyboardAvoidingScrollView.Root>`와 그 안의 `<KeyboardAvoidingScrollView.Content>`로 바꿔야 합니다. `keyboardGap`·`scrollBehavior`와 높이 지정은 Root에, 안쪽 여백·scroll-view 속성·`bind*` handler는 Content에 넘기세요. `KeyboardAvoidingScrollViewProps` 타입은 `KeyboardAvoidingScrollViewRootProps`·`KeyboardAvoidingScrollViewContentProps`로 나뉩니다.) 키보드 바로 위에 붙는 하단 영역 `KeyboardAvoidingScrollView.Footer`를 추가합니다. 하단 버튼을 Footer에 두면 키보드가 열릴 때 키보드 위로 올라가고, Content의 focus된 입력은 Footer와 `keyboardGap`만큼 떨어지도록 스크롤합니다.
