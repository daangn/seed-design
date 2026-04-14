# Lynx Component Implementation TODO

Lynx 플랫폼용 SEED Design 컴포넌트 구현 로드맵.

## Phase 구조

| Phase | 파일 | 설명 | 컴포넌트 수 |
|-------|------|------|-----------|
| 0 | [PHASE-0-infra.md](./PHASE-0-infra.md) | 공통 유틸 및 인프라 | 유틸 2개 |
| 1 | [PHASE-1-display.md](./PHASE-1-display.md) | 단순 표시 컴포넌트 | 10개 |
| 2 | [PHASE-2-interactive.md](./PHASE-2-interactive.md) | 단순 인터랙티브 (tap) | 6개 |
| 3 | [PHASE-3-stateful.md](./PHASE-3-stateful.md) | 상태 관리 (controlled) | 5개 |
| 4 | [PHASE-4-content.md](./PHASE-4-content.md) | 콘텐츠/리스트 | 8개 |
| 5 | [PHASE-5-overlay.md](./PHASE-5-overlay.md) | 오버레이/시트 | 7개 |
| 6 | [PHASE-6-scroll.md](./PHASE-6-scroll.md) | 스크롤/제스처 | 2개 |

## 공통 규칙

각 컴포넌트 구현 시 아래 산출물을 반드시 생성한다:

1. `packages/lynx-react/src/components/{Name}/{Name}.tsx` + `index.ts`
2. `docs/content/lynx/components/{kebab-name}.mdx`
3. `examples/lynx-spa/src/pages/{Name}Page.tsx`
4. `examples/lynx-spa/src/App.tsx` — 라우팅 등록
5. `docs/content/lynx/components/meta.json` — 문서 등록

## 아키텍처 참고

- [AGENTS.md](../AGENTS.md) — Lynx 런타임 제약 및 코드 컨벤션
- [상세 스펙](../../docs/superpowers/specs/2026-04-14-lynx-component-feasibility.md) — 전체 분석 문서
