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
- 터미널이 없으면 확인을 받을 수 없으므로 생성하지 않고 `seed-design init -y`를 안내하며 종료 코드 `2`로 끝낸다. `add`에 `--yes`를 두지 않는 이유는 경로·프레임워크·telemetry 값이 한 번도 보이지 않은 채 정해지기 때문이다.

### 2) 에러 처리 책임 분리

- 파일: `src/utils/error.ts`, `src/commands/*.ts`
- 유틸 레이어는 에러를 `throw`만 하고 종료하지 않는다.
- 커맨드 레이어만 `process.exit`을 결정한다. 코드는 `src/utils/error.ts`의 `ExitCode`가 이름으로 가지고 있다.
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

### 6) 터미널이 없으면 프롬프트를 호출하기 전에 막는다

- 파일: `src/utils/interactive.ts`, `src/utils/get-config.ts`, `src/utils/init-config.ts`, `src/utils/write.ts`, `src/commands/add.ts`, `src/commands/add-all.ts`, `src/commands/init.ts`
- `canPrompt()`는 `process.stdin.isTTY && process.stdout.isTTY`를 본다. clack은 답을 stdin에서 읽고 질문을 stdout에 그리므로 둘 중 하나만 터미널이어도 프롬프트가 성립하지 않는다.
- 판정을 stdin이 닫혔는지로 하지 않는 이유는 그것이 증상의 한쪽뿐이기 때문이다. `@clack/core`의 `setRawMode`가 `isTTY`로 가드돼 있어 비TTY에서 프롬프트는 예외를 던지지 않고 기다린다. stdin이 닫혀 있으면 `await`가 해소되지 않은 채 이벤트 루프가 비어 Node가 `0`으로 빠져나가고, 열린 파이프면 무한히 기다린다. 종료 코드 계약만 고쳐서는 어느 쪽도 해결되지 않는다. `catch` 블록 자체가 실행되지 않기 때문이다.
- 비대화형 수단을 새로 만들지 않고 이미 있는 인자로 답하게 한다. 전역 `--non-interactive` 플래그는 두지 않는다. 그 플래그의 역할은 「TTY인데도 비대화형처럼 굴어라」뿐이라 판정 수단이지 실행 수단이 아니고, 테스트는 자식 프로세스의 stdin을 `/dev/null`로 붙여 만든다.
- 결말은 두 갈래다. 안전한 기본값이 있으면 그 값으로 진행하고, 없으면 어떤 인자로 답하면 되는지 알린 뒤 `ExitCode.unanswerable`로 끝낸다. 기본값이 있는 것은 `init` 하나뿐이다.

| 프롬프트 | 비TTY 결말 |
|---|---|
| `init-config.ts`의 다섯 문항 | `-y`와 같은 기본값 |
| `get-config.ts`의 설정 파일 생성 | `seed-design init -y` 안내 후 `2` |
| `add.ts`의 항목 multiselect | 인자 예시 안내 후 `2` |
| `add.ts`의 deprecated 확인 | `--include-deprecated` 안내 후 `2` |
| `add-all.ts`의 레지스트리 multiselect | 사용 가능한 목록과 `--all` 안내 후 `2` |
| `write.ts`의 diff 처리 | 파일을 두고 경로를 모아 반환, 호출자가 `2` |

- `write.ts`는 답을 받지 못한 파일의 경로를 `unresolved`로 돌려준다. 사람이 고른 skip과 답하지 못한 skip을 한 덩어리로 묶으면 「완료했어요」와 `0` 아래에 바뀌지 않은 파일이 숨는다.
- `add`·`add-all`은 그 목록을 스니펫 쓰기와 의존성 설치가 모두 끝난 뒤에 던진다. `--on-diff`를 붙여 다시 실행하면 나머지 작업은 이미 끝나 있다.
- `--on-diff`에 `skip`이 있는 이유는 대화형 선택지 셋을 모두 인자로 쓸 수 있게 하기 위해서다. 없으면 「기존 파일을 그대로 두라」를 비대화형으로 표현할 방법이 없다.
- `add`의 `--include-deprecated`는 `add-all`의 같은 이름과 역할이 다르다. `add-all`에서는 대상을 넓히고, `add`에서는 호출자가 이름으로 지목한 항목을 허가한다. `add`에서 조용히 건너뛰면 그것이 이 결정이 없애려는 증상 그 자체다.
- `ExitCode.cancelled`는 사람이 프롬프트 앞에서 멈춘 경우에만 남는다. `add-all`의 「추가할 항목이 없어요」는 취소가 아니라 요청을 수행하지 못한 것이므로 `CliError`로 바꿨다.

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
