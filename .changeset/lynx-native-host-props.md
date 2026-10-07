---
"@seed-design/lynx-react": minor
"@seed-design/lynx-react-accordion": minor
"@seed-design/lynx-react-action-button": minor
"@seed-design/lynx-react-app-bar": minor
"@seed-design/lynx-react-attachment-display": minor
"@seed-design/lynx-react-bottom-sheet": minor
"@seed-design/lynx-react-callout": minor
"@seed-design/lynx-react-checkbox": minor
"@seed-design/lynx-react-collapsible": minor
"@seed-design/lynx-react-dialog": minor
"@seed-design/lynx-react-field-button": minor
"@seed-design/lynx-react-file-upload": minor
"@seed-design/lynx-react-keyboard-avoiding-scroll-view": minor
"@seed-design/lynx-react-loop-scroll": minor
"@seed-design/lynx-react-menu": minor
"@seed-design/lynx-react-page-banner": minor
"@seed-design/lynx-react-popover": minor
"@seed-design/lynx-react-pull-to-refresh": minor
"@seed-design/lynx-react-quantity-picker": minor
"@seed-design/lynx-react-radio-group": minor
"@seed-design/lynx-react-segmented-control": minor
"@seed-design/lynx-react-select": minor
"@seed-design/lynx-react-slider": minor
"@seed-design/lynx-react-sortable": minor
"@seed-design/lynx-react-tabs": minor
"@seed-design/lynx-react-text-field": minor
"@seed-design/lynx-react-toggle": minor
---

Lynx 컴포넌트의 각 파트가 렌더링하는 native 요소(`<view>`, `<text>`, `<image>`, `<scroll-view>`, `<input>`, `<textarea>` 등)의 속성을 공개 타입으로 받고 그대로 전달합니다.

- `id`, `accessibility-*`, `bind*`·`main-thread:*` 이벤트와 ref, `data-*` 등을 타입 오류 없이 넘길 수 있습니다. 공유 타입 `LynxHostProps<"view">`를 추가합니다.
- 컴포넌트가 정한 값(접근성 기본값, `flatten`, `src`·`mode`, `scroll-orientation`, 계산한 style key 등)과 같은 속성을 넘기면 넘긴 값이 이깁니다. `className`은 합치고, `style`은 key 단위로 합치며, 이벤트 handler와 ref는 내부 handler·ref와 함께 실행됩니다.
- 일부 속성만 전달하던 `BottomSheet`의 Trigger·Header·Body·Footer·Title·Description, `MenuSheet` 슬롯, `AttachmentInput` Root도 모든 속성을 전달합니다.
- 비활성·로딩 중 탭을 막는 컴포넌트의 `bindtap`·`main-thread:bindtap`은 기존처럼 컴포넌트가 처리합니다.
