# Lynx Component Implementation TODO

Lynx 플랫폼용 SEED Design 컴포넌트 구현 로드맵.

## 우선순위 (2026-04-20 재정렬)

Phase 0(`useControllableState`, `usePressTap`)이 완료됐고, ActionButton·ProgressCircle이 이미 착지했다. 다음 작업은 **"아이콘 없이도 완전히 렌더 가능하고, 컴포넌트 내부에 훅을 바로 만들면 즉시 동작하는"** 항목을 위에서부터 진행한다. Lynx 3.7 SVG 지원 전까지 이 순서가 가장 효율적이다.

### Tier A — 아이콘 불요 + headless 바로 구현 가능

| # | 컴포넌트 | Phase | 필요한 훅 | 왜 지금 할 수 있나 |
|---|---|---|---|---|
| 1 | **TagGroup** | 3 | 없음 (Context + separator) | 상태 없음, Root가 children 사이에 separator 주입 |
| 2 | **Badge** | 1 | 없음 (정적 variant) | 2슬롯 display 전용 |
| 3 | **Skeleton** | 1 | 없음 (정적 variant + dynamicStyle) | 크기만 인라인 주입 |
| 4 | **Switch** | 3 | `useSwitch` (useControllableState + usePressTap) | 훅 조합만으로 전체 UX 구현. 트랙/썸 모두 CSS |
| 5 | **SegmentedControl** | 3 | `useSegmentedControl` (useControllableState) | 단일 선택 + CSS 인디케이터 |
| 6 | **MannerTemp** | 1 | 없음 (Context + webp `<image>`) | 아이콘이 아니라 emote webp |
| 7 | **ChipTabs** | 3 | `useTabs` (useControllableState + scroll-view) | 수평 스크롤 + 단일 선택 |
| 8 | **Tabs** | 3 | `useTabs` 공유 + 인디케이터 애니메이션 | ChipTabs와 훅 공유 |
| 9 | **ScrollFog** | 6 | `useScrollFog` (scroll 이벤트 + CSS var) | 아이콘 불요, main-thread scroll 대응 |

Tier A 전부 **아이콘이 UX의 일부가 아니고** (Switch의 트랙, Tabs의 인디케이터 등은 CSS로 충분), **컴포넌트 내부에 작은 훅 하나만 만들면** 현재 Lynx 런타임 기능만으로 동작한다.

### Tier B — 아이콘 필요 / SVG 대기

ActionButton·ProgressCircle처럼 이미 착지한 것들은 SVG 의존 prop을 `Omit`한 상태로 시작했지만, 아래 컴포넌트는 아이콘이 UX의 중심이라 Lynx 3.7 SVG 지원 이후로 미룬다.

| 컴포넌트 | Phase | 아이콘 의존 부분 |
|---|---|---|
| ToggleButton / ReactionButton | 2 | loading spinner |
| ContextualFloatingButton | 2 | loading, iconOnly |
| List (Checkbox/Radio 통합) | 4 | 통합 대상 컨트롤 전부 |
| ImageFrame | 4 | `ImageFrameIcon`, `ImageFrameReactionButton` |
| PageBanner / Callout | 4 | CloseButton |
| Avatar | 4 | `AvatarBadge` (icon 포함 케이스) |
| Dialog / BottomSheet / MenuSheet | 5 | CloseButton |
| PullToRefresh | 6 | 기본 spinner indicator (커스텀 렌더러는 가능) |

### Tier C — 정책상 제외

**Lynx에서 제외된 컴포넌트** (웹에만 존재해야 하는 개념):

| 컴포넌트 | 제외 이유 |
|---|---|
| VisuallyHidden | 웹 CSS 트릭. Lynx는 `accessibility-label` 속성으로 접근성 처리 |
| Portal | 웹 `createPortal` 개념. Lynx 오버레이는 lynx-ui-overlay 패턴 사용 |
| Celsius | 문자열 포맷 함수. 컴포넌트 패키지로 제공할 가치 없음 |

**포팅하지 않는 웹 내부 컴포넌트** (export되지만 문서·rootage 미등록):

| 컴포넌트 | 사유 |
|---|---|
| Count | rootage 스펙·docs 페이지 없음. 내부 유틸 성격 |

**스타일 프리미티브로 대체되는 항목:**

| 컴포넌트 | 대체 |
|---|---|
| Text | Lynx는 Tailwind v3 + 네이티브 `<text>`로 직접 사용 |
| Divider | `<view>` + border 스타일로 호출부에서 구성 |
| Article | 웹의 시맨틱 `<article>` 래퍼 개념. Lynx 모바일에서는 `<view>`로 직접 구성하면 충분 |

**Deprecated**: ControlChip, Fab, ExtendedFab, LinkContent, InlineBanner, ActionSheet, ExtendedActionSheet → 후속 컴포넌트로 대체.

## Phase 파일

| Phase | 파일 | 설명 | 의존성 |
|-------|------|------|--------|
| 0 | [PHASE-0-infra.md](./PHASE-0-infra.md) | 공통 유틸 및 인프라 (완료) | - |
| 1 | [PHASE-1-display.md](./PHASE-1-display.md) | 단순 표시 (Badge, Skeleton, MannerTemp) | - |
| 2 | [PHASE-2-interactive.md](./PHASE-2-interactive.md) | 단순 인터랙티브 (tap) | Phase 0 |
| 3 | [PHASE-3-stateful.md](./PHASE-3-stateful.md) | 상태 관리 (controlled) | Phase 0 |
| 4 | [PHASE-4-content.md](./PHASE-4-content.md) | 콘텐츠/리스트 | Phase 1 |
| 5 | [PHASE-5-overlay.md](./PHASE-5-overlay.md) | 오버레이/시트 | Phase 0 |
| 6 | [PHASE-6-scroll.md](./PHASE-6-scroll.md) | 스크롤/제스처 | Phase 0 |

## 공통 규칙

각 컴포넌트 구현 시 아래 산출물을 반드시 생성한다:

1. `packages/lynx-react/src/components/{Name}/{Name}.tsx` + `index.ts`
2. `docs/content/lynx/components/{kebab-name}.mdx`
3. `examples/lynx-spa/src/pages/{Name}Page.tsx`
4. `examples/lynx-spa/src/App.tsx` - 라우팅 등록
5. `docs/content/lynx/components/meta.json` - 문서 등록
6. `docs/registry/lynx/ui/{kebab-name}.tsx` + `docs/registry/lynx/registry-ui.ts` 등록 (CLI 스니펫)
7. `.changeset/lynx-{name}.md` (alpha pre-release)

## 아키텍처 참고

- [AGENTS.md](../AGENTS.md) - Lynx 런타임 제약 및 코드 컨벤션
- [lynx-ui](https://github.com/lynx-family/lynx-ui) - Lynx 공식 UI 라이브러리 (참고용)
