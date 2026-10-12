---
"@seed-design/lynx-react": major
"@seed-design/lynx-react-toggle": minor
---

(BREAKING CHANGE: `Accordion.Trigger`의 `accessibility-value`를 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 변경하고, `accessibility-traits` 사용을 제거해야 합니다. `accessibility-traits`를 직접 덮어쓰는 대체 API는 제공하지 않습니다.)

Lynx 컴포넌트가 일부만 받던 native 속성을 각 파트가 렌더링하는 요소의 속성으로 확장하며, 상태를 알리는 일부 접근성 값은 컴포넌트 상태를 따르도록 변경합니다.

- 각 파트의 native 요소에 맞는 `id`·`accessibility-*`·`bind*`·`main-thread:*`·`data-*`와 `ref`를 전달할 수 있습니다. `BottomSheet`·`MenuSheet`의 파트와 `AttachmentInput.Root`도 지원하며, `Box`의 터치 handler는 이벤트 인자를 받습니다.
- 일반 속성은 사용자 값이 기본값보다 우선합니다. `className`은 합치고 `style`은 key 단위로 합치며, 이벤트 handler와 `ref`는 내부 값과 함께 실행합니다.
- 이전에는 `Accordion.Trigger`의 `accessibility-value`·`accessibility-traits`를 직접 덮어쓸 수 있었습니다. 이제 열림·비활성 상태에 맞는 값을 유지하고, 열림 상태 문구만 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 지정합니다.
- 비활성 또는 로딩 중 탭을 차단하는 컴포넌트의 `bindtap`·`main-thread:bindtap`은 기존처럼 호출하지 않습니다. `QuantityPicker.DecrementButton`의 삭제 상태 문구도 기존처럼 `Root.removeAccessibilityLabel`로 지정합니다.
