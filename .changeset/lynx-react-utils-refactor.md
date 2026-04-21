---
"@seed-design/lynx-react": minor
---

`@seed-design/lynx-react` 내부 구조 정리 및 `createSlotRecipeContext` 헬퍼 확장

**Public API 변경 (Breaking)**

- `createRecipeContext` export 제거 — 내부 실사용 0건. 단일 slot 컴포넌트 포팅 시 필요하면 재도입.
- `createCompoundContext` export 제거 — Switch 단독 사용이라 inline `React.createContext + null-check throw` 패턴으로 교체. lynx-ui 의 13 개 compound 패키지가 동일 inline 패턴.
- `dynamicStyle` export + `./dynamic-style` subpath export 제거 — 모노레포 전체에서 실사용 0건. Skeleton / Scrollable 로드맵 컴포넌트 도입 시점에 CSS 변수 주입 방식 재검토.

**추가**

- `createSlotRecipeContext` 반환 객체에 `withViewContext(slot)` / `withTextContext(slot)` 헬퍼 추가. 네이티브 `<view>` / `<text>` 슬롯을 한 줄로 선언 가능. helper 내부에 리터럴 JSX 가 있어 Lynx 컴파일러의 정적 분석을 통과. BottomSheet slot 선언이 helper 호출로 간소화됨.
- `NativeSlotProps` 타입 export (helper 호출 결과 컴포넌트의 props 타입 참조용).

**내부 정리**

- `useControllableState`, `usePressTap` 훅을 `src/utils/` → `src/hooks/` 로 이동 (public export 이름 변경 없음, 상대 경로만 이동).
- `AGENTS.md` 에 "Native tag literal JSX constraint" 섹션 추가 — 허용/금지 패턴 표, PR #1489 실증 근거, Lynx 엔진 레벨 근본 원인(`ConvertStringTagToEnumTag` enum 변환 실패) 정리.
