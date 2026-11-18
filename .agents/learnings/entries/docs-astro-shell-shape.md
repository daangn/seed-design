---
id: docs-astro-shell-shape
description: docs Astro 셸·레이아웃을 바꾸면서 여러 셸 UI(사이드바·헤더·검색·TOC)를 하나의 React island나 공유 context로 묶으려 할 때, MDX 본문을 island의 children·slot으로 넣으려 할 때, 문서 이동을 전체 로드로 돌리거나 사이드바 상태를 sessionStorage·inline script로 복원하려 할 때 읽는다. 첫 Astro 이전(c1a2105fd)이 빌드는 빨라졌는데 방문 경험 때문에 revert된 구조적 원인과, 재이전 구조가 같은 실패를 막는 지점을 다룬다. 개별 MDX 컴포넌트의 static·widget·island 선택은 `src/mdx/components.ts`가 다룬다.
scope: ["docs/src/layouts/**", "docs/src/shell/**", "docs/src/mdx/**", "docs/scripts/check-page-budget.ts", "docs/src/structure.test.ts"]
status: active
related: ["docs-load-time-measurement", "docs-astro-script-react-refresh-preamble"]
---

# docs 셸을 하나의 island로 묶으면 증상별 우회가 쌓인다

## 교훈과 다음 행동

- 셸 UI가 상태를 공유해야 한다는 이유로 레이아웃 전체를 React island 하나로 감싸지 않는다 → 셸은 정적 `.astro`로 두고, island 사이의 일시 상태는 `src/shell/store.ts` atom으로 잇는다. 이동 뒤 살아야 하는 state는 persist island `DocsNav` 하나에 둔다.
- MDX 본문을 island의 slot으로 넣지 않는다. persist island의 slot은 갱신되지 않아 client router와 함께 쓸 수 없고, island 경계 래퍼가 본문의 구조 선택자(`>`·`+`·`:first-child`)를 끊는다.
- 증상별 우회(inline script로 마크업 패치, sessionStorage 복원, 래퍼 CSS 재작성)가 두세 개 쌓이면 구조를 의심한다. 재이전은 이 모양을 `src/structure.test.ts`(소스)와 `scripts/check-page-budget.ts`(산출물)가 빌드 전후에 막는다 → 두 검사의 허용 목록을 넓혀 통과시키지 않는다.
- 완료 기준을 "기존 사이트와 같은 DOM"으로 두지 않는다. 이동 시 document 요청 0, 폴더 상태 유지, 기사와 사이드바 강조의 같은 프레임, JS 바이트·CLS 같은 방문 경험 지표로 판정한다.

## 발생 근거와 적용 조건

- c1a2105fd(#2627, ac0162349 #2656로 revert): 문서 페이지 전체(헤더·사이드바·검색·TOC·article 껍데기)를 `client:load` React island `DocsShell` 하나로 감싸고 MDX 본문을 그 slot에 넣은 MPA였다. client router는 시도했다가 걷어 내 모든 링크 이동이 전체 로드였고, 로드 직후 decoded JS가 1.57–2.2MB였다. 사이드바 폴더 상태는 sessionStorage와 폴더별 inline script로 SEED Collapsible 마크업을 고쳐 흉내 냈다. island 래퍼 때문에 293쪽에서 4,717개 요소의 computed style이 달라 래퍼 CSS를 따로 썼다. 그 PR의 학습 기록 6개 중 5개가 이 모양에서 생긴 증상이었다.
- 재이전(2026-11): 정적 셸 + `<ClientRouter />`, persist island `DocsNav` 하나(props 전용, 이동 뒤 값은 `#docs-nav-data` → store), 본문은 정적 `<main>`의 slot, MDX 상호작용은 widget·leaf island로 바꿨다. Phase 2 게이트에서 문서 안 이동 23회의 document 요청 0(marker alive)과 같은 섹션·섹션 왕복·사이드바 없는 페이지 경유의 폴더 상태 유지를 세 엔진으로 확인했다.
- 적용 조건: `astro@7.4.11` ClientRouter, `@astrojs/react@7.1.8`. 근거의 세부 측정은 이전 작업의 로컬 기록에 있고 저장소에는 없다.

## 변경 이력

- 2026-11-18: docs Astro 재이전 cutover에서 첫 시도의 revert 원인과 재이전 구조의 차이를 기록했다.
