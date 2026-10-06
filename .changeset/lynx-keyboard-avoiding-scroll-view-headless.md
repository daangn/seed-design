---
"@seed-design/lynx-react-keyboard-avoiding-scroll-view": minor
"@seed-design/lynx-react": patch
---

Lynx KeyboardAvoidingScrollView를 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-keyboard-avoiding-scroll-view`를 추가합니다. `KeyboardAvoidingScrollView.Root`는 세로 `<scroll-view>`와 하단 spacer를 렌더링하고, 직접 만든 scroll host는 `useKeyboardAvoidingScrollView`의 props를 펼쳐 같은 회피 동작을 사용합니다. native 입력은 React Headless와 같은 `useKeyboardAvoidingScrollViewContext({ strict })`로 `focus`·`blur`·`layoutChanged`·`unregister`를 호출하며, disabled·readOnly 입력은 `enabled: false`로 등록해 회피에서 제외합니다. `@seed-design/lynx-react` KeyboardAvoidingScrollView는 사용법과 렌더링 결과를 유지하며 이 패키지를 그대로 사용합니다. 안쪽 입력에는 Lynx `avoid-keyboard`를 함께 지정하지 않습니다.
