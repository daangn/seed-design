---
"@seed-design/lynx-react-keyboard-avoiding-scroll-view": minor
---

Lynx KeyboardAvoidingScrollView를 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-keyboard-avoiding-scroll-view`를 추가합니다. `KeyboardAvoidingScrollView.Root`는 키보드 상태를 구독하고 `Content`와 `Footer`를 세로로 배치합니다. `Content`는 세로 `<scroll-view>`와 하단 spacer로 focus된 입력을 키보드와 Footer 위에 보이게 하고, `Footer`는 키보드가 Root 아래쪽을 가린 높이만큼 올라가 키보드 바로 위에 붙습니다. Footer는 키보드 애니메이션에 맞춘 기본 `transition`으로 움직이며, `style.transition`으로 바꿀 수 있습니다. native 입력은 `useKeyboardAvoidingScrollViewContext({ strict })`로 `focus`·`blur`·`layoutChanged`·`unregister`를 호출하며, disabled·readOnly 입력은 `enabled: false`로 등록해 회피에서 제외합니다. Footer 안에서 등록한 입력은 Content를 스크롤하지 않습니다. 안쪽 입력에는 Lynx `avoid-keyboard`를 함께 지정하지 않습니다.
