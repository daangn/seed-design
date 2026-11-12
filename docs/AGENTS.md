# docs

Astro·Fumadocs 기반 SEED 문서 사이트다. `content/`가 문서 원천이고 `registry/`가 CLI로 배포하는 snippet 원천이며, `packages/docs-mcp/src/config.ts`가 `content/` 구조를 MCP section으로 매핑한다.

## 검증

- `bun docs:test`는 웹 앱 타입을 검사하지 않는다 → `src/`·`components/`·`lib/`·`examples/react/`·`registry/react/`의 TS·TSX를 바꿨으면 `bun --filter @seed-design/docs typecheck:web`도 실행한다.
- `registry/`를 바꿨으면 루트 `AGENTS.md`「생성」대로 `bun docs:generate`를 실행한다. `generate:docs-index`가 `public/__registry__/` index를 읽어 `public/__docs__/`를 만들므로 `generate:registry`만 따로 돌리지 않는다.

## 규칙

### 콘텐츠 구조

- `content/` 아래에는 `AGENTS.md`를 두지 않는다. Fumadocs가 문서 콘텐츠로 인식한다 → 콘텐츠 규칙은 이 파일에 쓴다.
- 문서 영역을 추가하거나 문서를 이동·이름 변경·삭제하면 `packages/docs-mcp/src/config.ts`의 `SECTIONS` 매핑을 함께 고친다.
- 새 MDX 컴포넌트를 문서에 도입하면 `lib/llms/AGENTS.md` 절차로 룰과 fixture를 추가한다. 문서 내용만 바꿀 때는 해당하지 않는다.

### MDX 컴포넌트

- MDX 컴포넌트는 기본으로 빌드 때 정적 HTML이 된다. 브라우저에서 상호작용해야 하는 컴포넌트는 `lib/satteri/rehype-mdx-islands.ts`의 `ISLAND_ROOTS`(부모의 context에 의존하면 `ISLAND_MEMBERS`)와 `components/mdx-island.tsx`의 `islandComponents`에 같은 이름으로 등록한다.
- island의 props는 직렬화되어 브라우저로 넘어간다. 빌드 시점 데이터(파일·registry·생성 manifest)가 필요한 컴포넌트는 `src/components/mdx/`에 `.astro` wrapper로 만들고 `src/components/mdx/components.ts`에 등록한다.
- island 경계에는 `<astro-island>`·`<astro-slot>` 래퍼가 DOM에 남아 `>`·`+`·`:first-child` 선택자가 끊긴다. 본문 전체가 `.prose > astro-slot` 아래에 있다 → island나 slot 경계를 건너는 구조 선택자(Tailwind의 `*:`·`[&>…]` 포함)를 추가하면 `src/styles/astro-wrappers.css`에 래퍼를 건너는 대응 규칙을 함께 둔다.
- CI 빌드는 안 바뀐 페이지를 캐시에서 복원한다(Production 포함). 문서 페이지가 렌더링 때 모듈 import나 `content/` 밖 추적 파일이 아닌 데이터(외부 API 응답, 추적하지 않는 생성물)를 새로 읽게 되면 `lib/incremental-build.ts`의 캐시 키에 그 입력을 넣는다. 넣을 수 없으면 그 route의 `getStaticPaths`에서 `cacheKey`를 빼 항상 렌더링하게 한다.
- `astro.config.ts`에서 도달하는 모듈(`lib/content/satteri-options.ts`와 그 import)에서는 `@/` alias를 쓰지 않는다. 설정을 불러올 때는 Vite alias가 적용되지 않는다 → 상대 경로로 import한다.

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

### 페이지 이동과 사이드바 상태

- 링크 이동은 문서 전체 로드다. client router(`ClientRouter`)를 두지 않는다 → 이동을 빠르게 하려면 `astro.config.ts`의 `prefetch`(hover 때 다음 HTML을 받아 둔다)를 쓴다.
- 데스크톱 사이드바의 폴더 열림 상태와 스크롤 위치는 `components/layout/docs-sidebar-restore.tsx`가 이어 준다. 떠날 때(`visibilitychange` → hidden) 사이드바 트리 id별 `sessionStorage` key에 남기고, 다음 문서의 HTML을 파싱하는 동안 사이드바 안의 inline script(목록 앞 설정, 폴더마다 하나, 목록 뒤 스크롤)가 되살린다. 현재 페이지가 든 폴더는 저장 상태와 관계없이 열린다. 모바일 메뉴 패널은 되살리지 않는다.
- 되살리는 script를 island 뒤나 `<head>`로 옮기지 않는다. island의 HTML에 본문 전체가 들어 있어 첫 paint보다 늦거나 사이드바가 아직 없다 → 사이드바 마크업 안에 둔다.
- SEED Collapsible의 열림 마크업(root·trigger·icon·content의 `data-open`, trigger의 `aria-expanded`·`aria-controls`, content의 `hidden`), scroller selector(`#nd-sidebar .seed-scroll-fog`)와 파싱 중 목록을 올려 두는 transform이 걸리는 그 직접 자식, 폴더 script가 폴더 root의 마지막 자식이라는 배치가 바뀌면 script의 DOM 조작도 맞춘다. 맞지 않으면 hydration은 조용히 통과하고(prod는 속성을 비교하지 않는다) 화면과 React state가 어긋난다 → `astro dev`에서 저장 상태를 둔 채 hydration 경고가 없는지, 느린 HTML 서버로 프레임마다 사이드바가 그대로인지 확인한다(`.agents/learnings/entries/docs-load-time-flicker-and-shift.md`).
- layout 위쪽 흐름에 늦게 끼어드는 요소(`client:only` island, effect에서 정하는 요소)는 첫 paint 전에 자리를 비워 둔다. 비워 두지 않으면 나타날 때 사이드바를 포함한 문서 전체가 밀린다. 최신 버전 안내 배너는 `components/latest-version-banner.tsx`의 `latestVersionBannerScript`(`Layout.astro`의 `<head>`)가 아카이브 빌드·host·닫힘 key로 띄울지 정해 `<html data-latest-version-banner>`를 붙이고, 같은 파일의 style이 자리와 `--fd-banner-height`를 잡는다. 조건을 바꿀 때는 이 script만 고친다 → 컴포넌트는 표시를 읽을 뿐이다. 배너는 `localhost`·`127.0.0.1`·운영 host에서 뜨지 않으므로 `docs.localhost`처럼 다른 host로 띄워 측정한다.
- island의 첫 render는 hydration 시점의 DOM과 같아야 한다. 보통은 서버 HTML이다. 첫 render에서 `<html>` 속성이나 `localStorage`를 읽으면 hydration이 실패해 island 전체를 다시 그리고 사용자가 바꾼 상태가 사라진다 → `useSyncExternalStore`의 server snapshot이나 effect에서 읽는다(`hooks/useTheme.ts`). 예외는 HTML 파싱 중 inline script가 DOM을 바꾸고 바꾼 값을 전역에 남긴 경우다. 첫 render는 그 전역을 읽어 바뀐 DOM과 맞춘다(`restoredFolderOpen`).

### `src/styles/global.css`

- 컴포넌트·위젯 전용 스타일은 넣지 않는다 → 해당 컴포넌트의 Tailwind `className`으로 처리한다. `global.css`에는 빌드 설정, 디자인 토큰, 루트 요소, 외부 라이브러리, 문서 전체 reset·타이포만 둔다.
- recipe override에 전역 `!important`를 쓰지 않는다 → 상태는 inline style이나 component-local Tailwind로, 마크다운 자식 selector는 `components/mdx-components.tsx`나 component-local selector로 처리한다.
- Fumadocs의 unlayered 규칙을 덮어야 하면 실제 cascade를 확인한 뒤 inline style이나 대응하는 unlayered global rule을 쓴다.
- 회색 표면은 기존 SEED 중립 토큰을 쓴다. 공유 recipe를 고치지 말고 문서 wrapper에서 변수를 override한다.
