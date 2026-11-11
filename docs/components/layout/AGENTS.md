# docs/components/layout

docs 콘텐츠 페이지의 셸 UI(페이지 렌더러, 사이드바, Footer, overview 레이아웃)다. 각 섹션의 `src/pages/<section>/[...slug].astro`가 데이터를 로드해 `DocsShell`(`docs-shell.tsx`) island의 props로 넘기면, 여기서 표준 아티클(`DocsPage`)과 overview 레이아웃을 나눠 그린다. MDX 본문은 island의 slot으로 들어오는 정적 HTML이다. Header는 `components/header/`에 있다.

## 규칙

### 변경 위치

- 문구·링크만 바뀜 → `lib/*.ts`(`footer-content.ts`, `sidebar-items.ts`, `doc-title.ts`)만 고친다. `*.tsx` 로직은 건드리지 않는다.
- 라우팅·source 조회·데이터 로딩 → 각 섹션의 `[...slug].astro`에 둔다. 이 폴더에는 프레젠테이션만 둔다. Fumadocs UI 컴포넌트·slot은 여기서 써도 된다.
- 라우트별 차이(changelog, deprecated 등) → `[...slug].astro`가 `DocsShellProps`로 주입한다. props는 island로 직렬화되므로 React 노드 대신 값으로 넘기고, 서버에서 그린 조각은 Astro named slot(`platform-status`, `meta`)으로 넘긴다. named slot을 추가하면 `shell-page.tsx`의 `useShellPage`가 돌려주는 slot 매핑에도 넣는다(`@astrojs/react`가 붙인 camelCase 이름, 예: `platformStatus`) → 빠지면 클라이언트 이동한 페이지에서 그 slot이 비어 보인다.
- 사이드바 → `docs-side-navigation.tsx`가 Fumadocs `slots.sidebar.root`를 SEED SideNavigation으로 다시 그린다. 사이드바가 없는 섹션(get-started, updates)은 `no-sidebar-docs-layout.tsx`를 쓴다.
- 미러 전용(preview/noindex) 관심사 → 이 폴더에 넣지 않고 미러 쪽 코드에서 처리한다. daangn 원본으로의 머지가 깨끗해야 한다.

### 코드

- 한 사용처만을 위한 인터페이스·팩토리를 만들지 않는다 → prop으로 받고, 두 번째 사례가 생길 때 일반화한다.
- DocsPage 관련 prop 타입은 새로 정의하지 않고 `ComponentProps<typeof DocsPage>`에서 파생한다.
- `DocsShell`은 클라이언트 이동 사이에 유지된다(`shell-navigation.ts`). 같은 섹션 안에서는 `RootProvider`·layout(헤더·사이드바) state가 남고, `Fragment key={pathname}` 안의 페이지 영역(`DocsPageRenderer`·`ProsePage`·`TokenReferencePage`)은 이동마다 새로 mount된다 → 페이지마다 처음부터 시작할 state는 페이지 영역 컴포넌트에 둔다. layout에 두면 다음 페이지로 넘어간다.
- barrel(index) 없이 파일 경로로 import한다. 파일은 kebab-case, export는 PascalCase named export로 쓴다.
