# 컴포넌트 구현 상세 가이드

새 컴포넌트나 구조 변경은 [platform-gate.md](platform-gate.md)와 [architecture-decisions.md](architecture-decisions.md)로 target platform, 카테고리, 패턴 참조 컴포넌트, 접근성 계약을 먼저 정한다. 기존 구조를 유지하는 작은 변경은 관련 Step만 쓴다.

각 Step에서 패턴 참조 컴포넌트의 해당 파일을 먼저 읽고 그 패턴을 따른다. 경로별 테스트·생성 명령은 루트 `AGENTS.md`「검증」「생성」에 있다.

## 참조 동작 추적과 기본 장면

기존 동작을 참고하는 신규 구현·플랫폼 포팅·동작 변경에 적용한다. 단독 작업과 협업에 같은 기준을 쓴다. 문구 수정이나 동작을 보존하는 정리에는 적용하지 않고, 국소 수정은 영향을 받는 행동만 다룬다.

### 행동별 원천 추적

[경로 조회](component-map.md)와 [API 비교](api-parity.md)는 탐색의 시작점이다. 맵에 없는 hook·context·유틸리티나 상속된 API가 있을 수 있다 → 공개 컴포넌트의 import와 호출을 따라 실제 행동을 만드는 원천까지 읽는다. 예제 JSX나 같은 prop 이름만으로 동작을 추정하지 않는다. 외부 라이브러리가 행동을 소유하면 사용 중인 옵션과 버전의 문서·소스에서 필요한 계약을 확인한다.

기존 시나리오 대응 목록이나 작업 메모에 다음 연결을 남긴다. 별도 영구 문서나 전체 의존성 조사는 필요 없다.

- 입력·초기 상태와 기대 전이
  - 참조 원천: 실제 경로·심볼, 기본값·옵션
  - 대상 플랫폼의 책임: 구현할 경로·상태 소유자
  - 확인할 결과: 중간·최종 상태의 관찰 기준
- 요소 사이의 위치·크기 관계
  - 참조 원천: Rootage 스펙의 경로·키·값, Recipe 연결, 측정·계산·스타일 적용 경로
  - 대상 플랫폼의 책임: 스펙의 slot·상태·variant 대응, 기준 요소·좌표계·적용 요소·표시 시점
  - 확인할 결과: 스펙과 같은 조건에서의 간격·크기·배치와 움직임

위치·크기·간격은 먼저 `packages/rootage/components/<name>.yaml`의 해당 스펙을 확인하고, 적용되는 slot·상태·variant와 정의 키·값을 참조 원천에 적는다. 토큰 참조가 있으면 원천 정의를 따라가고, Rootage 값이 대상 플랫폼의 Recipe와 실제 요소에 어떻게 연결되는지 확인한다. 스펙에 없는 동적 배치·충돌 처리는 구현 근거를 따로 남긴다. 구현값만으로 Rootage 스펙을 대신하지 않는다.

예: Menu는 `기준 요소 등록 → 측정 → 배치·충돌 처리 → 좌표 적용 → 표시·갱신`을 추적한다. 배치 수식이나 `placement` prop이 있다는 사실만으로 이 연결이 구현됐다고 보지 않는다. 모든 컴포넌트에 Menu의 항목을 강제하지 않고 해당 동작의 실제 연결을 찾는다.

- 설명하지 못한 연결 → 해당 구현의 선행 조사로 남긴다.
- 플랫폼 차이 → 근거와 같은 사용자 결과를 내는 대체 방식으로 설명한다. 미구현을 미지원으로 바꾸지 않는다.
- 참조가 없는 신규 동작 → 사용자 요구와 가까운 기존 패턴으로 기대 결과를 정한다.

### 기본 장면 우선 검증

아래 Step은 레이어별 작성 지침이다. 모든 레이어를 완성한 뒤에야 실행하라는 순서가 아니다.

1. 요청 범위 전체의 시나리오를 유지하면서, 핵심 동작을 대표하는 장면 하나와 필수 실행 환경을 먼저 정한다.
2. 그 장면에 필요한 원천·생성물·공개 export·Registry·기존 예제 또는 호스트 경로만 연결한다. Lynx native 장면은 `examples/lynx-spa`의 문서 예제 경로를 쓴다. package나 Registry를 우회하는 검증용 구현을 만들지 않는다.
3. 안정된 변경본에서 검사별 실행자를 정하고 [관찰 가능한 결과 판정](verification-checklist.md#관찰-가능한-결과-판정)으로 확인한다. 입력·산출물·실행 자원이 독립적인 검사는 병렬로 실행한다. 실패하면 해당 원천을 고친 뒤 영향받는 검사와 장면만 다시 확인한다.
4. 기본 장면이 통과하면 그 동작에 의존하는 변형·예제 구현을 넓힌다. 참조 조사·시나리오 정리와 다른 독립 작업은 기다리지 않는다.
5. 나머지 요청 시나리오와 필수 환경을 모두 검증한다. 기본 장면 통과는 전체 완료가 아니다. 후속 변경이 기본 장면에 영향을 주면 그 항목을 다시 확인한다.

Lynx 기본 장면은 `examples/lynx-spa`의 문서 예제와 query를 포함한 실제 bundle URL로 native 결과를 먼저 확인한다. 실행·주소·딥 링크·환경 판정은 [`검증 런북`](../../seed-verify-lynx-component/references/verification.md)만 따른다.

- MDX 페이지·`LynxComponentExample` host·코드 탭·QR·Web preview·docs build pipeline 자체가 검증 대상일 때만 필요한 문서 출력을 준비한다. 그 밖에는 전체 docs 빌드나 정적 bundle 서빙을 기본 장면의 선행 조건으로 두지 않는다.
- 관련 문서 검증은 변경이 모인 안정된 차수에서 한다. 작은 원천 수정마다 반복하지 않는다.
- 실행 환경이 차단됨 → 해당 검증과 그에 의존하는 확장 작업을 차단 상태로 남긴다. 독립적인 승인 범위는 진행하되, 필수 검증의 실패·차단·미확인을 통과나 완료로 보고하지 않는다.

## Step 1: Headless (선택)

데이터·상태 로직이 필요할 때만 만든다. 단순 UI 컴포넌트는 건너뛴다.

- React → `packages/react-headless/[name]/`. 먼저 `packages/react-headless/AGENTS.md`를 읽는다.
- Lynx → `packages/lynx-react-headless/[name]/`(CSS-free Headless). 기존 외부 Lynx primitive가 상태를 이미 소유할 때만 `packages/lynx-react/src/hooks/` 또는 컴포넌트 내부 hook·context

### React hook 분리

`use{Component}` 하나로 끝낼 필요는 없다. compound stateful 컴포넌트는 가능하면 root·item 책임과, render wiring과 상태 로직을 분리한다. 예: `packages/react-headless/accordion/src/useAccordion.ts`와 `useAccordionItem.ts`.

- 독립 item state, roving focus·DOM query, trigger·content·indicator처럼 slot별 props가 필요함 → `use{Component}` + `use{Component}Item`으로 나눈다. root state 하나와 interactive slot 하나뿐이면 훅 하나로 충분할 수 있다.
- root 상태·collection 관리 → `use{Component}` 또는 `useRootState` 계열. item 상태·키보드·slot별 props 조합 → `use{Component}Item` 또는 `useItemState` 계열.
- 재사용할 상태 전이, DOM query, 내부 id 생성, keyboard handler → `use*` 훅으로 내리고, 컴포넌트 파일은 hook이 만든 props와 ref를 연결만 한다.
- 반환값 → `rootProps` 하나로 묶지 않아도 된다. `triggerProps`, `contentProps`, `indicatorProps`처럼 slot별로 돌려주고, ARIA·id·keyboard handler·`data-*` state까지 담은 slot contract로 만들어 styled UI가 같은 로직을 다시 계산하지 않게 한다.
- DOM query가 필요함 → ref `Set` 등록보다 내부 id와 안정된 selector contract(`data-ownedby` 등)를 먼저 검토한다.

### Lynx headless 분리 원칙

- Lynx에는 위의 DOM·focus 기준을 적용하지 않는다. Headless·Styled Primitive·Registry의 책임과 source·runtime·declaration graph·검증 경계는 [lynx-patterns.md](lynx-patterns.md#책임-분리)를 따른다.
- CSS-free Headless 구현·추출, Styled 어댑터의 소비 계약 변경 → [Lynx Headless 구현과 추출](lynx-headless.md)의 해당 계약 절차를 따른다.
- 공개 API는 필요에 따라 namespace와 named component를 제공하며, 일률적인 hook 하나로 일반화하지 않는다.
- 높이 측정·clipping·hidden·초기·업데이트 수명 같은 기능 geometry(예: Accordion Content) → Headless 계약에 넣는다. recipe·variant와 시각 motion은 Styled Primitive에 둔다.

### 접근성과 mode 계약

- 카테고리 C·D의 상태 레이어 → React는 구조 결정에서 정한 ARIA APG 패턴과 키보드 인터랙션을 구현한다. 외부 패턴이 필요하면 [external-references.md](external-references.md)를 본다. Lynx는 native `accessibility-*` 속성과 터치·제스처 모델을 구현하고 DOM ARIA, hidden input, 키보드 focus, `asChild`를 옮기지 않는다.
- React `asChild`, `headingLevel` 같은 escape hatch → API 안정성, DOM 구조, 접근성 요구가 모두 설명될 때만 둔다. Lynx는 같은 DOM escape hatch를 만들지 않고 `accessibility-heading`처럼 런타임이 실제로 지원하는 방식만 노출한다.
- 타입에만 열어 두고 구현에서 무시하는 상태를 만들지 않는다. mode prop과 mode 전용 prop은 [api-design.md](api-design.md)「API 설계 9원칙」의 7·8을 따른다(boolean capability 우선, discriminated union, wrapper의 mode별 분기).

## Step 2: Definition (Rootage)

1. `packages/rootage/components/[name].yaml`을 쓴다. 구조(`kind`, `metadata`, `data`, slots·variants·definitions)는 `packages/rootage/components/schema.json`, 작성 규칙은 `packages/rootage/AGENTS.md`를 따른다.
2. 루트 `AGENTS.md`「생성」의 Rootage 명령으로 생성물을 갱신한다.

## Step 3: Recipe (Qvism Preset)

1. 먼저 대상 preset의 `AGENTS.md`를 읽는다. React는 `packages/qvism-preset/AGENTS.md`(`defineRecipe`·`defineSlotRecipe` 선택, slot 구조, 전환 주의, hover 대신 `engaged` 우선인 interactive 상태 규칙), Lynx는 `packages/lynx-qvism-preset/AGENTS.md`(boolean·string variant 상태 모델과 `:active` 예외, 허용 style)와 [lynx-patterns.md](lynx-patterns.md)다.
2. Recipe를 쓴다: React `packages/qvism-preset/src/recipes/[name].ts`, Lynx `packages/lynx-qvism-preset/src/recipes/[name].ts`. 생성된 component vars를 import한다.
3. 목록에 등록한다: React `packages/qvism-preset/src/recipes.ts`, Lynx `packages/lynx-qvism-preset/src/recipes.ts`.
4. token 경로, pseudo 선택자, 아이콘 헬퍼, focus ring, 애니메이션은 [recipe-patterns.md](recipe-patterns.md)를 따른다.
5. 루트 `AGENTS.md`「생성」의 Recipe 명령으로 CSS를 갱신한다.

## Step 4: Styled UI 컴포넌트

1. 먼저 읽는다: React는 `packages/react/AGENTS.md`와 [react-patterns.md](react-patterns.md), Lynx는 `packages/lynx-react/AGENTS.md`와 [lynx-patterns.md](lynx-patterns.md). Variant props 처리, 단일·복합 slot 패턴, 금지 패턴, Lynx 런타임 불변식은 패키지 `AGENTS.md`에 있다.
2. 구현한다: React `packages/react/src/components/[ComponentName]/`, Lynx `packages/lynx-react/src/components/[ComponentName]/`.
3. Lynx는 [architecture-decisions.md](architecture-decisions.md) §1a에서 정한 유틸리티 선택을 따른다. native slot은 literal JSX로 두고, 쓰지 않는 유틸리티는 구조 결정 기록이나 구현 메모에 이유를 남긴다.
4. 루트 `AGENTS.md`「검증」의 경로별 테스트를 실행한다.

## Step 5: Registry UI (Snippet 레이어)

[api-design.md](api-design.md)에서 Registry를 제공하기로 확정했을 때만 한다. 복합 구조나 서드파티 의존성이 있다는 사실만으로 Registry를 추가하지 않는다.

1. snippet을 쓴다: React `docs/registry/react/ui/[name].tsx`, Lynx `docs/registry/lynx/ui/[name].tsx`.
   - React → `"use client"`로 시작하고 `@seed-design/react`에서 import한다.
   - Lynx → `@lynx-js/react`와 `@seed-design/lynx-react`에서 import한다.
   - convenience wrapper, prop 충돌, 하위 컴포넌트 노출, `React.forwardRef`·`displayName`, export 이름 → [api-design.md](api-design.md)의 「Snippet 작성 패턴」과 「[Snippet] Export naming」을 따른다.
2. 등록한다: React `docs/registry/react/registry-ui.ts`, Lynx `docs/registry/lynx/registry-ui.ts`에 entry를 추가한다. 의존성 버전 범위는 해당 컴포넌트가 추가된 패키지 버전을 하한으로 잡는다. Lynx entry의 범위에는 `@seed-design/lynx-react`와 `@seed-design/lynx-css`가 모두 들어가야 한다(파일 상단 `*PackageRanges` 상수).
3. 루트 `AGENTS.md`「생성」의 `docs/registry/` 명령으로 registry 산출물을 갱신한다.
4. vendored copy(React `examples/stackflow-spa/src/seed-design/ui/`, Lynx `examples/lynx-spa/src/seed-design/ui/`)가 있으면 같은 API로 맞추고 예제 앱 빌드를 확인한다.

### 문서 업데이트

Snippet 레이어가 있는 컴포넌트의 문서는 다음 형태로 맞춘다. 예: `docs/content/react/components/checkbox.mdx`, `docs/content/lynx/components/accordion.mdx`.

1. `## Installation`에 `npx @seed-design/cli@latest add ui:[name]`과 수동 설치 컴포넌트(React `<ManualInstallation name="[name]" />`, Lynx `<LynxManualInstallation name="[name]" />`)를 둔다.
2. `## Usage`가 있으면 import 경로를 바꾼다: React `seed-design/ui/[name]`, Lynx는 [Lynx 문서·예제 작업](lynx-docs.md#배포-경로-확인)의 배포 경로 규칙.
3. Props 절 경로를 React `./registry/react/ui/[name].tsx`, Lynx `./registry/lynx/ui/[name].tsx`로 바꾼다.
4. Lynx 문서 → 같은 React 문서의 공통 절 순서, 예제 제목, 시나리오, 사용자 결과를 가능한 한 유지한다. 플랫폼 차이가 실제로 있을 때만 차이와 미지원 기능을 쓰고, 빈 차이 절은 만들지 않는다. 상세는 [Lynx 문서·예제 작업](lynx-docs.md)을 따른다.

## Step 6: Examples

- React → `docs/examples/react/[name]/`. snippet 레이어가 있으면 `seed-design/ui/[name]`에서, `Flex`·`VStack` 같은 Layout 컴포넌트는 `@seed-design/react`에서 import한다.
- Lynx → `docs/examples/lynx/[name]/[scenario].tsx`. `examples/lynx-spa`가 이 문서 예제를 실행한다. import 경로는 [Lynx 문서·예제 작업](lynx-docs.md#배포-경로-확인)에서 확정한 배포 경로를 따른다.
- snippet API가 바뀜 → 대상 플랫폼의 vendored copy(`examples/stackflow-spa/src/seed-design/ui/`, `examples/lynx-spa/src/seed-design/ui/`)와 예제 앱 빌드를 함께 맞춘다.

## Step 7: Storybook

- React → `docs/stories/[ComponentName].stories.tsx`를 추가한다. 작성·리팩터링 전에 [storybook.md](storybook.md)를 읽는다. CSF Next 형식, 필수 story, custom parameters·Chromatic 범위, 검증 명령이 거기 있다. 로컬 확인은 루트에서 `bun storybook`.
- Lynx → Storybook 대신 `examples/lynx-spa`에서 실제 사용 화면을 확인한다.

## Step 8: Documentation

- 디자인 가이드 → `docs/content/components/[name].mdx`
- React → `docs/content/react/components/[name].mdx`
- Lynx → `docs/content/lynx/components/[name].mdx`

Lynx 문서·예제를 새로 만들거나 사용자 결과를 바꿀 때:

1. `scaffold-plan` 결과의 `referenceScenarios`에서 영향받는 React 예제를 읽는다.
2. 대상 시나리오를 고른다. 새 컴포넌트 → 관련 시나리오 전부. 알려진 단일 시나리오의 국소 수정 → 그 시나리오만.
3. 각 시나리오를 `동일 지원`, `Lynx식 변환`, `미지원`으로 분류하고 대응 목록에 다음을 적는다.
   - 문서 절과 예제 논리 ID
   - asset의 정확한 컴포넌트 종류·크기·색상
   - host와 내부 frame의 width·height·padding·정렬
   - 초기 문구·상태·disabled·loading, click·tap 입력과 중간·최종 상태 전이
   - AppBar·본문·하단 CTA 같은 화면 셸
4. 근거 없는 `unknown`은 그 시나리오를 구현하기 전에 해결한다.
5. `미지원` → 실행 예제를 만들지 않고 구현체 부재 근거와 앱 수준 대안을 문서에 남긴다. 형식은 [Lynx 문서·예제 작업](lynx-docs.md#react-문서와-맞추기)을 따른다.
