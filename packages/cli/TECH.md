# @seed-design/cli TECH

CLI의 설정·오류·telemetry·빌드 동작 계약이다. 이 동작을 바꾸면 사용자 문서와 테스트(`src/tests/`)를 함께 고친다. 런타임 하한(`engines.node`)과 의존성은 `package.json`이 원천이다.

## 설정 bootstrap

- `src/utils/get-config.ts`가 `seed-design.json`을 읽고, 없으면 사용자 확인 뒤 `src/utils/init-config.ts`의 내부 로직으로 만든다.
- 기본값은 `init-config.ts`의 `DEFAULT_INIT_CONFIG`(`rsc=false`, `tsx=true`, `framework="react"`, `path="./seed-design"`, `telemetry=true`)다. 기본값을 바꾸면 `docs/content/react/getting-started/cli/configuration.mdx`도 고친다.
- `detectFramework(cwd)`가 프로젝트 의존성으로 `react`와 `lynx` 중 하나를 고른다.

## 오류 출력

- 기본 출력은 실패 메시지·원인·힌트다(`handleCliError`). `--verbose`일 때만 stack trace를 덧붙인다.
- `execa` 실패는 `error.ts`가 실행 명령, 종료 코드, stderr(없으면 stdout)를 원인 항목으로 풀어 쓴다.

## Telemetry

- `init`, `add`, `add-all`, `compat`, `docs`의 결과를 best-effort로 보낸다. 전송 실패가 명령의 성공·실패를 바꾸지 않는다.
- 전송은 await되고 요청마다 5초 timeout이 걸린다(`src/utils/analytics.ts`). 명령 종료가 최대 5초 늦어질 수 있으므로 전송 호출을 늘릴 때 고려한다.
- 끄는 조건은 `DISABLE_TELEMETRY=true` → `SEED_DISABLE_TELEMETRY=true` → `seed-design.json`의 `telemetry=false` 순으로 확인한다.
- `NODE_ENV`가 `"dev"`인 번들은 전송하지 않는다. `POSTHOG_HOST`나 `POSTHOG_API_KEY`가 비어 있어도 전송하지 않는다.

## 빌드

- `bun --filter @seed-design/cli build`로 실행한다. 패키지 폴더의 `bun build`는 script가 아니라 Bun 내장 번들러를 실행한다.
- prod 빌드(`build.mjs`)는 `.env`를 읽고(`dotenv/config`) `NODE_ENV`를 `"prod"`로, `POSTHOG_API_KEY`·`POSTHOG_HOST`를 빌드 시점 값으로 번들에 치환한다. 값 없이 빌드한 `bin/`은 실행 환경에 값이 있어도 이벤트를 보내지 않는다.
- dev 빌드(`dev.mjs`, `bun cli:watch`)는 `NODE_ENV`만 `"dev"`로 치환한다.
- 두 빌드 모두 gitignore된 `bin/index.mjs`를 쓴다. snippet의 TSX→JSX, RSC 변환은 `src/utils/transformers/`에 있다.
