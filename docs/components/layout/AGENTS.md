# docs/components/layout

docs 콘텐츠 페이지의 셸 UI(페이지 렌더러, 사이드바, Footer, overview 레이아웃)다. 각 섹션의 `app/<section>/[[...slug]]/page.tsx`가 데이터를 로드해 `DocsPageRenderer`에 넘기면, 여기서 표준 아티클(`DocsPage`)과 overview 레이아웃을 나눠 그린다. Header는 `components/header/`에 있다.

## 규칙

### 변경 위치

- 문구·링크만 바뀜 → `lib/*.ts`(`footer-content.ts`, `sidebar-items.ts`, `doc-title.ts`)만 고친다. `*.tsx` 로직은 건드리지 않는다.
- 라우팅·source 조회·데이터 로딩 → 각 섹션의 `page.tsx`에 둔다. 이 폴더에는 프레젠테이션만 둔다. Fumadocs UI 컴포넌트·slot은 여기서 써도 된다.
- 라우트별 차이(changelog, deprecated 등) → `page.tsx`가 `DocsPageRendererProps`로 주입한다.
- 사이드바 → `docs-side-navigation.tsx`가 Fumadocs `slots.sidebar.root`를 SEED SideNavigation으로 다시 그린다. 사이드바가 없는 섹션(get-started, updates)은 `no-sidebar-docs-layout.tsx`를 쓴다.
- 미러 전용(preview/noindex) 관심사 → 이 폴더에 넣지 않고 미러 쪽 코드에서 처리한다. daangn 원본으로의 머지가 깨끗해야 한다.

### 코드

- 한 사용처만을 위한 인터페이스·팩토리를 만들지 않는다 → prop으로 받고, 두 번째 사례가 생길 때 일반화한다.
- DocsPage 관련 prop 타입은 새로 정의하지 않고 `ComponentProps<typeof DocsPage>`에서 파생한다.
- barrel(index) 없이 파일 경로로 import한다. 파일은 kebab-case, export는 PascalCase named export로 쓴다.
