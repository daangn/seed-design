# Lynx Component Implementation TODO

Lynx 플랫폼용 SEED Design 컴포넌트 구현 로드맵.

## 구현 전략

- **Primitive는 직접 구현**: `useControllableState`, `usePressTap` 같은 원자 훅은 `@seed-design/lynx-react/src/utils/`에 우리가 직접 유지한다. 다른 패키지 의존 없이 Lynx 런타임 API(`useState`, `useMainThreadRef`, `main-thread:bindtouch*` 등)만 사용.
- **복잡한 컴포넌트는 `@lynx-js/lynx-ui-*` 래핑**: Sheet·Dialog·Popover처럼 스프링 물리, 프레즌스 상태 머신, 플로팅 포지셔닝 등 내부 로직이 수백~천 줄 단위인 컴포넌트는 [lynx-ui](https://github.com/lynx-family/lynx-ui)의 headless 패키지를 래핑한다. SEED는 디자인 토큰/레시피/컴포넌트 API만 입힌다.
- **아이콘(SVG) 의존 기능은 Omit 또는 Tier B**: Lynx 3.7 SVG 지원 전까지는 spinner·closeButton·checkmark 등을 타입에서 제외하거나 해당 컴포넌트를 Tier B에 둔다.

## 우선순위 (2026-04-20 재정렬)

Phase 0(`useControllableState`, `usePressTap`)이 완료됐고, ActionButton·ProgressCircle이 이미 착지했다. 다음 작업은 **"아이콘 UX 없이 렌더 가능하고 지금 Lynx 런타임에서 바로 만들 수 있는"** 항목을 위에서부터 진행한다.

### Tier A1 — 직접 구현 (primitive 조합)

상태 없거나 `useControllableState`/`usePressTap` 조합만으로 완결된다. lynx-ui 의존 불필요.

| # | 컴포넌트 | Phase | 구현 |
|---|---|---|---|
| 1 | **TagGroup** | 3 | Context + separator 주입 |
| 2 | **Badge** | 1 | 정적 variant, 2슬롯 display |
| 3 | **Skeleton** | 1 | 정적 variant + `dynamicStyle(height/width)` |
| 4 | **MannerTemp** | 1 | Context + webp `<image>` |
| 5 | **Switch** | 3 | `useControllableState` + `usePressTap` 인라인. 별도 `useSwitch` 불필요 (hover/focus/form 없음) |
| 6 | **SegmentedControl** | 3 | `useControllableState` + CSS indicator |
| 7 | **ChipTabs** | 3 | `useControllableState` + 네이티브 `<scroll-view scroll-x>` |
| 8 | **Tabs** | 3 | ChipTabs와 selection 훅 공유 + CSS transition indicator |

### Tier A2 — lynx-ui 래핑

복잡한 제스처/애니메이션/포지셔닝 로직을 `@lynx-js/lynx-ui-*`에서 가져온다. SEED는 컴포넌트 API와 스타일만 담당.

| # | 컴포넌트 | Phase | 래핑 대상 | 우리가 하는 것 |
|---|---|---|---|---|
| 9 | **BottomSheet** | 5 | `@lynx-js/lynx-ui-sheet` (snap points, spring physics, drag-to-close) | `BottomSheetRoot/Backdrop/Handle/Content/Header/Title/Description/Body/Footer`로 슬롯 매핑. CloseButton은 Tier B |
| 10 | **Dialog** | 5 | `@lynx-js/lynx-ui-dialog` (backdrop + presence) | 슬롯 매핑. CloseButton은 Tier B |
| 11 | **MenuSheet** | 5 | `@lynx-js/lynx-ui-sheet` 또는 `-dialog` (디자인 결정) | 공용 `MenuSheetItem`을 재활용하는 구조만 추가 |
| 12 | **Popover** / **HelpBubble** | — | `@lynx-js/lynx-ui-popover` (anchor tracking + floating-ui) | SEED 레시피 입힘. 아이콘 팁 있을 시 Tier B |
| 13 | **PullToRefresh** | 6 | `@lynx-js/lynx-ui-common`의 `useRefresh` | 훅만 차용, indicator는 CSS 애니메이션으로 구현 (spinner SVG 회피) |
| 14 | **ScrollFog** | 6 | `@lynx-js/lynx-ui-scroll-view` (bounce, scroll 위치 콜백) | 스크롤 위치로 CSS variable 갱신 |

### Tier B — SVG 의존 (Lynx 3.7 대기)

| 컴포넌트 | Phase | 아이콘 의존 부분 |
|---|---|---|
| ToggleButton / ReactionButton | 2 | loading spinner |
| ContextualFloatingButton | 2 | loading, iconOnly |
| Checkbox | — | 체크마크 glyph |
| RadioGroup | — | 라디오 점 (SVG 디자인에 맞춤; CSS만으로는 디자인 미일치) |
| List (Checkbox/Radio 통합) | 4 | 통합 대상 컨트롤 전부 |
| ImageFrame | 4 | `ImageFrameIcon`, `ImageFrameReactionButton` |
| PageBanner / Callout | 4 | CloseButton |
| Avatar | 4 | `AvatarBadge` (icon 포함 케이스) |
| Dialog / BottomSheet / MenuSheet의 CloseButton | 5 | 컴포넌트 본체는 Tier A2, CloseButton만 분리 |

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
| 5 | [PHASE-5-overlay.md](./PHASE-5-overlay.md) | 오버레이/시트 (lynx-ui 래핑) | Phase 0 |
| 6 | [PHASE-6-scroll.md](./PHASE-6-scroll.md) | 스크롤/제스처 (lynx-ui-common 활용) | Phase 0 |

## 공통 규칙

각 컴포넌트 구현 시 아래 산출물을 반드시 생성한다:

1. `packages/lynx-react/src/components/{Name}/{Name}.tsx` + `index.ts`
2. `docs/content/lynx/components/{kebab-name}.mdx`
3. `examples/lynx-spa/src/pages/{Name}Page.tsx`
4. `examples/lynx-spa/src/App.tsx` - 라우팅 등록
5. `docs/content/lynx/components/meta.json` - 문서 등록
6. `docs/registry/lynx/ui/{kebab-name}.tsx` + `docs/registry/lynx/registry-ui.ts` 등록 (CLI 스니펫)
7. `.changeset/lynx-{name}.md` (alpha pre-release)

### 래핑 컴포넌트 추가 규칙

Tier A2에 해당하면:

- `packages/lynx-react/package.json`의 `peerDependencies`에 사용하는 `@lynx-js/lynx-ui-*` 패키지를 등록한다.
- 컴포넌트 JSDoc에 `@platform Lynx`로 내부적으로 어떤 lynx-ui 패키지를 감싸는지 명시한다.
- SEED 공개 API는 웹(`@seed-design/react`)과 이름을 일치시킨다. 내부 lynx-ui API 누출 금지.

## 아키텍처 참고

- [AGENTS.md](../AGENTS.md) - Lynx 런타임 제약 및 코드 컨벤션
- [lynx-ui](https://github.com/lynx-family/lynx-ui) - Lynx 공식 UI 라이브러리. 래핑 대상
