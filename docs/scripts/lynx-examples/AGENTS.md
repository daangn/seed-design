# docs/scripts/lynx-examples

`docs/examples/lynx`의 ReactLynx entry를 찾아 Rspeedy로 빌드하고 `docs/public/__lynx__`에 게시한다. 브라우저 미리보기와 native Lynx bundle을 manifest 하나로 관리한다.

## 검증

- 테스트 → `bun test docs/scripts/lynx-examples`
- 타입 → `bun --filter @seed-design/docs typecheck:lynx-tooling`
- 실제 빌드 → `bun --filter @seed-design/docs build:lynx-examples`, 개발 모드는 `build:lynx-examples:development`

## 규칙

- 실행 진입점은 `build.ts`, `watch.ts`, `prepare-workspace.ts`뿐이다. 재사용 로직은 `discovery.ts`, `manifest.ts`, `workspace.ts`처럼 역할별 모듈에 두고 같은 이름의 `.test.ts`를 붙인다.
- `prepare-workspace.ts`는 docs의 `dev`·`typecheck`와 `examples/lynx-spa`의 `dev`·`build` script가 직접 실행한다 → 인자나 동작을 바꾸면 두 `package.json`의 호출도 함께 고친다.
- 경로, schema 버전, 도구 버전은 `constants.ts`에서만 선언한다.
- production과 development 빌드는 `build.ts`의 `buildLynxExamples`를 함께 쓴다 → 모드별 빌드 함수를 따로 만들지 않는다.
- 파일 시스템 함수는 기본 경로를 인자로 받는다(예: `discoverLynxExamples(examplesDirectory = EXAMPLES_DIRECTORY)`). 테스트는 임시 디렉터리를 넘긴다.
- 오류 메시지에는 문제가 된 논리 ID나 실제 경로를 넣는다.
- `manifest.json`은 bundle 검증과 복사가 끝난 뒤 임시 파일을 rename해 교체한다 → 직접 덮어쓰지 않는다.
