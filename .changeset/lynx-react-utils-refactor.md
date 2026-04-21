---
"@seed-design/lynx-react": minor
---

`@seed-design/lynx-react` 내부 구조 정리

**Public API 변경 (Breaking)**

- `createRecipeContext` export 제거 — 내부 실사용 0건. 단일 slot 컴포넌트 포팅 시 필요하면 재도입.
- `createCompoundContext` export 제거 — Switch 단독 사용이라 inline `React.createContext + null-check throw` 패턴으로 교체. lynx-ui 의 13 개 compound 패키지가 동일 inline 패턴.
- `dynamicStyle` export + `./dynamic-style` subpath export 제거 — 모노레포 전체에서 실사용 0건. Skeleton / Scrollable 로드맵 컴포넌트 도입 시점에 CSS 변수 주입 방식 재검토.

**내부 정리**

- `useControllableState`, `usePressTap` 훅을 `src/utils/` → `src/hooks/` 로 이동 (public export 이름 변경 없음, 상대 경로만 이동).
- `AGENTS.md` 에 "Native tag literal JSX constraint" 섹션 추가 — 허용/금지 패턴 표, PR #1489 (`withContext("view")` 실패) + **PR #1503 spike** (`createSlotRecipeContext` 공통 유틸 파일 안의 factory 도 실패) 실증 근거, Lynx 엔진 레벨 근본 원인(`ConvertStringTagToEnumTag` enum 변환 실패) 정리. **핵심 발견**: Lynx 컴파일러는 리터럴 `<view>` / `<text>` JSX 를 **파일 단위**로 정적 분석하기 때문에, 리터럴 JSX 가 렌더 대상 컴포넌트 파일과 동일한 파일 안에 있어야 한다 — 공통 유틸 파일의 helper 로 추출 불가.

**Spike 실패 기록**

이번 PR 에서 `createSlotRecipeContext` 반환 객체에 `withViewContext(slot)` / `withTextContext(slot)` 헬퍼를 추가해 BottomSheet 의 로컬 `createViewSlot`/`createTextSlot` factory 를 대체하려 시도했으나, 런타임 `BackgroundSnapshot not found: view` 에러로 revert. 구조는 BottomSheet 의 기존 factory 와 동일 (1-layer `forwardRef` + 리터럴 `<view>`) 이지만 선언 파일이 달라 Lynx 컴파일러의 파일-스코프 정적 분석을 통과하지 못함. BottomSheet 의 기존 `createViewSlot` / `createTextSlot` factory 는 그대로 유지.
