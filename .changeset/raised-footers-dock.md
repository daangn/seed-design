---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `<KeyboardAvoidingScrollView>`를 `<KeyboardAvoidingScrollView.Root>`와 그 안의 `<KeyboardAvoidingScrollView.Content>`로 변경해야 합니다. `KeyboardAvoidingScrollViewProps`는 `KeyboardAvoidingScrollViewRootProps`·`KeyboardAvoidingScrollViewContentProps`로 변경해야 합니다.) 키보드 회피 영역을 바깥 레이아웃과 스크롤 영역으로 나눕니다.

`keyboardGap`·`scrollBehavior`와 바깥 높이는 `Root`에 전달합니다. 안쪽 여백, 스크롤 ref, `<scroll-view>` 속성과 이벤트 핸들러는 `Content`에 전달합니다. 키보드 위에 고정할 하단 버튼은 새 `KeyboardAvoidingScrollView.Footer`에 배치할 수 있습니다.
