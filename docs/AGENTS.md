# docs

Astro 정적 셸과 Fumadocs 데이터 엔진으로 만드는 SEED 문서 사이트다. `content/`가 문서 원천, `registry/`가 CLI로 배포하는 snippet 원천이고, `packages/docs-mcp/src/config.ts`가 `content/` 구조를 MCP section으로 매핑한다.

## 검증

- `bun docs:test`는 `src/structure.test.ts`의 소스 구조 검사(S-1–S-5)를 포함하지만 웹 앱 타입은 보지 않는다 → `src/`·`components/`·`lib/`·`examples/react/`·`registry/react/`의 TS·TSX·`.astro`를 바꿨으면 `bun --filter @seed-design/docs typecheck:web`도 실행한다.
- 셸·등록부·island·route를 바꿨으면 `bun docs:build`까지 실행한다. 마지막 단계 `check:budget`(`scripts/check-page-budget.ts`, O-1–O-5)이 산출물의 island 구조를 검사한다. 이미 빌드한 `out/`만 다시 볼 때는 `cd docs && bun run check:budget`이다.
- `registry/`를 바꿨으면 루트 `AGENTS.md`「생성」대로 `bun docs:generate`를 실행한다. `generate:docs-index`가 `public/__registry__/` index를 읽어 `public/__docs__/`를 만들므로 `generate:registry`만 따로 돌리지 않는다.
- `structure.test.ts`의 `DIRECTIVE_FILES`·`ENGINE_FILES`나 `check-page-budget.ts`의 `LOAD_ALLOWED`·`PERSISTED`·`SCRIPT_ALLOWED`를 넓혀 검사를 통과시키지 않는다 → 목록을 바꿔야 하면 그 이유를 PR 본문에 적는다.

## 규칙

### 렌더링과 hydration

- 셸(`src/layouts/`)과 MDX 본문은 정적 HTML이다. 본문을 island의 children·slot으로 넣지 않는다 → 상호작용은 아래 등록부 규칙의 widget이나 leaf island로 만든다.
- MDX 컴포넌트는 `src/mdx/components.ts` 등록부에만 등록하고, static·widget·island는 그 파일 머리의 규칙으로 고른다. compile plugin이 MDX에 import·directive를 넣게 하지 않는다.
- `client:*`는 `DIRECTIVE_FILES`(셸 layout, `src/mdx/islands/*.astro`, ClientRouter 없는 landing·blocks·admin route)에만 쓴다. MDX 원문에는 쓰지 않는다 → hydrate가 필요한 MDX 컴포넌트는 `src/mdx/islands/<Name>.astro` wrapper를 만들고 `client:visible`(기본)이나 `client:idle`을 붙인다. `client:load`는 `LOAD_ALLOWED`의 셸 island만 쓴다.
- `transition:persist` island는 `DocsNav` 하나다. 이동 뒤에도 React state가 살아야 하는 셸 UI가 생기면 `DocsNav`에 합친다. 이동 뒤 값은 props가 아니라 `#docs-nav-data` → `src/shell/store.ts#syncNavState`로 받는다(persist-props라 props는 첫 hydrate 값으로 남는다).
- render 경로(`src/layouts`·`src/mdx`·`src/pages`)에서 `fetch`·`fs`를 쓰지 않는다 → `prepare:*`가 만든 `.cache/build-data/*.json`이나 저장소 파일을 module로 import한다. render 중 외부 입력은 incremental build가 낡은 HTML을 복원하게 만든다.
- React 컴포넌트를 렌더링하는 `.astro`는 frontmatter에서 `await`하지 않는다. 앞선 I/O 대기가 React renderer의 `useId` 접두사 순서를 바꿔 빌드가 비결정적이 된다 → 데이터는 동기 module import로 읽고, await가 필요한 `.astro`는 아래에 React를 두지 않는다. route 파일 맨 앞의 데이터 로드는 예외다.
- `.astro` `<script>`가 import하는 모듈에는 React 컴포넌트·hook을 두지 않는다 → 상태·DOM 로직은 React 없는 `.ts`(`src/shell/client.ts`·`store.ts`처럼)에 두고 컴포넌트는 그 `.ts`를 import한다.

### 셸 변경 위치

- 섹션 목록은 `src/content/sections.ts`의 `SECTIONS` 하나다. collection·route·llms·검색 태그에 섹션 목록을 따로 두지 않는다.
- 첫 paint 전에 `<html>`에 적용할 사용자 선호(테마, 배너 닫힘)는 `src/shell/root-attributes.ts`에만, 전역 단축키는 `src/shell/client.ts`의 `HOTKEYS`에만, 전체 로드로 보내는 이동 경계는 `src/shell/navigation-guard.ts`에만 둔다.
- 이동 때 닫아야 하는 일시 UI 상태는 `src/shell/store.ts`에 두고 `resetTransientUi()`에 넣는다.

### Fumadocs

- `@fumadocs/astro`·`fumadocs-core/source`는 `ENGINE_FILES`(`astro.config.ts`, `lib/content/satteri-options.ts`, `src/content.config.ts`, `src/content/source.ts`)만 import한다. fumadocs 타입은 `src/content/source.ts` 밖으로 내보내지 않는다 → 페이지·island는 `source.ts`의 직렬화 가능한 값만 받는다.
- `fumadocs-ui` JS를 import하지 않는다. `fumadocs-ui`는 `src/styles/global.css`의 CSS로만 남아 있다.

### 콘텐츠 구조

- `content/` 아래에는 `AGENTS.md`를 두지 않는다. Fumadocs가 문서 콘텐츠로 인식한다 → 콘텐츠 규칙은 이 파일에 쓴다.
- 문서 영역을 추가하거나 문서를 이동·이름 변경·삭제하면 `packages/docs-mcp/src/config.ts`의 `SECTIONS` 매핑을 함께 고친다.
- 새 MDX 컴포넌트를 문서에 도입하면 `lib/llms/AGENTS.md` 절차로 룰과 fixture를 추가한다. 문서 내용만 바꿀 때는 해당하지 않는다.

### MDX 작성

- MDX 파일명은 kebab-case, frontmatter에는 `title`과 `description`을 넣는다.
- 새 컴포넌트·훅 문서는 frontmatter 바로 뒤에 `<AvailableSince />`를 넣는다. 버전은 SEED 패키지 출시 버전이다. 패키지는 다음과 같다.
  - React component → `react` + `css`
  - React Stackflow → `stackflow` + `css`
  - Lynx component → `lynx-react` + `lynx-css`
  - Lynx hook → 훅을 실제로 제공하는 공개 패키지. 독립 훅 패키지가 있으면 그 출시 버전을 쓰고, 기존 `lynx-react` 재export는 본문에서 따로 설명한다.
- 다른 컴포넌트의 컨텍스트 안에서만 유효한 React 종속 컴포넌트는 별도 문서를 만들지 않고 상위 컴포넌트 문서의 하위 섹션으로 쓴다. 예: `AppBar`는 `AppScreen` 문서에서 다룬다.
- 산문에서는 `SEED Design` 대신 `SEED` 또는 `SEED Design System`을 쓴다.
- `featured: true`는 동시에 소수의 최신 문서에만 붙인다.

### `content/lynx/`

- 웹과 다른 렌더링 방식, API, 누락 기능을 문서에 적는다.
- frontmatter `compatibility.lynx`에는 확정된 값만 넣는다: `engine`(실제 요구하는 Lynx Engine 최소 버전), `x-elements`(사용하는 XElement 이름의 kebab-case 배열). 스키마는 `lib/lynx-compatibility.ts`다. 확인하지 못한 값은 추정해 넣지 말고 비워 둔다.
- `engine`에 `<AvailableSince />`의 SEED 패키지 버전을 쓰지 않는다 → Engine 요구 버전만 쓴다.
- Props 표(`<react-type-table>`)는 SEED가 직접 선언한 prop만 보인다. `@lynx-js/types`에서 온 native 속성, `packages/lynx-react/src/types.ts`의 공통 요소 속성(`className`·`style`·`children`·`bindtap`), 통째로 상속한 StyleProps(Box·Stack 문서 제외)는 `components/type-table/generator.ts`가 뺀다 → native 속성을 그대로 넘기는 prop은 `Pick<IntrinsicElements[...], ...>`으로 선언하고, 표에 보여야 하는 prop은 SEED 고유 동작을 JSDoc으로 적어 직접 선언한다. 표가 비면 "고유 prop이 없습니다."와 받는 공통 속성을 한 줄로 쓴다.
- 컴포넌트 문서에 Headless 패키지(`@seed-design/lynx-react-<name>`)의 섹션·설치 안내·예제·props 표를 넣지 않는다. 사용자가 Headless를 styled 컴포넌트 대신 쓰도록 오해한다 → Headless API는 패키지 JSDoc에, Headless consumer 검증은 `examples/lynx-spa` 페이지에 둔다. Registry snippet이 의존성으로 추가하는 패키지는 사실 한 줄로만 적는다.

### Registry snippet

- `registry/{react,lynx}/ui/`는 사용자가 복사해 커스터마이즈하는 공개 API다. API를 바꾸기 전에 최소 사용 코드와 convenience wrapper가 필요한지 `skills/seed-component/references/api-design.md` 기준으로 먼저 정한다. React snippet 절차는 `registry/react/ui/AGENTS.md`에 있다.
- React snippet을 바꾸면 vendored copy `examples/stackflow-spa/src/seed-design/ui/`도 `examples/stackflow-spa/AGENTS.md`「Snippet 동기화」대로 맞춘다.

### Tailwind

- `@seed-design/tailwind4-theme`가 등록한 변수는 theme utility로 쓴다: `shadow-[var(--seed-shadow-s2)]` 대신 `shadow-s2`. utility는 `@utility`가 정의된 namespace에만 생긴다(`px-*`는 있고 `left-*`는 없다).
- utility가 없는 자리는 v4 축약 문법으로 넘긴다: `bg-[var(--x)]` 대신 `bg-(--x)`, fallback은 `right-(--x,0px)`.
- `font-`·`text-`처럼 한 namespace가 여러 속성에 걸리면 타입을 붙인다: `font-(family-name:--x)`, `text-(length:--x)`.

### `src/styles/global.css`

- 컴포넌트·위젯 전용 스타일은 넣지 않는다 → 해당 컴포넌트의 Tailwind `className`으로 처리한다. `global.css`에는 빌드 설정, 디자인 토큰, 루트 요소, 외부 라이브러리, 문서 전체 reset·타이포만 둔다.
- recipe override에 전역 `!important`를 쓰지 않는다 → 상태는 inline style이나 component-local Tailwind로, 마크다운 자식 selector는 MDX 등록부(`src/mdx/components.ts`)가 가리키는 컴포넌트나 component-local selector로 처리한다.
- Fumadocs의 unlayered 규칙을 덮어야 하면 실제 cascade를 확인한 뒤 inline style이나 대응하는 unlayered global rule을 쓴다.
- 회색 표면은 기존 SEED 중립 토큰을 쓴다. 공유 recipe를 고치지 말고 문서 wrapper에서 변수를 override한다.
- cascade layer 순서는 `<head>` 맨 앞 inline 선언이 정한다(`src/components/BaseHead.astro`). CSS 파일 import로 옮기지 않는다 → `astro dev`는 모듈마다 `<style>`을 따로 넣어 layer 순서가 빌드와 달라진다. 스타일을 바꾸면 빌드 결과와 `astro dev`를 둘 다 본다.
