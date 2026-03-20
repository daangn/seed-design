# 컴포넌트 구현 상세 가이드

## Step 1: Headless (선택)

**위치**: `packages/react-headless/[name]/`
**조건**: 데이터 로직이 필요한 경우만 (단순 UI 컴포넌트는 생략)

Headless 훅은 `use{Component}.ts` 파일에 `use{Component}` 형태로 작성한다. 훅은 `data-pressed`, `data-disabled` 같은 data 속성과 이벤트 핸들러(`onPointerDown`, `onClick` 등)를 `rootProps` 객체로 반환한다.

## Step 2: Definition (Rootage)

**위치**: `packages/rootage/components/[name].yaml`
**명령어**: 완료 후 `bun generate:all`

`packages/rootage/components/schema.json`을 참고하여 YAML 파일을 작성한다. 스키마에 정의된 `kind`, `metadata`, `data` 구조를 따르며, slots/variants/definitions를 올바르게 구성한다.

## Step 3: Recipe (Qvism Preset)

**위치**: `packages/qvism-preset/src/recipes/[name].ts`
**추가 작업**: `recipes/index.ts`에 export 추가
**컨벤션**: 구현 전 `packages/qvism-preset/AGENTS.md`를 읽고 해당 패키지의 컨벤션을 확인한다.

Recipe 파일에서 `../vars/component/`의 생성된 토큰을 import하고, `defineRecipe` 또는 `defineSlotRecipe`로 스타일을 정의한다. 어떤 함수를 사용할지, 슬롯 구조, 전환 시 주의사항은 `packages/qvism-preset/AGENTS.md`에 명시되어 있다.

**주의**: hover 대신 active 상태 사용 (모바일 우선)

## Step 4: React 컴포넌트

**위치**: `packages/react/src/components/[ComponentName]/`
**빌드**: 완료 후 `bun packages:build`
**컨벤션**: 구현 전 `packages/react/AGENTS.md`를 읽고 해당 패키지의 컨벤션을 확인한다.

Variant Props 처리 패턴, 단일/복합 슬롯 패턴, 금지 패턴 등의 상세는 `packages/react/AGENTS.md`에 명시되어 있다.

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

Snippet 파일은 `"use client"` 선언으로 시작하며, `@seed-design/react`에서 compound 컴포넌트를 import하여 단순화된 API로 래핑한다. Props 인터페이스는 `SeedComponentName.RootProps`를 extends하고, `src`, `alt`, `fallback` 같은 편의 prop을 추가한다. 반드시 `React.forwardRef`로 감싸고 `displayName`을 설정한다. 하위 컴포넌트가 있으면 별도 인터페이스와 함께 re-export한다.

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
