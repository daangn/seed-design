---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": patch
---

TagGroup 컴포넌트 추가 + qvism preset 웹/Lynx 분리

- `@seed-design/lynx-react`: `TagGroupRoot`, `TagGroupItem`, `TagGroupItemLabel` 지원. Root에서 `size`/`weight`/`tone`을 Context로 Item에 전파, children 사이에 separator 자동 삽입 (기본 `" · "`, `separator` prop으로 커스텀 가능). 웹 대비 `<span>` → `<view>`/`<text>` 렌더, `flexShrink`·`asChild`·아이콘 slot 미지원.
- `@seed-design/lynx-css`: qvism preset이 `@seed-design/qvism-preset` (웹) 과 `@seed-design/qvism-preset/lynx` (Lynx) 로 완전 분리됨. Lynx preset은 `@lynx-js/types`의 `CSSProperties` 타입으로 recipe 작성 시 미지원 property를 컴파일 타임에 차단. TagGroup recipe를 Lynx flex row 기반으로 재작성.
