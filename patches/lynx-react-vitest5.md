# ReactLynx 테스트 환경 vitest 5 임시 패치

대상은 `@lynx-js/react@0.117.0`이다.
루트 `package.json`과 `bun.lock`의 `patchedDependencies`로 등록하며,
`bun install`할 때 적용된다.

`testing-library/dist/env/vitest.js`가 `vitest/environments`에서 `builtinEnvironments`를 가져온다.
vitest 5는 이 export 경로를 없애고 같은 값을 `vitest/runtime`에서 내보낸다.
패치 없이는 Lynx 패키지의 Vitest worker가 시작하지 못해 모든 테스트 파일이 실행되지 않는다.
이 패치는 import 경로 한 줄만 `vitest/runtime`으로 바꾼다.

확인은 `bun test:lynx-react`로 한다.
`@lynx-js/react` 0.129.1도 같은 경로를 쓴다. 업스트림이 vitest 5를 지원하거나
`@lynx-js/react` 버전을 올리면 이 패치를 재검토한다.
