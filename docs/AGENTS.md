# docs

Next.js·Fumadocs 기반 SEED 문서 사이트다. `content/`가 문서 원천이고 `registry/`가 CLI로 배포하는 snippet 원천이며, `packages/docs-mcp/src/config.ts`가 `content/` 구조를 MCP section으로 매핑한다.

## 검증

- `bun docs:test`는 웹 앱 타입을 검사하지 않는다 → `app/`·`components/`·`lib/`·`examples/react/`·`registry/react/`의 TS·TSX를 바꿨으면 `bun --filter @seed-design/docs typecheck:web`도 실행한다.
- `registry/`를 바꿨으면 루트 `AGENTS.md`「생성」대로 `bun docs:generate`를 실행한다. `generate:docs-index`가 `public/__registry__/` index를 읽어 `public/__docs__/`를 만들므로 `generate:registry`만 따로 돌리지 않는다.

## 규칙

### 콘텐츠 구조

- `content/` 아래에는 `AGENTS.md`를 두지 않는다. Fumadocs가 문서 콘텐츠로 인식한다 → 콘텐츠 규칙은 이 파일에 쓴다.
- 문서 영역을 추가하거나 문서를 이동·이름 변경·삭제하면 `packages/docs-mcp/src/config.ts`의 `SECTIONS` 매핑을 함께 고친다.
- 새 MDX 컴포넌트를 문서에 도입하면 `app/_llms/AGENTS.md` 절차로 룰과 fixture를 추가한다. 문서 내용만 바꿀 때는 해당하지 않는다.

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

### Registry snippet

- `registry/{react,lynx}/ui/`는 사용자가 복사해 커스터마이즈하는 공개 API다. API를 바꾸기 전에 최소 사용 코드와 convenience wrapper가 필요한지 `skills/seed-component/references/api-design.md` 기준으로 먼저 정한다. React snippet 절차는 `registry/react/ui/AGENTS.md`에 있다.
- React snippet을 바꾸면 vendored copy `examples/stackflow-spa/src/seed-design/ui/`도 `examples/stackflow-spa/AGENTS.md`「Snippet 동기화」대로 맞춘다.

### Tailwind

- `@seed-design/tailwind4-theme`가 등록한 변수는 theme utility로 쓴다: `shadow-[var(--seed-shadow-s2)]` 대신 `shadow-s2`. utility는 `@utility`가 정의된 namespace에만 생긴다(`px-*`는 있고 `left-*`는 없다).
- utility가 없는 자리는 v4 축약 문법으로 넘긴다: `bg-[var(--x)]` 대신 `bg-(--x)`, fallback은 `right-(--x,0px)`.
- `font-`·`text-`처럼 한 namespace가 여러 속성에 걸리면 타입을 붙인다: `font-(family-name:--x)`, `text-(length:--x)`.

### `app/global.css`

- 컴포넌트·위젯 전용 스타일은 넣지 않는다 → 해당 컴포넌트의 Tailwind `className`으로 처리한다. `global.css`에는 빌드 설정, 디자인 토큰, 루트 요소, 외부 라이브러리, 문서 전체 reset·타이포만 둔다.
- recipe override에 전역 `!important`를 쓰지 않는다 → 상태는 inline style이나 component-local Tailwind로, 마크다운 자식 selector는 `components/mdx-components.tsx`나 component-local selector로 처리한다.
- Fumadocs의 unlayered 규칙을 덮어야 하면 실제 cascade를 확인한 뒤 inline style이나 대응하는 unlayered global rule을 쓴다.
- 회색 표면은 기존 SEED 중립 토큰을 쓴다. 공유 recipe를 고치지 말고 문서 wrapper에서 변수를 override한다.
