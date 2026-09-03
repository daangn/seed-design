# 컴포넌트 구현 상세 가이드

새 컴포넌트나 구조 변경에서는 [platform-gate.md](platform-gate.md)와 [architecture-decisions.md](architecture-decisions.md)로 target platform, 필요한 카테고리, 패턴 참조 컴포넌트, 접근성 계약을 먼저 정한다. 기존 구조를 유지하는 작은 변경은 관련 단계만 사용한다.

각 Step에서 **패턴 참조 컴포넌트의 해당 파일을 먼저 읽고** 패턴을 따른다.

## Step 1: Headless (선택)

**위치**:
- React: `packages/react-headless/[name]/`
- Lynx: `packages/lynx-react/src/hooks/`, `packages/lynx-react/src/components/[ComponentName]/` 내부 hook/context 또는 기존 외부 Lynx primitive

**조건**: 데이터 로직이 필요한 경우만 (단순 UI 컴포넌트는 생략)

React Headless 훅은 하나의 `use{Component}`로 끝낼 필요가 없다. compound stateful 컴포넌트는 가능하면 root/item 책임을 분리하고, render wiring과 상태 로직을 분리한다.

분리 여부는 인터랙션 슬롯 수와 상태 소유권으로 판단한다. 독립 item state, roving focus/DOM query, trigger/content/indicator처럼 slot별 props가 필요하면 `use{Component}` + `use{Component}Item` 구조를 우선한다. 단일 root state만 있고 interactive slot이 하나라면 하나의 훅으로 충분할 수 있다. Lynx에는 이 DOM·focus 기준을 적용하지 않고 아래 Lynx 상태 분리 원칙을 따른다.

- React root 수준 상태와 collection 관리는 `use{Component}` 또는 `useRootState` 계열 훅에 둔다.
- React item 수준 상태, 키보드 인터랙션, slot별 props 조합은 `use{Component}Item` 또는 `useItemState` 계열 훅으로 분리한다.
- 재사용 가능한 상태 전이, DOM query, 내부 id 생성, keyboard handler는 가능하면 `use*` 훅으로 내리고 컴포넌트 파일에는 hook이 만든 props와 ref를 연결하는 역할만 남긴다.
- hook은 `rootProps` 하나만 반환할 필요가 없다. `triggerProps`, `contentProps`, `indicatorProps`처럼 slot별 props를 반환해도 된다.
- hook이 반환하는 props는 ARIA, ids, keyboard handler, `data-*` state까지 포함한 **slot contract**를 목표로 하고, styled UI 컴포넌트가 같은 로직을 다시 계산하지 않게 한다.
- DOM query가 필요하면 ref `Set` 등록보다 내부 id + 안정적인 selector contract(`data-ownedby` 등)를 먼저 검토한다.

### Lynx headless 분리 원칙

Stateful Lynx 컴포넌트는 [lynx-patterns.md](lynx-patterns.md)를 따른다.

- 상태, press/tap, controlled/uncontrolled, context는 기존 hook/context 또는 외부 primitive의 상태 소유권을 따른다.
- Styled UI는 상태를 읽어 `@seed-design/lynx-css/recipes/*` variant와 className을 조합하고 native slot을 렌더링한다.
- 현재 저장소에 없는 Lynx headless 패키지를 기본 경로로 가정하지 않는다. 새 패키지가 실제로 필요하면 사용자 확인을 먼저 받는다.

**카테고리 C/D의 상태 레이어를 만들 때**: React는 구조 결정에서 정리한 ARIA APG 패턴과 키보드 인터랙션을 구현한다. Lynx는 native `accessibility-*` 속성과 터치·제스처 모델을 구현하며 DOM ARIA, hidden input, 키보드 focus, `asChild`를 그대로 이식하지 않는다. React 외부 패턴이 필요하면 [external-references.md](external-references.md)를 참고한다.

React의 `asChild`, `headingLevel` 같은 escape hatch는 API 안정성, DOM 구조, 접근성 요구가 모두 설명될 때만 제공한다. Lynx에서는 동일한 DOM escape hatch를 만들지 않고 `accessibility-heading` 등 런타임이 실제로 지원하는 방식만 노출한다. 타입에만 열어두고 구현에서 무시하는 상태는 만들지 않는다.

mode prop을 설계할 때는 값의 수보다 사용자가 선택하는 개념을 먼저 본다. 미래 제3상태가 명확하지 않은 binary mode는 `"single" | "multiple"` 같은 enum보다 `multiple?: boolean`처럼 capability boolean을 우선한다. 특정 mode에서만 유효한 prop은 타입 union으로 차단하고, headless 훅에서 조용히 무시하는 contract를 만들지 않는다.

```typescript
type UseComponentProps =
  | { multiple?: false; collapsible?: boolean }
  | { multiple: true; collapsible?: never };
```

위와 같은 union을 쓰면 styled wrapper도 같은 contract를 유지해야 한다. wrapper에서 props를 다시 조합할 때는 mode별로 hook props를 분기해, `multiple: true`인 객체에 single-only prop이 섞이지 않게 한다.

## Step 2: Definition (Rootage)

**위치**: `packages/rootage/components/[name].yaml`
**명령어**: 완료 후 `bun generate:all`

`packages/rootage/components/schema.json`을 참고하여 YAML 파일을 작성한다. 스키마에 정의된 `kind`, `metadata`, `data` 구조를 따르며, slots/variants/definitions를 올바르게 구성한다.

## Step 3: Recipe (Qvism Preset)

**위치**:
- React: `packages/qvism-preset/src/recipes/[name].ts`
- Lynx: `packages/lynx-qvism-preset/src/recipes/[name].ts`

**추가 작업**:
- React: `packages/qvism-preset/src/recipes/index.ts`에 export 추가
- Lynx: `packages/lynx-qvism-preset/src/recipes.ts` 또는 해당 preset entry에 export 추가

Recipe 파일에서 생성된 component vars를 import하고, `defineRecipe` 또는 `defineSlotRecipe`로 스타일을 정의한다. 어떤 함수를 사용할지, 슬롯 구조, 전환 시 주의사항은 target preset의 `AGENTS.md`에 명시되어 있다.

**추가 참조**: [recipe-patterns.md](recipe-patterns.md) — token 경로 컨벤션, pseudo 선택자, 아이콘 헬퍼, focus ring, 애니메이션 패턴

**주의**:
- React recipe는 구현 전 `packages/qvism-preset/AGENTS.md`를 읽는다.
- Lynx recipe는 구현 전 `packages/lynx-qvism-preset/AGENTS.md`와 [lynx-patterns.md](lynx-patterns.md)를 읽는다.
- Lynx에서는 Web-only CSS나 pseudo selector 의존 대신 boolean/string variant를 우선한다.
- hover 대신 engaged/pressed 상태 사용 (모바일 우선)

## Step 4: Styled UI 컴포넌트

**위치**:
- React: `packages/react/src/components/[ComponentName]/`
- Lynx: `packages/lynx-react/src/components/[ComponentName]/`

**빌드**: 완료 후 `bun packages:build`
**컨벤션**: 구현 전 target platform에 따라 `packages/react/AGENTS.md` 또는 `packages/lynx-react/AGENTS.md`를 읽고 해당 패키지의 컨벤션을 확인한다.

Variant Props 처리 패턴, 단일/복합 슬롯 패턴, 금지 패턴 등의 상세는 각 패키지 `AGENTS.md`에 명시되어 있다.

Lynx 컴포넌트는 구현 전에 `packages/lynx-react/src/utils`, `packages/lynx-react/src/hooks`, 그리고 패턴 참조 컴포넌트의 유틸 사용 방식을 확인한다. 특히 compound component는 `createSlotRecipeContext`를 provider/use hook으로 쓸 수 있는지 먼저 검토하고, native slot은 literal JSX로 유지한다. 쓰지 않는 유틸리티가 있으면 구조 결정 기록이나 구현 메모에 이유를 남긴다.

**추가 참조**:
- React: [react-patterns.md](react-patterns.md) — 카테고리별 유틸리티 선택 (createSlotRecipeContext, createWithStateProps, splitMultipleVariantsProps), Form/Field 통합, namespace 패턴
- Lynx: [lynx-patterns.md](lynx-patterns.md) — native literal JSX 제약, ref null guard, children 분리, recipe import, unsupported Web API 문서화

## Step 5: Registry UI (Snippet 레이어)

**위치**:
- React: `docs/registry/react/ui/[name].tsx`
- Lynx: `docs/registry/lynx/ui/[name].tsx`

이 단계는 [api-design.md](api-design.md)에서 Registry를 제공하기로 확정한 경우에만 수행한다. 복합 구조나 서드파티 의존성이 있다는 사실만으로 Registry를 추가하지 않는다.

### Snippet 파일 작성 패턴

Snippet 파일은 플랫폼 runtime에 맞춰 import하며 **convenience wrapper**를 우선 설계한다.

- React snippet: `"use client"` 선언으로 시작하고 `@seed-design/react`에서 import한다.
- Lynx snippet: `@lynx-js/react`와 `@seed-design/lynx-react`에서 import한다.

- low-level re-export보다 사용자가 가장 짧게 쓸 수 있는 surface를 먼저 만든다.
- Props는 단순 `RootProps extends`로 끝내지 말고, 실제 convenience prop(`title`, `description`, `suffixIcon` 등)을 먼저 설계한다.
- native HTML prop이나 underlying primitive prop과 이름이 충돌할 수 있는 convenience prop(`title`, `size`, `color`, `prefix` 등)은 `Omit` 또는 rename을 먼저 검토한다.
- 하위 컴포넌트는 독립적인 public 사용 의도, root와 다른 props/lifecycle, 또는 consumer가 반드시 별도 위치에 렌더해야 하는 요구가 있을 때만 노출한다.
- 최상위 convenience wrapper 이름은 `Component`를 우선한다. low-level composition 자체를 노출하는 목적이 분명할 때만 `ComponentRoot`를 사용한다.
- 반드시 `React.forwardRef`로 감싸고, `displayName`은 exported symbol과 같은 단순 문자열을 우선한다. 예를 들어 `Avatar` export라면 `Avatar`, `AccordionTrigger` export라면 `AccordionTrigger`를 사용하고, namespace가 실제 runtime API가 아닌 경우 `Accordion.Trigger` 같은 dotted name은 쓰지 않는다.

**추가 작업**:
1. React는 `docs/registry/react/registry-ui.ts`, Lynx는 `docs/registry/lynx/registry-ui.ts`에 entry 추가 (의존성 버전은 해당 컴포넌트가 추가된 버전 기준)
2. `bun --filter @seed-design/docs generate:registry` 실행

### 문서 업데이트

Snippet 레이어가 있는 컴포넌트의 문서는 반드시 다음 형태로 업데이트해야 합니다:
- `## Installation` 섹션 추가: `npx @seed-design/cli@latest add ui:[name]` 명령어
- React: `<ManualInstallation name="[name]" />`, Lynx: `<LynxManualInstallation name="[name]" />`
- React `## Usage`의 import 경로를 `seed-design/ui/[name]`으로 변경
- Lynx `## Usage`의 import 경로는 `../../seed-write-lynx-component-docs/SKILL.md`의 배포 경로 규칙을 따른다.
- Props 섹션 경로를 React는 `./registry/react/ui/[name].tsx`, Lynx는 `./registry/lynx/ui/[name].tsx`로 변경
- Lynx 문서는 같은 React 문서의 공통 섹션 순서, 예제 제목, 시나리오, 사용자 결과를 가능한 한 유지한다.
- 플랫폼 차이가 실제로 있을 때만 차이와 미지원 기능을 설명한다. 차이가 없는 빈 섹션은 만들지 않는다.
- 상세 작성 규칙은 `../../seed-write-lynx-component-docs/SKILL.md`를 따른다.

## Step 6: Examples

**위치**:
- React: `docs/examples/react/[name]/`
- Lynx: `examples/lynx-spa/src/pages/` 또는 기존 Lynx catalog/page

React snippet 레이어가 있는 경우 `seed-design/ui/[name]`에서 import하고, Layout 컴포넌트(Flex, VStack 등)는 `@seed-design/react`에서 import한다. Lynx 문서와 앱 예제는 `../../seed-write-lynx-component-docs/SKILL.md`에서 확정한 배포 경로를 따른다.

snippet을 vendoring해서 소비하는 example app이 있으면 해당 경로도 함께 확인한다.

- React 대표 경로: `examples/stackflow-spa/src/seed-design/ui/`
- Lynx 대표 경로: `examples/lynx-spa/src/seed-design/ui/`

snippet API가 바뀌면 target platform의 vendored copy와 example app build도 함께 동기화해야 한다.

## Step 7: Storybook

**위치**: `docs/stories/[ComponentName].stories.tsx`
**명령어**: `bun storybook` (docs 폴더에서)
**작성 규칙**: [storybook.md](storybook.md)

React 컴포넌트는 Storybook 스토리를 기본으로 추가한다. Lynx 컴포넌트는 Storybook 대신 `examples/lynx-spa`의 page/catalog에서 실제 사용 화면을 확인한다.

React story를 작성하거나 기존 story를 리팩터링하기 전에 [storybook.md](storybook.md)를 읽는다. CSF Next의 `preview.meta`, `meta.story`, `<Story>.extend`를 사용하고, 공통 mapping render가 meta component를 필요로 하면 render context의 `component`를 전달한다. custom parameters 타입과 Chromatic 적용 범위는 preview 및 공통 helper에서 관리한다.

필수 스토리:
- `LightTheme` - 라이트 테마
- `DarkTheme` - 다크 테마
- `FontScalingExtraSmall` - 작은 폰트
- `FontScalingExtraExtraExtraLarge` - 큰 폰트

## Step 8: Documentation

### React 문서
**위치**: `docs/content/react/components/[name].mdx`

### Lynx 문서
**위치**: `docs/content/lynx/components/[name].mdx`

Lynx 문서와 예제를 만들기 전에 `scaffold-plan.referenceScenarios`의 React 예제를 모두 읽는다. `items`의 `preview.tsx`는 파일 경계 예시일 뿐 전체 예제 계획이 아니다. 각 시나리오를 `동일 지원`, `Lynx식 변환`, `미지원`으로 분류하고 다음 값을 대응표에 기록한다.

- 문서 섹션과 예제 논리 ID
- asset의 정확한 컴포넌트 종류·크기·색상
- host와 내부 frame의 width·height·padding·정렬
- 초기 문구·상태·disabled·loading
- click·tap 입력과 중간·최종 상태 전이
- AppBar·본문·하단 CTA 같은 화면 셸

근거가 없는 `unknown`은 구현 전에 해결한다. 미지원 기능은 실행 예제를 만들지 않고 구현체 부재 근거와 앱 수준 대안을 문서에 남긴다. 상세 형식은 `../../seed-write-lynx-component-docs/SKILL.md`를 따른다.

### Design 문서
**위치**: `docs/content/docs/components/[name].mdx`
