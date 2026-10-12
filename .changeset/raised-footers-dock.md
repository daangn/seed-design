---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `<KeyboardAvoidingScrollView>`를 `<KeyboardAvoidingScrollView.Root>`와 그 안의 `<KeyboardAvoidingScrollView.Content>`로 변경해야 합니다. `KeyboardAvoidingScrollViewProps`는 `KeyboardAvoidingScrollViewRootProps`·`KeyboardAvoidingScrollViewContentProps`로 변경해야 합니다. `keyboardGap`·`scrollBehavior`와 바깥 높이는 `Root`에, 안쪽 여백·스크롤 ref·`<scroll-view>` 속성과 이벤트는 `Content`에 전달해야 합니다.)

하나의 컴포넌트가 키보드 회피와 스크롤을 함께 처리하던 구조를 바깥 레이아웃인 `Root`와 스크롤 영역인 `Content`로 나눕니다.

- `Root`는 키보드에 맞춰 영역을 배치하고, `Content`가 실제 스크롤과 입력 위치 이동을 담당합니다.
- 새 `KeyboardAvoidingScrollView.Footer`에는 스크롤 내용과 별도로 키보드 위에 고정할 하단 버튼을 배치할 수 있습니다.
