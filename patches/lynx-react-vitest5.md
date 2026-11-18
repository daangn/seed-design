# ReactLynx 테스트 환경 vitest 5 임시 패치

대상은 개발 버전 `@lynx-js/react@0.129.1`과 peer 하한 `@lynx-js/react@0.117.0`이다.
개발 버전 패치는 루트 `package.json`과 `bun.lock`의 `patchedDependencies`로 등록하며,
`bun install`할 때 적용된다.
0.117.0 패치는 등록하지 않는다. `.github/workflows/lynx-test.yml`의 peer 하한 matrix가
`overrides`와 함께 등록해 설치한다.

`testing-library/dist/env/vitest.js`가 `vitest/environments`에서 `builtinEnvironments`를 가져온다.
vitest 5는 이 export 경로를 없애고 같은 값을 `vitest/runtime`에서 내보낸다.
패치 없이는 Lynx 패키지의 Vitest worker가 시작하지 못해 모든 테스트 파일이 실행되지 않는다.
이 패치는 import 경로 한 줄만 `vitest/runtime`으로 바꾼다.

확인은 `bun test:lynx-react`로 한다.
`@lynx-js/react` 개발 버전을 올리면 `patchedDependencies` 키와 패치를 새 버전에 맞춰 다시 만든다.
peer 하한을 바꾸면 workflow matrix 값과 하한 버전 패치를 함께 바꾼다.
bun은 대상 버전이 없으면 경고만 내고 설치를 계속하므로 install 성공만으로 적용 여부를 판단하지 않는다.
업스트림이 vitest 5를 지원하면 이 패치를 제거한다.
