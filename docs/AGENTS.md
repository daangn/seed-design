# docs

## 디렉터리 개요

SEED Design 문서 사이트다. Next.js와 Fumadocs 기반으로 컴포넌트 문서, 디자인 가이드라인, Storybook을 제공한다. `content/` 구조는 `public/__docs__/index.json`으로 게시되고, `@seed-design/cli`와 `@seed-design/docs-mcp`가 그 인덱스를 실행 시점에 읽는다. 두 소비자에게 이 인덱스가 유일한 구조 정보이므로, 섹션을 늘리거나 줄일 때 `app/_llms/config.ts`의 등록을 함께 갱신한다.

## 파일 작성 컨벤션

- 문서는 역할 중심 도메인으로 배치하고 MDX 파일명은 `kebab-case`를 사용한다.
- 새 문서 영역·콘텐츠 구조 추가뿐 아니라 기존 문서의 이동·이름 변경·삭제 등 콘텐츠 경로가 바뀔 때도 `packages/docs-mcp/src/config.ts`의 매핑과 관련 동기화 규칙을 검토하고 필요한 항목을 갱신한다.
- `content/` 아래에는 `AGENTS.md`를 추가하지 않는다. Fumadocs가 문서 콘텐츠로 인식할 수 있다.

## 코드 작성 컨벤션

- 문서 frontmatter에는 `title`, `description`을 포함한다.
- 문서 UI와 Storybook은 본문과 분리된 참조 계층으로 관리한다.
- `docs/registry/{react,lynx}/ui/` snippet은 stable user API이자 사용자가 복사해 커스터마이즈하는 계층이다. API를 변경할 때는 minimal user code와 convenience wrapper 여부를 먼저 확인한다.
- snippet 변경 시 `bun generate:all`로 `docs/public/__registry__/` 공개 생성물을 항상 갱신한다. vendored consumer(`examples/stackflow-spa/src/seed-design/ui/`)의 영향은 실제 사용 여부에 따라 확인한다.
- Tailwind utility에 CSS 변수를 넘길 때는 v4 축약 문법을 쓴다. `bg-[var(--x)]`가 아니라 `bg-(--x)`로 적고, `font-`나 `text-`처럼 한 namespace가 여러 속성에 걸리면 `font-(family-name:--x)`, `text-(length:--x)`처럼 타입을 함께 적는다. fallback도 `right-(--x,0px)`으로 그대로 넘어간다.
- 그 변수를 `@seed-design/tailwind4-theme`가 이미 등록했다면 변수를 넘기지 말고 theme utility를 쓴다. `shadow-[var(--seed-shadow-s2)]`가 아니라 `shadow-s2`다. theme utility는 `@utility`가 정의된 namespace에서만 생성되므로(`px-*`는 있고 `left-*`는 없다) 없는 자리에서는 축약 문법으로 넘긴다.

### `app/global.css`를 수정할 때

- 컴포넌트·위젯 전용 스타일은 해당 컴포넌트의 Tailwind `className`으로 처리한다. `global.css`에는 빌드 설정, 디자인 토큰, 루트 요소, 외부 라이브러리, 문서 전체 reset·타이포만 둔다.
- recipe override에 전역 `!important`를 사용하지 않는다. 상태는 inline style 또는 component-local Tailwind로, 마크다운 자식 selector는 `mdx-components.tsx`나 component-local selector로 처리한다.
- Fumadocs의 unlayered 규칙을 덮어야 할 때는 실제 cascade를 확인한 뒤 inline style 또는 대응하는 unlayered global rule을 사용한다.
- 회색 표면은 기존 SEED 중립 토큰을 우선 사용한다. 공유 recipe 자체보다 문서 wrapper의 변수 override를 우선한다.

### `content/lynx/` 문서를 수정할 때

- 웹과 Lynx의 렌더링 방식, API, 누락 기능 차이를 문서화한다.
- 확정된 Lynx Engine 최소 버전과 XElement만 frontmatter의 `compatibility.lynx`에 기록한다. 추정값은 기록하지 않는다.
- `engine`은 실제 요구 버전을 쓰며, `<AvailableSince />`의 버전은 SEED 패키지 출시 버전이다.

## 콘텐츠 작성 룰

- 컴포넌트·훅 문서를 새로 만들 때 frontmatter 직후에 `<AvailableSince />`를 넣는다. 패키지 매핑은 React→`react`+`css`, React Stackflow→`stackflow`+`css`, Lynx component→`lynx-react`+`lynx-css`, Lynx hook→`lynx-react`다.
- 문서에 새 MDX 컴포넌트를 도입하면 llms 변환 핸들러를 함께 추가한다 ([lib/llms/AGENTS.md](lib/llms/AGENTS.md) 참조). 핸들러가 없으면 llms.txt에 raw JSX가 그대로 새어나간다.
- 산문에서는 `SEED Design` 대신 `SEED` 또는 `SEED Design System`을 사용한다.
- `featured: true`는 동시에 소수의 최신 문서에만 사용한다.
