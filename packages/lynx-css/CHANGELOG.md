# @seed-design/lynx-css

## 0.2.0-alpha.2

### Minor Changes

- 79a951d: Lynx Checkbox / RadioGroup 컴포넌트 추가

  - `@seed-design/lynx-react` 에 `Checkbox` (Root/Control/Indicator/Label/Group), `RadioGroup` (Root/Item/ItemControl/ItemIndicator/ItemLabel) compound 컴포넌트 추가
  - `@seed-design/qvism-preset` 에 `checkbox`, `checkmark`, `checkbox-group`, `radio`, `radiomark`, `radio-group` Lynx recipe 6개 추가
  - Lynx-전용 recipe 에서 `checked`/`disabled`/`indeterminate` 를 pseudo selector 대신 boolean variants 로 직접 선언 (qvism 의 `StringToBoolean` 을 활용해 타입 cast 없이 사용 가능)
  - `CheckboxIndicator` / `RadioGroupItemIndicator` 는 `@karrotmarket/lynx-monochrome-icon` 의 monochrome icon 컴포넌트를 받아 `cloneElement` + `useIconColor` 패턴으로 `<image tint-color=...>` 의 색상을 recipe CSS `color` 토큰과 동기화
  - 웹 대비 미지원 기능 (HiddenInput, form field props, focus/focusVisible, raw `onChange`, deprecated `weight="default"/"stronger"`) 은 JSDoc 에 명시

### Patch Changes

- 1db5419: Lynx `ActionButton`의 `loading` 상태에서 버튼 너비가 spinner 크기로 줄어드는 문제를 수정합니다.

  - `loading` 상태에서도 기존 label/icon 영역의 너비를 유지한 채 spinner를 표시합니다.
  - `ui:action-button` snippet은 제거하고, Lynx에서는 `@seed-design/lynx-react`의 `ActionButton`을 직접 사용하도록 문서와 예제를 정리합니다.

- 02862ec: Lynx 의 `Switch` / `Switchmark` / `ActionButton` recipe 를 pseudo selector 대신 `pressed`, `disabled`, `loading`, `checked` boolean variant 로 상태를 노출하도록 통일했습니다. recipe 를 직접 호출할 때 임시 타입 cast 없이 type-safe 하게 boolean 을 전달할 수 있습니다.

  - `actionButton({ pressed, disabled, loading })`, `switchStyle({ disabled })`, `switchmark({ checked, disabled })` 가 native boolean variant 노출
  - ActionButton 의 pressed 상태가 `usePressTap` 결과를 React state 로 받아 className modifier 에 적용 (이전에는 native `:active` cascade 의존)

- d2ec3e6: Lynx Switch의 작은 크기에서 label과 control의 세로 정렬이 어긋나던 문제를 수정합니다.

## 0.1.1-alpha.1

### Patch Changes

- 4d9b05c: Regenerate Lynx CSS after qvism preset web/Lynx split. `packages/lynx-css` now uses its own `qvism.config.mjs` driven by the dedicated Lynx preset entry (`@seed-design/qvism-preset/lynx`), and no longer depends on the removed `targets` mechanism in `qvism-core`.
- 70054ea: TagGroup 컴포넌트 추가 + qvism preset 웹/Lynx 분리

  - `@seed-design/lynx-react`: `TagGroupRoot`, `TagGroupItem`, `TagGroupItemLabel` 지원. Root에서 `size`/`weight`/`tone`을 Context로 Item에 전파, children 사이에 separator 자동 삽입 (기본 `" · "`, `separator` prop으로 커스텀 가능). 웹 대비 `<span>` → `<view>`/`<text>` 렌더, `flexShrink`·`asChild`·아이콘 slot 미지원.
  - `@seed-design/lynx-css`: qvism preset이 `@seed-design/qvism-preset` (웹) 과 `@seed-design/qvism-preset/lynx` (Lynx) 로 완전 분리됨. Lynx preset은 `@lynx-js/types`의 `CSSProperties` 타입으로 recipe 작성 시 미지원 property를 컴파일 타임에 차단. TagGroup recipe를 Lynx flex row 기반으로 재작성.

- ffc6d4f: 등록되지 않은 컴포넌트의 CSS 산출물을 정리했어요. recipes-lynx.ts에 등록된 recipe만 lynx-css 패키지에 남도록 orphan 파일 330개를 제거했습니다.

## 0.1.1-alpha.0

### Patch Changes

- aaec799: feat(lynx): initial alpha release

  - `@seed-design/lynx-primitive`: Slot, composeRefs
  - `@seed-design/lynx-css`: 디자인 토큰, CSS 레시피
  - `@seed-design/lynx-react`: ActionButton, ProgressCircle
