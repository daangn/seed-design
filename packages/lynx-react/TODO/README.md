# Lynx Component Implementation TODO

Lynx 플랫폼용 SEED Design 컴포넌트 구현 로드맵.

## 구현 전략

- **Primitive는 직접 구현**: `useControllableState`, `usePressTap` 같은 원자 훅은 `@seed-design/lynx-react/src/utils/`에 우리가 직접 유지한다. 다른 패키지 의존 없이 Lynx 런타임 API(`useState`, `useMainThreadRef`, `main-thread:bindtouch*` 등)만 사용.
- **복잡한 컴포넌트는 `@lynx-js/lynx-ui-*` 래핑**: Sheet·Dialog·Popover처럼 스프링 물리, 프레즌스 상태 머신, 플로팅 포지셔닝 등 내부 로직이 수백~천 줄 단위인 컴포넌트는 [lynx-ui](https://github.com/lynx-family/lynx-ui)의 headless 패키지를 래핑한다. SEED는 디자인 토큰/레시피/컴포넌트 API만 입힌다.
- **아이콘(SVG) 의존 기능은 Omit 또는 Tier B**: Lynx 3.7 SVG 지원 전까지는 spinner·closeButton·checkmark 등을 타입에서 제외하거나 해당 컴포넌트를 Tier B에 둔다.

## 문서 구조

Tier 단위로 파일이 나뉘어 있다. 각 Tier 내부의 번호가 구현 순서.

| 파일 | 내용 | 개수 |
|---|---|---|
| [PHASE-0-infra.md](./PHASE-0-infra.md) | 공통 유틸/primitive (완료: `useControllableState`, `usePressTap`) | ✅ 완료 |
| [TIER-A1-direct.md](./TIER-A1-direct.md) | primitive만으로 직접 구현 | 8개 |
| [TIER-A2-wrap.md](./TIER-A2-wrap.md) | lynx-ui 래핑 | 6개 |
| [TIER-B-svg-blocked.md](./TIER-B-svg-blocked.md) | SVG 의존으로 Lynx 3.7 대기 | — |

> 옛 `PHASE-1`~`PHASE-6` 분류는 폐기. 웹의 headless 복잡도 기준 구분이 Lynx 맥락에서는 의미가 옅어 Tier(구현 가능성) 기준으로 재편했다.

## 우선순위 요약

Phase 0(`useControllableState`, `usePressTap`)이 완료됐고, ActionButton·ProgressCircle이 이미 착지했다. 다음 작업은 **"아이콘 UX 없이 렌더 가능하고 지금 Lynx 런타임에서 바로 만들 수 있는"** 항목을 위에서부터 진행한다.

### Tier A1 — 직접 구현 (primitive 조합)

상태 없거나 `useControllableState`/`usePressTap` 조합만으로 완결된다. lynx-ui 의존 불필요.

| # | 컴포넌트 | 구현 |
|---|---|---|
| 1 | **TagGroup** | Context + separator 주입 |
| 2 | **Badge** | 정적 variant, 2슬롯 display |
| 3 | **Skeleton** | 정적 variant + `dynamicStyle(height/width)` |
| 4 | **MannerTemp** | Context + webp `<image>` |
| 5 | **Switch** | `useControllableState` + `usePressTap` 인라인. 별도 `useSwitch` 불필요 (hover/focus/form 없음) |
| 6 | **SegmentedControl** | `useControllableState` + CSS indicator |
| 7 | **ChipTabs** | `useControllableState` + 네이티브 `<scroll-view scroll-x>` |
| 8 | **Tabs** | ChipTabs와 selection 훅 공유 + CSS transition indicator |

### Tier A2 — lynx-ui 래핑

복잡한 제스처/애니메이션/포지셔닝 로직을 `@lynx-js/lynx-ui-*`에서 가져온다. SEED는 컴포넌트 API와 스타일만 담당.

| # | 컴포넌트 | 래핑 대상 | 우리가 하는 것 |
|---|---|---|---|
| 1 | **BottomSheet** ← 우선 착수 | `@lynx-js/lynx-ui-sheet` (snap points, spring physics, drag-to-close) | `BottomSheetRoot/Backdrop/Handle/Content/Header/Title/Description/Body/Footer` 슬롯 매핑. CloseButton은 Tier B |
| 2 | **Dialog** | `@lynx-js/lynx-ui-dialog` (backdrop + presence) | 슬롯 매핑. CloseButton은 Tier B |
| 3 | **MenuSheet** | `@lynx-js/lynx-ui-sheet` 또는 `-dialog` (디자인 결정) | 공용 `MenuSheetItem` 구조 |
| 4 | **Popover / HelpBubble** | `@lynx-js/lynx-ui-popover` (anchor tracking + floating-ui) | SEED 레시피 입힘 |
| 5 | **PullToRefresh** | `@lynx-js/lynx-ui-common`의 `useRefresh` | 훅만 차용, indicator는 CSS 애니메이션 (spinner SVG 회피) |
| 6 | **ScrollFog** | `@lynx-js/lynx-ui-scroll-view` (bounce, scroll 위치 콜백) | 스크롤 위치로 CSS variable 갱신 |

### Tier B — SVG 의존 (Lynx 3.7 대기)

상세는 [TIER-B-svg-blocked.md](./TIER-B-svg-blocked.md). 요약:

| 카테고리 | 해당 |
|---|---|
| 본체는 가능, 일부 prop만 `Omit` | ToggleButton, ReactionButton, ContextualFloatingButton (loading/iconOnly) — 원하면 Tier A1로 승격 가능 |
| 본체 자체가 SVG 의존 | Checkbox (체크마크), RadioGroup (라디오 점) |
| 본체 가능, 서브컴포넌트만 대기 | List·ImageFrame·PageBanner·Callout·Avatar (서브컴포넌트 아이콘만 Tier B), Dialog/BottomSheet/MenuSheet/HelpBubble의 CloseButton |

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
