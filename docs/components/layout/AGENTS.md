# docs/components/layout

docs 콘텐츠 페이지의 셸 조각(사이드바, 탭 스트립, 이전/다음, Footer 등)이다. `src/layouts/DocsLayout.astro`가 grid와 헤더·내비게이션·검색 island를, `src/components/DocsPage.astro`가 표준 아티클·overview·산문 껍데기를 정적으로 그린다.

## 규칙

### 변경 위치

- 문구·링크만 바뀜 → `lib/*.ts`(`footer-content.ts`, `sidebar-items.ts`, `doc-title.ts`)만 고친다. `*.tsx` 로직은 건드리지 않는다.
- 라우팅·source 조회·데이터 로딩 → 각 섹션의 `[...slug].astro`에 둔다. 이 폴더에는 프레젠테이션과 빌드 때 쓰는 view-model 함수(`buildSidebarGroups`, `findPrevNext`)만 둔다. Fumadocs UI의 개별 컴포넌트·CSS는 여기서 써도 된다.
- 라우트별 차이(changelog, deprecated 등) → `[...slug].astro`가 `DocsPage.astro`의 props로 주입한다. island의 props는 직렬화되므로 React 노드 대신 값으로 넘기고, 서버에서 그린 조각은 Astro named slot(`platform-status`, `meta`)으로 넘긴다.
- 사이드바·모바일 메뉴 패널 → `docs-side-navigation.tsx`의 내비게이션 island가 SEED SideNavigation으로 그린다. 목록은 `DocsLayout.astro`가 `buildSidebarGroups`로 만든 `groups`다. 사이드바가 없는 섹션(get-started, updates)은 `DocsPage.astro`에 `sidebar={false}`를 넘긴다.
- 셸 구조(정적 마크업과 island의 경계, grid 열 폭) → `docs/AGENTS.md`「문서 셸」을 따른다.
- Header → 이 폴더가 아니라 `components/header/`에서 고친다.
- 미러 전용(preview/noindex) 관심사 → 이 폴더에 넣지 않고 미러 쪽 코드에서 처리한다. daangn 원본으로의 머지가 깨끗해야 한다.

### 코드

- 한 사용처만을 위한 인터페이스·팩토리를 만들지 않는다 → prop으로 받고, 두 번째 사례가 생길 때 일반화한다.
- barrel(index) 없이 파일 경로로 import한다. 파일은 kebab-case, export는 PascalCase named export로 쓴다.
