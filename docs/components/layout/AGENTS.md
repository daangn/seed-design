# docs/components/layout

문서 셸이 함께 쓰는 프레젠테이션 조각(사이트 Footer, 사이드바 추천 점, 문서 제목 class)이다. 셸 자체는 `src/layouts/`(`DocsShell.astro`·`DocsArticle.astro`)와 `src/shell/`(`DocsNav`·`SiteHeader`·`Toc`·`PageActions` island)에 있다.

## 규칙

### 변경 위치

- 문구·링크만 바뀜 → `lib/*.ts`(`footer-content.ts`, `doc-title.ts`)만 고친다. `*.tsx` 로직은 건드리지 않는다.
- 사이드바·헤더·TOC의 동작과 마크업 → `src/shell/`에서 고친다. 사이드바 항목 모양은 `src/shell/nav-model.ts`, 폴더 규칙은 `src/shell/nav-folders.ts`다.
- 미러 전용(preview/noindex) 관심사 → 이 폴더에 넣지 않고 미러 쪽 코드에서 처리한다. daangn 원본으로의 머지가 깨끗해야 한다.

### 코드

- 한 사용처만을 위한 인터페이스·팩토리를 만들지 않는다 → prop으로 받고, 두 번째 사례가 생길 때 일반화한다.
- barrel(index) 없이 파일 경로로 import한다. 파일은 kebab-case, export는 PascalCase named export로 쓴다.
- `next/*`·`fumadocs-ui` JS를 import하지 않는다 → Astro 정적 렌더링과 island 어디서든 그려지는 plain React로 쓴다.
