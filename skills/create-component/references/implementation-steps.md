# 컴포넌트 구현 상세 가이드

> **전제조건**: `references/architecture-decisions.md`의 Phase 0을 완료해야 한다. 카테고리, 패턴 참조 컴포넌트, 접근성 스펙이 확정된 상태에서 구현을 시작한다.

각 Step에서 **패턴 참조 컴포넌트의 해당 파일을 먼저 읽고** 패턴을 따른다.

## Step 1: Headless (선택)

**위치**: `packages/react-headless/[name]/`
**조건**: 데이터 로직이 필요한 경우만 (단순 UI 컴포넌트는 생략)

Headless 훅은 하나의 `use{Component}`로 끝낼 필요가 없다. compound stateful 컴포넌트는 가능하면 root/item 책임을 분리하고, render wiring과 상태 로직을 분리한다.

- root 수준 상태와 collection 관리는 `use{Component}` 또는 `useRootState` 계열 훅에 둔다.
- item 수준 상태, 키보드 인터랙션, slot별 props 조합은 `use{Component}Item` 또는 `useItemState` 계열 훅으로 분리한다.
- 재사용 가능한 상태 전이, DOM query, 내부 id 생성, keyboard handler는 가능하면 `use*` 훅으로 내리고 컴포넌트 파일에는 hook이 만든 props와 ref를 연결하는 역할만 남긴다.
- hook은 `rootProps` 하나만 반환할 필요가 없다. `triggerProps`, `contentProps`, `indicatorProps`처럼 slot별 props를 반환해도 된다.
- hook이 반환하는 props는 ARIA, ids, keyboard handler, `data-*` state까지 포함한 **slot contract**를 목표로 하고, React 컴포넌트가 같은 로직을 다시 계산하지 않게 한다.
- DOM query가 필요하면 ref `Set` 등록보다 내부 id + 안정적인 selector contract(`data-ownedby` 등)를 먼저 검토한다.

**카테고리 C/D에서 새 headless를 만들 때**: Phase 0에서 정리한 ARIA APG 패턴과 키보드 인터랙션 스펙을 이 단계에서 구현한다. `references/external-references.md`의 접근성 체크리스트를 따른다. 외부 라이브러리(Base UI, Radix)의 동일 컴포넌트 구현도 참조하여 인터페이스 설계를 검증한다.

`asChild`, `headingLevel` 같은 escape hatch를 제공하기로 했다면, 런타임이 실제 지원하는 방식만 타입에 노출한다. 타입에만 열어두고 구현에서 무시하는 상태는 만들지 않는다.

## Step 2: Definition (Rootage)

**위치**: `packages/rootage/components/[name].yaml`
**명령어**: 완료 후 `bun generate:all`

`packages/rootage/components/schema.json`을 참고하여 YAML 파일을 작성한다. 스키마에 정의된 `kind`, `metadata`, `data` 구조를 따르며, slots/variants/definitions를 올바르게 구성한다.

## Step 3: Recipe (Qvism Preset)

**위치**: `packages/qvism-preset/src/recipes/[name].ts`
**추가 작업**: `recipes/index.ts`에 export 추가
**컨벤션**: 구현 전 `packages/qvism-preset/AGENTS.md`를 읽고 해당 패키지의 컨벤션을 확인한다.

Recipe 파일에서 `../vars/component/`의 생성된 토큰을 import하고, `defineRecipe` 또는 `defineSlotRecipe`로 스타일을 정의한다. 어떤 함수를 사용할지, 슬롯 구조, 전환 시 주의사항은 `packages/qvism-preset/AGENTS.md`에 명시되어 있다.

**추가 참조**: `references/recipe-patterns.md` — token 경로 컨벤션, pseudo 선택자, 아이콘 헬퍼, focus ring, 애니메이션 패턴

**주의**: hover 대신 engaged 상태 사용 (모바일 우선)

## Step 4: React 컴포넌트

**위치**: `packages/react/src/components/[ComponentName]/`
**빌드**: 완료 후 `bun packages:build`
**컨벤션**: 구현 전 `packages/react/AGENTS.md`를 읽고 해당 패키지의 컨벤션을 확인한다.

Variant Props 처리 패턴, 단일/복합 슬롯 패턴, 금지 패턴 등의 상세는 `packages/react/AGENTS.md`에 명시되어 있다.

**추가 참조**: `references/react-patterns.md` — 카테고리별 유틸리티 선택 (createSlotRecipeContext, createWithStateProps, splitMultipleVariantsProps), Form/Field 통합, namespace 패턴

## Step 5: Registry UI (Snippet 레이어)

**위치**: `docs/registry/ui/[name].tsx`

### Snippet 레이어가 필요한 경우

다음 조건 중 하나라도 해당하면 snippet 레이어를 추가해야 합니다:
1. **복합 컴포넌트**: Root+Content+Fallback 등 여러 서브컴포넌트를 조합해야 하는 경우 (Avatar, ImageFrame 등)
2. **서드파티 의존성 통합**: 외부 아이콘 라이브러리나 다른 패키지를 함께 사용해야 하는 경우
3. **보일러플레이트 단순화**: 사용자가 매번 직접 조합하면 너무 복잡한 경우 (Image.Root + Image.Fallback + Image.Content 등)

### 반대로 Snippet이 필요 없는 경우

- 단일 컴포넌트 (`<Button>`, `<Badge>` 등): `@seed-design/react`에서 직접 사용
- 이미 심플한 API를 가진 경우

### Snippet 파일 작성 패턴

Snippet 파일은 `"use client"` 선언으로 시작하며, `@seed-design/react`에서 compound 컴포넌트를 import하여 **convenience wrapper**를 우선 설계한다.

- low-level re-export보다 사용자가 가장 짧게 쓸 수 있는 surface를 먼저 만든다.
- Props는 단순 `RootProps extends`로 끝내지 말고, 실제 convenience prop(`title`, `description`, `suffixIcon` 등)을 먼저 설계한다.
- native HTML prop이나 underlying primitive prop과 이름이 충돌할 수 있는 convenience prop(`title`, `size`, `color`, `prefix` 등)은 `Omit` 또는 rename을 먼저 검토한다.
- 하위 컴포넌트는 사용자가 직접 알아야 하는 public 시나리오가 있을 때만 선택적으로 노출한다.
- 반드시 `React.forwardRef`로 감싸고, `displayName`은 runtime export 이름과 맞는 flat naming을 우선한다.

**추가 작업**:
1. `docs/registry/registry-ui.ts`에 entry 추가 (의존성 버전은 해당 컴포넌트가 추가된 버전 기준)
2. `bun --filter @seed-design/docs generate:registry` 실행

### React 문서 업데이트

Snippet 레이어가 있는 컴포넌트의 문서는 반드시 다음 형태로 업데이트해야 합니다:
- `## Installation` 섹션 추가: `npx @seed-design/cli@latest add ui:[name]` 명령어
- `<ManualInstallation name="[name]" />` 컴포넌트 추가
- `## Usage`의 import 경로를 `seed-design/ui/[name]`으로 변경
- Props 섹션 경로를 `./registry/ui/[name].tsx`로 변경

## Step 6: Examples

**위치**: `docs/examples/react/[name]/`

Snippet 레이어가 있는 경우 `seed-design/ui/[name]`에서 import하고, Layout 컴포넌트(Flex, VStack 등)는 `@seed-design/react`에서 import한다. Snippet 레이어가 없는 경우 `@seed-design/react`에서 직접 import한다.

snippet을 vendoring해서 소비하는 example app이 있으면 해당 경로도 함께 확인한다. 현재는 `examples/stackflow-spa/src/seed-design/ui/`가 대표적이며, snippet API가 바뀌면 이 경로와 example app build도 함께 동기화해야 한다.

## Step 7: Storybook

**위치**: `docs/stories/[ComponentName].stories.tsx`
**명령어**: `bun storybook` (docs 폴더에서)

필수 스토리:
- `LightTheme` - 라이트 테마
- `DarkTheme` - 다크 테마
- `FontScalingExtraSmall` - 작은 폰트
- `FontScalingExtraExtraExtraLarge` - 큰 폰트

## Step 8: Documentation

### React 문서
**위치**: `docs/content/react/components/[name].mdx`

### Design 문서
**위치**: `docs/content/docs/components/[name].mdx`
