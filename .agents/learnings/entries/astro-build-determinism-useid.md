---
id: astro-build-determinism-useid
description: docs Astro 빌드를 두 번 돌리거나 incremental과 `--force` 산출물을 비교했는데 HTML 일부가 React `useId` 접두사(`_r18R_` ↔ `_r17R_` 같은 id·`aria-*` 값)만 다를 때, 또는 React 컴포넌트를 렌더링하는 `.astro`에서 frontmatter `await`를 쓰려 할 때 읽는다. Astro React renderer가 접두사를 주는 방식과 비결정성의 원인, 캐시 정합성 비교 전에 대조군을 두는 순서를 다룬다. incremental 캐시가 낡은 값을 복원하는 문제(render 중 fs·fetch)는 원인이 다르다.
scope: ["docs/src/**", "docs/astro.config.ts", "docs/scripts/compare-build-output*"]
status: active
---

# React를 렌더링하는 `.astro`의 await는 빌드를 비결정적으로 만든다

## 교훈과 다음 행동

- incremental 정합성을 판정하기 전에 같은 tree를 `astro build --force`로 두 번 빌드해 `diff -rq`가 0인지 먼저 본다. 대조군이 다르면 incremental 문제가 아니라 빌드 비결정성이다.
- 차이가 `useId` 접두사뿐이면 그 페이지에서 React를 렌더링하기 전에 I/O를 기다리는 `.astro`를 찾는다. 데이터는 동기 module import(JSON·`import.meta.glob` eager·virtual module)로 바꾸고, await가 꼭 필요한 `.astro` 아래에는 React 컴포넌트를 두지 않는다. route 파일 맨 앞의 데이터 로드는 모든 renderer 호출보다 앞이라 괜찮다.
- 규칙은 `docs/AGENTS.md`「렌더링과 hydration」과 `src/structure.test.ts` S-5(휴리스틱)가 지킨다. S-5가 통과해도 하위 컴포넌트의 await는 잡지 못하므로 대조군 비교를 대신하지 않는다.

## 발생 근거와 적용 조건

- 상황(2026-11-13, Astro 재이전 Phase 0 스파이크): 외부 입력 4종의 incremental vs `--force` 비교가 모두 `updates/pickers-dialog-select.html` 한 파일에서 달랐고, `--force` 2회 대조군도 같은 파일이 달랐다.
- 원인: `@astrojs/react-renderer` 0.1.2 `server.js`(L61–65)가 static 렌더마다 요청 단위 카운터(`incrementId(result)`)로 `identifierPrefix`를 준다. 예제 컴포넌트를 `.astro` 안에서 `await loader()`로 불러 렌더 완료 순서가 실행마다 달라졌다.
- 확인: await를 없앤 구성에서 Phase 3 같은 tree `--force` 2회 빌드가 2,543파일 차이 0이었고 접두사도 같았다.
- 적용 조건: `astro@7.4.11`, `@astrojs/react@7.1.8`(renderer 0.1.2). renderer의 접두사 부여 방식이 바뀌면 다시 확인한다.

## 변경 이력

- 2026-11-18: Astro 재이전에서 스파이크·Phase 3 근거로 기록했다.
