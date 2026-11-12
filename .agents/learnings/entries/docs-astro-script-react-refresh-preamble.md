---
id: docs-astro-script-react-refresh-preamble
description: docs의 `.astro` `<script>`(Astro가 번들하는 module script)에서 React 컴포넌트·hook이 든 모듈을 import하려 할 때, 또는 `astro dev`에서만 `@vitejs/plugin-react can't detect preamble`과 `[astro-island] Error hydrating …`이 나며 island가 hydrate되지 않을 때 읽는다. dev에서 React Refresh preamble이 설치되는 시점과, script와 island가 함께 쓰는 모듈을 나누는 기준을 다룬다. 빌드 결과(`astro preview`)에서는 재현되지 않는다.
scope: ["docs/src/components/**", "docs/src/layouts/**", "docs/components/**"]
status: active
verified_at: "2026-11-11"
---

# `.astro` script가 부르는 모듈에는 React 컴포넌트·hook을 두지 않는다

## 교훈과 다음 행동

- `.astro`의 `<script>`가 import하는 모듈에는 React 컴포넌트(PascalCase 함수)나 hook(`use*`)을 두지 않는다. island와 같은 상태를 써야 하면 상태와 DOM 로직은 컴포넌트 없는 `.ts`에 두고, 컴포넌트·hook은 그 `.ts`를 import하는 별도 `.tsx`에 둔다.
- dev에서만 위 오류가 나면 오류의 파일 위치(`window` `error` 이벤트의 `filename`)가 script에서 import한 `.tsx`인지 먼저 본다. 그 모듈이 한 번 실패하면 같은 URL을 import하는 island도 모두 실패하고, Astro의 재시도(`?astro-retry=`)도 의존 모듈은 그대로라 회복하지 않는다.
- 파일 이름을 바꾸거나 지운 뒤에는 dev 서버를 다시 띄운 상태에서 판정한다. 실행 중인 서버는 `.astro` script가 import하던 이전 경로(`…tsx?t=…`)를 계속 내보내, 같은 모듈이 두 벌로 실행된다.

## 발생 근거와 적용 조건

- 상황: 클라이언트 이동에서 `DocsShell`을 유지하는 작업에서 `src/components/DocsClientRouter.astro`의 script가 `PageSlot` 컴포넌트와 `useShellPage` hook이 든 `shell-navigation.tsx`를 import했다. `astro dev`에서 페이지를 5번 새로 불러오면 5번 모두 셸이 hydrate되지 않았다(`data-docs-hydrated` 없음, island에 `ssr` 남음). 빌드 결과에서는 문제가 없었다.
- 원인: `@astrojs/react`는 dev에서 React Refresh preamble을 `injectScript("before-hydration", …)`로 넣는다. preamble은 island가 hydrate를 시작할 때 불러오는 before-hydration 단계에서 설치된다. `.astro` script는 이 단계와 상관없이 실행되고, `@vitejs/plugin-react`가 컴포넌트·hook이 든 모듈에 넣은 검사가 preamble이 없다며 예외를 던진다.
- 확인: React 쪽을 `shell-page.tsx`로 옮기고 script는 컴포넌트·hook 없는 `shell-navigation.ts`만 부르게 바꾼 뒤, dev 서버를 다시 띄워 5번 새로 불러와 모두 오류 없이 hydrate됐다.
- 적용 조건: Astro 7.4.6, `@astrojs/react`의 dev Fast Refresh. React 모듈을 island로만 불러오는 경우는 해당하지 않는다.

## 변경 이력

- 2026-11-11: `DocsShell` 유지 작업에서 dev 전용 hydrate 실패의 원인과 모듈 분리 기준을 기록했다.
- 2026-11-12: 예시로 든 `shell-navigation.ts`·`shell-page.tsx`·`DocsClientRouter.astro`가 client router 제거로 삭제되어 경로 예시를 뺐다. 지금 docs의 `.astro` script 중 React 모듈을 import하는 것은 없다. 원인은 Astro·`@astrojs/react`의 dev 동작이라 교훈은 유지하며, 이번에 재현하지는 않았다.
