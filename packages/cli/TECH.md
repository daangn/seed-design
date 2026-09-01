# @seed-design/cli TECH

## 개요

- 패키지: `@seed-design/cli`
- 런타임: Node.js >= 20.19.0
- 언어/모듈: TypeScript, ESM
- 핵심 의존성: `@optique/core`, `@optique/run`, `@clack/prompts@1`, `cosmiconfig`, `zod`, `execa`
- 파서 두 패키지는 devDependencies에 정확한 버전으로 고정한다. `build.mjs`가 dependencies를 전부 번들 밖으로 빼기 때문에, devDependencies에 두어야 `bin/index.mjs` 안으로 인라인되어 추가 다운로드가 생기지 않는다.
- 빌드: `esbuild` (`build.mjs`, `dev.mjs`)

## 아키텍처

```text
src/index.ts                       파서 트리 조립과 분기
  ├─ commands/init.ts              initParser / runInit
  ├─ commands/add.ts               addParser / runAdd
  ├─ commands/add-all.ts           addAllParser / runAddAll
  ├─ commands/compat.ts            compatParser / runCompat
  └─ commands/docs.ts              docsParser / runDocsList, runDocsSearch, runDocsRead

src/utils/*
  ├─ cli-options.ts
  ├─ get-config.ts / init-config.ts
  ├─ fetch.ts / write.ts / resolve-dependencies.ts / install.ts
  ├─ docs-address.ts / docs-index.ts
  ├─ analytics.ts
  └─ error.ts
```

명령 파일은 파서와 실행 함수를 각각 export 하고, 트리 조립과 분기는 `src/index.ts`가 맡는다. 실행 함수는 파싱된 값만 받으므로 파서를 거치지 않고 직접 호출할 수 있고, telemetry 테스트가 그렇게 쓴다.

## 기술적 결정

### 1) 설정 파일 부트스트랩을 내부 로직으로 처리

- 파일: `src/utils/get-config.ts`, `src/utils/init-config.ts`
- `seed-design.json`이 없을 때 외부 명령(`seed-design init`)을 `execa`로 재호출하지 않는다.
- 사용자 확인 후 기본값(`rsc=false`, `tsx=true`, `path="./seed-design"`, `telemetry=true`)으로 내부 생성한다.

### 2) 에러 처리 책임 분리

- 파일: `src/utils/error.ts`, `src/commands/*.ts`
- 유틸 레이어는 에러를 `throw`만 하고 종료하지 않는다.
- 커맨드 레이어만 `process.exit(0/1)`을 결정한다.
- 기본 실패 출력은 `실패 메시지 + 원인 + 힌트`, `--verbose`에서 stack trace를 추가 출력한다.

### 3) 명령 성공 경로에서 telemetry는 비핵심(Non-blocking)

- 파일: `src/utils/analytics.ts`, `src/commands/*.ts`
- `init`, `add`, `add-all`, `compat`, `docs-list`, `docs-search`, `docs-read` 이벤트를 전송한다. 이벤트 이름에는 공백을 넣지 않는다.
- telemetry 실패는 명령 성공/실패 판정에 영향을 주지 않는다(실패는 무시 또는 verbose 로그).

### 4) telemetry opt-out 우선순위 고정

- 파일: `src/utils/analytics.ts`
- 우선순위:
  1. `DISABLE_TELEMETRY=true`
  2. `SEED_DISABLE_TELEMETRY=true`
  3. `seed-design.json`의 `telemetry=false`

### 5) 문서 조회를 세 하위 명령으로 나눔

- 파일: `src/commands/docs.ts`, `src/utils/docs-address.ts`, `src/utils/docs-index.ts`
- `docs list`, `docs search`, `docs read` 셋으로 나눈다. 하나의 `docs`가 인자의 모양에 따라 문서 본문과 경로 목록을 번갈아 내면, 파이프로 받는 쪽이 지금 받은 것이 무엇인지 알 수 없다.
- `docs`만 입력하면 하위 명령 안내를 stderr로 내고 종료 코드 `2`로 끝낸다. 뒤에 붙은 값을 주소로 해석하지 않는다.
- 주소 문법은 세 명령이 공유하며 `docs-address.ts`에 있다. 앞 슬래시는 고정 주소(경로 전체 일치), 슬래시 없음은 꼬리 질의(연속된 꼬리 일치), 뒤 슬래시는 범위(그 아래 전부)를 뜻한다.
- 앞 슬래시가 필요한 이유는 문서 경로 51개가 다른 문서 경로의 꼬리이기 때문이다. `components/bottom-sheet`는 그 자체로 완전한 경로인데 꼬리 규칙만으로는 여러 문서에 걸린다.
- 뒤 슬래시가 필요한 이유는 카테고리의 개요 문서와 카테고리 자체가 같은 자리에 있기 때문이다. `/react`는 문서, `react/`는 컨테이너다.
- 주소는 `docs-address.ts`의 `addressOf`가 `docUrl`에서 만든다. `category/section/item`으로 재조립하면 섹션 그룹핑보다 깊은 문서의 중간 slug가 사라지고 서로 다른 두 문서가 같은 주소를 갖는다.
- `docs read`는 주소가 여러 문서를 가리키면 후보를 stderr에 나열하고 종료 코드 `2`로 끝낸다. 자동으로 하나를 고르지 않는다.
- `docs read`는 뒤 슬래시가 붙은 범위 주소를 거부한다. 그 아래 문서가 지금 하나뿐이라고 해서 그것을 답하면, 사이트가 자라는 순간 같은 입력이 다른 뜻이 된다.
- `docs read`의 stdout은 `process.stdout.write`로 쓴다. `console.log`는 문서에 없던 개행을 붙여서 「사이트가 준 바이트만 내보낸다」는 규율을 깬다.
- `docs search`는 공백뿐인 질의를 거부한다. 빈 문자열은 모든 문서의 id에 포함되므로, 막지 않으면 검색이 인덱스 전체를 답한다.
- `docs search`는 이름과 제목의 대소문자 무시 부분 일치만 한다. stdout에는 한 줄에 주소 하나씩만 싣는다. 나중에 매칭 방식을 갈아 끼워도 이것을 쓰는 파이프라인이 그대로 유지되게 하기 위해서다.
- 인덱스에 없는 주소는 URL을 조합해 한 번 시도한다. changelog처럼 콘텐츠 트리가 아니라 패키지·버전별로 생성되는 라우트가 있기 때문이다. 사이트가 모두 404로 답하면 `LlmsTxtNotFoundError`를 인덱스 기반 안내로 바꿔 던지고, 5xx와 타임아웃은 그대로 전달한다.
- 세 명령의 종료 코드는 `0`·`1`·`2` 세 개다. stdout에 답이 있으면 `0`, 명령은 돌았고 답이 부정적이면 `1`, 답을 낼 수 없었으면 `2`다.
- 세 명령 모두 `--cwd`를 받지 않고, 어떤 문서를 답할지 정할 때 `seed-design.json`을 읽지 않는다. 같은 입력이 실행 위치에 따라 다른 문서를 내지 않게 하기 위해서다. telemetry 수집 여부를 판정할 때만 `process.cwd()`의 설정을 읽는데, 이건 답에 관여하지 않는다.

## 패키지 로컬 스크립트

| 스크립트 | 설명 |
|---|---|
| `bun dev` | dev 번들 (`NODE_ENV=dev`) |
| `bun build` | prod 번들 (`bin/index.mjs`) |
| `bun lint:publish` | publint 검사 |

## 주요 환경 변수

| 변수 | 설명 |
|---|---|
| `NODE_ENV` | dev/prod 분기 (`build.mjs`, `dev.mjs`에서 주입) |
| `POSTHOG_API_KEY` | telemetry 전송 API 키 |
| `POSTHOG_HOST` | telemetry 전송 호스트 |
| `DISABLE_TELEMETRY` | telemetry 비활성화 |
| `SEED_DISABLE_TELEMETRY` | telemetry 비활성화(대체 키) |
