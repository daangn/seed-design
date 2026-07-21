# 레이아웃 컴포넌트 (`docs/components/layout`)

## 디렉토리 개요

docs **콘텐츠 페이지의 셸 UI**(공용 페이지 렌더러, SideNavigation 사이드바, Footer, Index/Overview 레이아웃)를
모은 곳. 각 섹션 라우트의 `app/<section>/[[...slug]]/page.tsx`가 데이터를 로드해 `DocsPageRenderer`에 넘기면,
표준 아티클(`DocsPage`) ↔ overview 레이아웃 분기와 공통 Footer를 여기서 그린다. 사이드바는
`docs-side-navigation.tsx`가 fumadocs `slots.sidebar.root`로 SEED SideNavigation 위에 재구성한다
(get-started/updates는 `no-sidebar-docs-layout.tsx`로 사이드바를 비운다). Header는 `components/header/`가 담당한다.

## 파일 작성 컨벤션

- 프레젠테이션 컴포넌트는 `*.tsx`, 콘텐츠·설정 데이터는 `lib/*.ts`로 분리한다.
  문구·링크 변경은 `lib/`에서만 하고 컴포넌트 로직은 건드리지 않는다.
- barrel(index) 없이 파일 경로로 직접 import 한다(주변 `docs/components` 관례).
- 네이밍: 파일은 kebab-case, export는 PascalCase named export.

## 코드 작성 컨벤션

- 컴포넌트는 Fumadocs에 결합하지 않는다(이식·재사용 가능하게). 라우팅/데이터 로딩은
  page.tsx에, 프레젠테이션만 여기에 둔다.
- 라우트별 차이(clerk TOC, changelog, deprecated 등)는 page.tsx가 prop으로 주입한다.
  단일 사용처를 위한 인터페이스/팩토리는 만들지 않는다 — 두 번째 사례가 생기면 그때 일반화.
- 타입: `any`/`as unknown` 금지, `type` import 사용. DocsPage 관련 prop 타입은
  `ComponentProps<typeof DocsPage>`에서 파생해 중복 정의를 피한다.
- 미러 전용(preview/noindex) 관심사와 결합하지 않는다 → daangn 머지가 깨끗해야 한다.
