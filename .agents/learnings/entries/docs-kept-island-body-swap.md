---
id: docs-kept-island-body-swap
description: docs에서 클라이언트 이동 사이에 React island를 유지하려고 `transition:persist`를 붙이거나 `astro:before-swap`의 swap을 바꿀 때, 또는 이동 뒤 유지한 island의 메뉴·popover가 열리지 않거나 persist island의 본문이 비거나 이전 페이지 것으로 남을 때 읽는다. Astro `swapBodyElement`가 유지한 island의 portal을 떼어 내는 원인과, 이 사이트에 실린 `@fumadocs/astro` `onBeforeSwap`이 persist island의 slot을 옮기는 조건을 다룬다. 첫 로드나 body 교체 뒤 새로 hydrate되는 island에는 해당하지 않는다.
scope: ["docs/src/components/**", "docs/src/layouts/**", "docs/src/pages/**", "docs/components/layout/**"]
status: active
related: ["docs-astro-script-react-refresh-preamble"]
---

# 유지한 island는 `<body>` 교체와 fumadocs slot 이동을 함께 고려한다

## 교훈과 다음 행동

- `document.body`에 portal을 그리는 island(SEED·Floating UI 메뉴, side panel)를 이동 사이에 유지하려면 `<body>` 요소를 바꾸지 않는 swap을 쓴다. Astro 기본 `swapBodyElement`는 persist 요소를 새 `<body>`로 옮기지만 portal container는 떨어진 이전 body에 남는다 → `DocsShell`처럼 `<body>`는 두고 바로 아래 페이지 노드만 바꾼다(`components/layout/shell-navigation.ts`의 `replacePageNodes`).
- island에 `transition:persist`를 붙이기 전에 `@fumadocs/astro`의 `onBeforeSwap`(`node_modules/@fumadocs/astro/dist/navigation.js`)이 실린다는 점을 계산한다. 이 hook은 `transition:persist-props`가 없는 persist island마다 새 문서 island의 slot 자식을 이전 island의 slot으로 옮긴다. 같은 island를 직접 처리하는 코드가 있으면 그 코드가 받는 새 문서의 slot은 이미 비어 있다. slot 구성이 다르면 persist 표시를 지워 유지를 포기한다.
- 직접 swap하는 island에는 persist 표시를 붙이지 않고 다른 속성(예: `component-export`)으로 찾는다. 붙여야 한다면 모든 사용처에 `transition:persist-props`를 함께 붙인다.
- 증상 확인은 이동 뒤 메뉴를 열어 보이는 항목 수를 센다(`getBoundingClientRect` 크기가 0보다 큰 `[role=menuitem]`). 첫 로드에서는 정상이고 클라이언트 이동 뒤에만 0개면 portal이 떨어진 body에 있다.

## 발생 근거와 적용 조건

- 상황: `DocsShell`을 이동 사이에 유지하는 설계 비교에서 Astro `swapBodyElement`로 셸 island를 새 body에 옮긴 두 후보는 첫 로드 뒤에는 버전 전환·LLMs.txt 메뉴가 열렸지만, 클라이언트 이동 뒤에는 보이는 메뉴 항목이 0개였다. `<body>`를 유지한 후보는 이동 뒤에도 각각 5개·3개가 보였다.
- 원인: React portal의 container는 portal을 처음 그릴 때의 `document.body`다. `swapBodyElement`가 새 `<body>`로 바꾸면 그 container는 문서 밖에 남고, 같은 노드를 옮기면 이후 React의 `removeChild`가 실패한다.
- `onBeforeSwap`의 동작은 `@fumadocs/astro` 배포 코드에서 읽었다. persist island를 `transition:persist-props` 없이 두면 새 문서 slot의 자식을 `replaceChildren`으로 옮기고, slot 안 `<script>`를 새 노드로 바꾼다.
- 적용 조건: Astro 7.4.6 `ClientRouter`, `@astrojs/react`, `@fumadocs/astro`의 navigation script가 실린 docs 사이트.

## 변경 이력

- 2026-11-11: `DocsShell` 유지 작업에서 portal 유실 원인과 fumadocs `onBeforeSwap`의 slot 이동 조건을 기록했다.
