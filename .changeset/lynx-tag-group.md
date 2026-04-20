---
"@seed-design/lynx-react": minor
---

TagGroup 컴포넌트 추가

- `TagGroupRoot`, `TagGroupItem`, `TagGroupItemLabel` 지원
- Root에서 `size`/`weight`/`tone` 변형을 Context로 하위 Item에 전파하며, Item에서 개별 덮어쓰기 가능
- children 사이에 separator 자동 삽입 (기본 `" · "`, `separator` prop으로 커스텀 가능)
- 웹 대비 `<span>` → `<view>`/`<text>` 렌더, `flexShrink`·`asChild`·아이콘 slot 미지원
- 내부 유틸 `splitMultipleVariantsProps`, `createSlotRecipeContext` 추가 (이후 Lynx 컴포넌트에서 재사용)
