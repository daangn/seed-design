# Lynx Component Implementation TODO

Lynx 플랫폼용 SEED Design 컴포넌트 구현 로드맵.

## Phase 구조

| Phase | 파일 | 설명 | 항목 수 | 의존성 |
|-------|------|------|--------|--------|
| 0 | [PHASE-0-infra.md](./PHASE-0-infra.md) | 공통 유틸 및 인프라 | 유틸 2개 | - |
| 1 | [PHASE-1-display.md](./PHASE-1-display.md) | 단순 표시 컴포넌트 | 8개 | - |
| 2 | [PHASE-2-interactive.md](./PHASE-2-interactive.md) | 단순 인터랙티브 (tap) | 6개 | Phase 0 (usePressTap) |
| 3 | [PHASE-3-stateful.md](./PHASE-3-stateful.md) | 상태 관리 (controlled) | 5개 | Phase 0 (useControllableState, usePressTap) |
| 4 | [PHASE-4-content.md](./PHASE-4-content.md) | 콘텐츠/리스트 | 8개 | Phase 1 (표시 컴포넌트 합성 가능) |
| 5 | [PHASE-5-overlay.md](./PHASE-5-overlay.md) | 오버레이/시트 | 6개 | Phase 0 (useControllableState) |
| 6 | [PHASE-6-scroll.md](./PHASE-6-scroll.md) | 스크롤/제스처 | 2개 | Phase 0 (useControllableState) |

> Phase 1은 Phase 0에 의존하지 않으므로 병렬 진행 가능.

## Lynx에서 제외된 컴포넌트

웹에서는 존재하지만 Lynx 플랫폼에서 불필요한 컴포넌트:

| 컴포넌트 | 제외 이유 |
|----------|----------|
| VisuallyHidden | 웹 CSS 트릭. Lynx는 `accessibility-label` 속성으로 접근성 처리 |
| Portal | 웹 `createPortal` 개념. Lynx 오버레이는 lynx-ui-overlay 패턴 사용 |
| Celsius | 문자열 포맷 함수. 컴포넌트 패키지로 제공할 가치 없음 |

## Deprecated 컴포넌트 정책

웹에서 deprecated된 컴포넌트는 **Lynx에서 구현하지 않는다**. 후속 컴포넌트를 우선 구현한다.

| Deprecated | 대체 | Phase |
|-----------|------|-------|
| ControlChip | Chip.Toggle / Chip.Button | 2 |
| Fab | ContextualFloatingButton | 2 |
| ExtendedFab | ContextualFloatingButton | 2 |
| LinkContent | ActionButton variant="ghost" | 4 |
| InlineBanner | PageBanner | 4 |
| ActionSheet | MenuSheet | 5 |
| ExtendedActionSheet | MenuSheet | 5 |

제외(3) + deprecated(7) = 10개 제외. **실질 구현 대상: 28개**.

## 공통 규칙

각 컴포넌트 구현 시 아래 산출물을 반드시 생성한다:

1. `packages/lynx-react/src/components/{Name}/{Name}.tsx` + `index.ts`
2. `docs/content/lynx/components/{kebab-name}.mdx`
3. `examples/lynx-spa/src/pages/{Name}Page.tsx`
4. `examples/lynx-spa/src/App.tsx` - 라우팅 등록
5. `docs/content/lynx/components/meta.json` - 문서 등록

## 아키텍처 참고

- [AGENTS.md](../AGENTS.md) - Lynx 런타임 제약 및 코드 컨벤션
- [lynx-ui](https://github.com/lynx-family/lynx-ui) - Lynx 공식 UI 라이브러리 (참고용)
