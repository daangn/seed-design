---
"@seed-design/lynx-css": patch
"@seed-design/lynx-react": patch
---

Lynx 의 `Switch` / `Switchmark` / `ActionButton` recipe 를 pseudo selector 대신 `pressed`, `disabled`, `loading`, `checked` boolean variant 로 상태를 노출하도록 통일했습니다. recipe 를 직접 호출할 때 임시 타입 cast 없이 type-safe 하게 boolean 을 전달할 수 있습니다.

- `actionButton({ pressed, disabled, loading })`, `switchStyle({ disabled })`, `switchmark({ checked, disabled })` 가 native boolean variant 노출
- ActionButton 의 pressed 상태가 `usePressTap` 결과를 React state 로 받아 className modifier 에 적용 (이전에는 native `:active` cascade 의존)
