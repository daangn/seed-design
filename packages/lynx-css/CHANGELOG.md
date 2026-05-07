# @seed-design/lynx-css

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
