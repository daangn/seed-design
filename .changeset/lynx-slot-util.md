---
"@seed-design/lynx-react": minor
---

`createSlotRecipeContext` 유틸 추가 — Lynx compound 컴포넌트용

- 웹 `@seed-design/react`의 `createSlotRecipeContext`를 Lynx 런타임에 맞게 포팅
- 외부 React 함수 컴포넌트 래핑: `withContext(Component, "slot")`
- 네이티브 `<view>` 슬롯: `withViewContext("slot")` — 리터럴 JSX emit으로 Lynx 컴파일러의 `BackgroundSnapshot` 정적 분석을 통과
- 네이티브 `<text>` 슬롯: `withTextContext("slot")`
- 앞으로 Lynx compound 컴포넌트 (`BottomSheet`, `Dialog` 등)가 공통 기반으로 사용
