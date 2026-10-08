---
"@seed-design/lynx-react": major
"@seed-design/lynx-react-toggle": minor
---

(BREAKING CHANGE: `Accordion.Trigger`의 `accessibility-value`를 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 변경하고, `accessibility-traits` 사용을 제거해야 합니다. `accessibility-traits`를 직접 덮어쓰는 대체 API는 제공하지 않습니다.) Lynx 컴포넌트의 각 파트에 native 요소의 속성을 전달할 수 있습니다.

- `<view>`, `<text>`, `<image>`, `<scroll-view>`, `<input>`, `<textarea>` 등에 `id`, `accessibility-*`, `bind*`, `main-thread:*`, `data-*`와 `ref`를 타입 오류 없이 전달할 수 있습니다.
- 컴포넌트가 정한 기본 속성보다 사용자 값이 우선합니다. `className`은 합치고, `style`은 key 단위로 합치며, 이벤트 handler와 `ref`는 내부 값과 함께 실행합니다.
- 직접 덮어쓸 수 없는 상태 접근성 속성은 컴포넌트 상태를 따릅니다. `QuantityPicker.DecrementButton`의 삭제 상태 문구는 기존처럼 `Root`의 `removeAccessibilityLabel`로 지정합니다.
- `BottomSheet`의 `Trigger`·`Header`·`Body`·`Footer`·`Title`·`Description`, `MenuSheet` 슬롯, `AttachmentInput.Root`에도 native 속성을 전달할 수 있습니다.
- `Box`의 `bindtouchstart`·`bindtouchend`·`bindtouchcancel` handler에서 터치 이벤트 인자를 받을 수 있습니다.
- 비활성 또는 로딩 중 탭을 차단하는 컴포넌트의 `bindtap`·`main-thread:bindtap`은 기존처럼 호출하지 않습니다.
