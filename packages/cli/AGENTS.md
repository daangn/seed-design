## 디렉토리 개요

`packages/cli`는 `@seed-design/cli` 패키지의 소스와 빌드 설정을 관리하며, `seed-design init/add/add-all/compat` 명령과 `seed-design docs list/search/read` 하위 명령을 제공한다. 사용자 문서는 `docs/content/react/getting-started/cli/`와 동기화한다.

- 런타임은 Node.js >= 20.19.0이고, TypeScript ESM으로 쓴다.
- 핵심 의존성은 `@optique/core`, `@optique/run`, `@clack/prompts@1`, `cosmiconfig`, `zod`, `execa`다.
- 빌드는 `esbuild`가 `build.mjs`·`dev.mjs`로 수행한다.

```text
src/index.ts                       파서 트리 조립과 분기
  ├─ commands/init.ts              initParser / runInit
  ├─ commands/add.ts               addParser / runAdd
  ├─ commands/add-all.ts           addAllParser / runAddAll
  ├─ commands/compat.ts            compatParser / runCompat
  └─ commands/docs.ts              docsParser / runDocsList, runDocsSearch, runDocsRead

src/utils/
  ├─ cli-options.ts                여러 명령이 공유하는 옵션 파서
  ├─ interactive.ts                프롬프트를 띄울 수 있는 환경인지 판정
  ├─ get-config.ts / init-config.ts
  ├─ fetch.ts / write.ts / resolve-dependencies.ts / install.ts
  ├─ docs-address.ts / docs-index.ts
  ├─ analytics.ts
  └─ error.ts                      CliError / CliCancelError / ExitCode
```

## 파일 작성 컨벤션

- `src/commands/`: 사용자가 직접 호출하는 커맨드. 파일마다 파서(`xParser`)와 실행 함수(`runX`)를 각각 export 한다.
- `src/utils/`: 명령 간 공유 로직(설정, fetch, write, install, analytics, error, 공유 옵션 파서).
- `src/tests/`: 독립 단위 테스트.
- 엔트리포인트는 `src/index.ts` 단일 파일을 유지하고, 빌드 결과물(`bin/`)은 생성물로 취급한다.
- 파일명은 역할 중심 소문자 kebab-case를 유지하고, barrel file은 만들지 않는다.
- 파서 두 패키지(`@optique/core`, `@optique/run`)는 devDependencies에 정확한 버전으로 고정한다. `build.mjs`가 dependencies를 전부 번들 밖으로 빼기 때문에, devDependencies에 두어야 `bin/index.mjs` 안으로 인라인되어 사용자 쪽에 추가 다운로드가 생기지 않는다.
- CLI 옵션이나 동작을 바꾸면 아래 문서를 함께 갱신한다.
  - `docs/content/react/getting-started/cli/commands.mdx`
  - `docs/content/react/getting-started/cli/configuration.mdx`
  - `skills/seed-design/SKILL.md`
- 배포 가능한 변경은 `.changeset/*.md`를 함께 추가한다.

## 참고 스킬

`@optique/core`가 배포에 함께 실어 보내는 `optique` 스킬이 `skills-npm`을 통해 이 디렉토리에 걸린다. 파서 코드를 쓰기 전에 그 스킬을 읽는다. 세부는 `skills/AGENTS.md`의 「의존성이 제공하는 스킬」에 있다.

## 코드 작성 컨벤션

사용자 대상 메시지는 한국어 톤을 유지한다.

### 용어

`add`·`add-all`이 쓰는 말을 정본으로 삼는다. 사용자 문구와 코드 식별자가 같은 층을 같은 이름으로 부르게 하기 위해서다.

| 층 | 코드 식별자 | 한국어 | 실체 |
|---|---|---|---|
| 1 | `PublicRegistry` / `registryId` | 레지스트리 | `ui`, `lib`, `breeze` |
| 2 | `PublicRegistryItem` / `itemId` | 항목 | `action-button`. 사람이 고르고 CLI가 추가하는 단위 |
| 2′ | `itemKey` | (표기만 존재) | `ui:action-button`. 레지스트리와 항목을 이은 주소 |
| 3 | `snippets[]` / `snippet.path` | 스니펫 | 항목이 담고 있는 소스 파일 하나 |
| 4 | (디스크에 쓰인 결과) | 파일 | `seed-design/breeze/animate-number/animate-number.tsx` |

```text
레지스트리 breeze
└─ 항목 animate-number                    ← seed-design add breeze:animate-number
   ├─ 스니펫 animate-number/animate-number.tsx
   └─ 스니펫 animate-number/animate-number.module.css
                                          ↓ utils/write.ts
   파일 seed-design/breeze/animate-number/animate-number.tsx
   파일 seed-design/breeze/animate-number/animate-number.module.css
```

- **항목과 스니펫은 1:N이다.** 대부분의 항목은 스니펫 하나지만, 위처럼 `.tsx`와 `.module.css`가 함께 들어가기도 하고 `ui:app-screen`(`app-screen.tsx` + `app-bar.tsx`)처럼 파츠 둘이 한 항목으로 묶이기도 한다. 그래서 고르고, 받고, 호환성을 검사하고, 의존성을 푸는 일은 전부 항목 단위로 하고 스니펫은 그 안에서만 센다. 사용자에게 개수를 말할 때도 같다.
- **스니펫과 파일은 같은 것을 두 관점에서 부른다.** 레지스트리에 실려 오는 동안은 스니펫이고, 디스크에 놓인 뒤로는 파일이다. `utils/write.ts`가 그 경계에서 말을 갈아탄다. 이름이 늘 같지도 않아서, 경로는 `seed-design.json`의 `path` 아래 `{registryId}/{snippet.path}`로 놓이고 `tsx: false`면 `.tsx`·`.ts`가 `.jsx`·`.js`로 바뀐다.
- `itemKey`에는 한국어 이름이 없다. 그래서 힌트가 매번 `ui:action-button과 같은 형식으로`처럼 실물을 예로 든다.
- `컴포넌트`는 이 계층에 없는 말이다. 항목에는 UI 컴포넌트가 아닌 것도 있다.

### 레이어 책임

- 종료(`process.exit`)는 `src/commands/`에서만 한다. `src/utils/`는 종료하지 않고 예외를 throw 하며, 어떤 종료 코드로 끝낼지는 그 예외를 받은 명령이 정한다.
- `src/utils/`에서 `@clack/prompts`를 직접 부르는 것은 대화형 명령만 지나는 경로에 한한다. 여러 명령이 공유하는 유틸의 출력 규칙은 아래 「출력 스트림」에 있다.
- 사용자 취소는 `CliCancelError`, 그 밖의 실패는 `CliError`로 구분한다. 무엇을 취소로 볼지는 아래 「종료 코드」에 있다.

### 파서 선언

- 여러 명령이 공유하는 옵션은 `src/utils/cli-options.ts`에 둔다. 같은 옵션이 두 명령에서 다른 이름으로 갈라지지 않게 하기 위해서다.
- 옵션은 Optique 조합자로 선언하고, 값 검증은 값 파서(`choice`, `path` 등)가 맡는다. 파서가 이미 보장한 모양을 zod로 다시 검증하지 않는다. 네트워크로 받은 JSON을 검증하는 `src/schema.ts`는 별개다.
- 파서 트리 조립과 분기는 `src/index.ts`가 전담한다. 실행 함수는 파싱된 값만 받으므로 파서를 거치지 않고 직접 호출할 수 있고, telemetry 테스트가 그렇게 쓴다.

## 동작 규약

CLI가 밖으로 드러내는 계약이다. 사용자 문서와 테스트가 이 규약에 묶여 있으므로, 여기를 바꾸면 「파일 작성 컨벤션」의 문서 목록과 `src/tests/output-streams.test.ts`·`src/tests/noninteractive.test.ts`를 함께 고친다.

### 출력 스트림

- **실패는 명령 종류와 무관하게 `reportCliError`로 stderr에 낸다.** stderr만 감시하는 자동화가 실패를 놓치지 않도록, 실패 사유가 stdout에 남는 경로를 만들지 않는다. 함께 보여줄 정보는 그 자리에서 출력하지 말고 `CliError`의 `details`에 실어 보낸다.
- **기본 실패 출력은 「실패 메시지 + 원인 + 힌트」이고, `--verbose`에서 stack trace를 덧붙인다.**
- **명령의 성격에 따라 stdout에 무엇을 남길지가 갈린다.** `docs`와 `compat`은 결과를 파이프로 넘겨받는 쪽이 있으므로, 결과만 stdout에 내고 검사 대상·건수·진행 상태·해결 힌트는 stderr에 낸다. clack 프레임도 그리지 않는다. 반면 `add`·`add-all`·`init`은 사람이 대화형으로 쓰는 명령이므로 clack 프레임을 stdout에 유지한다.
- **여러 명령이 공유하는 `src/utils` 경로는 직접 출력하지 않는다.** `formatCompatibilityReport`처럼 문자열을 만들어 반환하고, 어느 스트림에 어떤 모양으로 낼지는 호출한 명령이 정한다.

### 종료 코드

- 코드는 `src/utils/error.ts`의 `ExitCode`가 이름으로 갖는다. 숫자를 직접 쓰지 않는다. `process.exit(ExitCode.answeredNegatively)`는 그 자리에서 무엇을 뜻하는지 말하지만 `process.exit(1)`은 말하지 않는다.
- `0`은 stdout에 답이 있다는 뜻이고, `1`은 명령이 정상적으로 돌았지만 답이 부정적이라는 뜻이며, `2`는 답을 내지 못했다는 뜻이다. 네트워크 장애와 「검사해서 문제를 찾았다」를 한 코드로 묶으면 CI가 전자를 후자로 읽는다.
- `1`은 보고할 판정이 있는 명령만 쓴다. `compat`이 호환되지 않는 항목을 찾았을 때, `docs search`에 걸리는 문서가 없을 때, `docs list`가 그 주소 아래에서 아무것도 찾지 못했을 때 셋뿐이다. `init`·`add`·`add-all`은 판정이 없으므로 `0`과 `2`만 쓴다.
- `ExitCode.cancelled`는 사람이 프롬프트 앞에서 멈춘 경우에만 쓴다. 아무도 멈추지 않았는데 작업을 끝내지 못한 것은 취소가 아니라 `CliError`다.

### 비대화형 실행

대화형을 기본값으로 하는 명령(`init`·`add`·`add-all`)에 적용한다.

- **명령이 이루려는 작업은 인자만으로 끝까지 갈 수 있어야 한다.** 프롬프트를 새로 만들 때는 그 답을 미리 넘길 인자를 함께 만든다. 답할 길이 없는 프롬프트가 하나라도 있으면 그 명령은 터미널 밖에서 완주할 수 없다.
- **모드만 바꾸는 플래그는 만들지 않는다.** `--non-interactive`처럼 「묻지 마라」라고만 말하는 플래그는 답을 들고 있지 않아서, 명령은 여전히 무엇을 할지 모르는 채로 실패할 자리만 옮긴다. 인자는 답을 실어 날라야 한다. `--on-diff backup`은 「충돌하면 백업해」라는 답이고, `-y`는 「모든 질문에 문서화된 기본값으로 답해」라는 답이다.
- **질문을 띄울 수 없으면 프롬프트를 호출하기 전에 갈라선다.** `canPrompt()`(`src/utils/interactive.ts`)를 프롬프트보다 먼저 부른다. 호출한 뒤에는 늦다. clack은 비TTY에서 예외를 던지지 않고 기다리기만 하므로, stdin이 닫혀 있으면 `await`가 해소되지 않은 채 이벤트 루프가 비어 Node가 `0`으로 빠져나가고, 열린 파이프면 끝나지 않는다. 그 경로에서는 `catch`도 실행되지 않아 종료 코드나 에러 처리로는 손댈 수 없다.
- **판정은 stdin과 stdout을 함께 본다.** clack은 답을 stdin에서 읽고 질문을 stdout에 그린다. 한쪽만 보면 아무도 보지 않는 파이프 안에 선택기를 그리게 된다.
- **결말은 하나다.** **어떤 인자를 넘기면 이 명령을 완주할 수 있는지** 적고 `ExitCode.unanswerable`로 끝낸다. 프롬프트를 그려놓고 멈춰 있지 않는다.
- **문서화된 기본값이 있어도 CLI가 대신 고르지 않는다.** `init`의 다섯 문항은 모두 기본값을 갖지만, 그 값으로 파일을 만들어 버리면 경로·프레임워크·telemetry가 한 번도 보이지 않은 채 굳는다. `-y`는 그 기본값을 쓰겠다는 사람의 답이고, 질문을 띄울 수 없다는 사정은 그 답을 대신하지 않는다.
- **답을 받지 못해 하지 않은 일을 성공으로 보고하지 않는다.** 사람이 고른 건너뛰기와 답을 받지 못한 건너뛰기는 종료 코드가 달라야 한다. 한 덩어리로 묶으면 「완료했어요」와 `0` 아래에 바뀌지 않은 파일이 숨는다.

프롬프트가 있는 자리와 각각의 비TTY 결말은 다음과 같다. 「터미널이 없다」가 아니라 「stdin과 stdout 중 하나라도 터미널이 아니다」가 조건이므로, 출력만 리다이렉트해도 이 경로를 지난다.

| 프롬프트 | 미리 답할 인자 | 비TTY 결말 |
|---|---|---|
| `utils/init-config.ts` init 다섯 문항 | `-y` | `seed-design init -y` 안내 후 `2` |
| `utils/get-config.ts` 설정 파일 생성 | 없음. `init`이 담당 | `seed-design init -y` 안내 후 `2` |
| `commands/add.ts` 항목 multiselect | 위치 인자 `ITEM_ID` | 인자 예시 안내 후 `2` |
| `commands/add.ts` deprecated 확인 | `--include-deprecated` | 항목 이름과 함께 안내 후 `2` |
| `commands/add-all.ts` 레지스트리 multiselect | 위치 인자 `REGISTRY_ID` 또는 `--all` | 사용 가능한 목록 안내 후 `2` |
| `utils/write.ts` diff 처리 | `--on-diff overwrite\|backup\|skip` | 파일을 두고 경로를 모아 반환, 호출자가 `2` |

## 기술 결정과 근거

### 설정 파일 부트스트랩을 내부 로직으로 처리

`seed-design.json`이 없을 때 외부 명령(`seed-design init`)을 `execa`로 재호출하지 않고 `src/utils/init-config.ts`로 직접 만든다. 질문을 띄울 수 없으면 만들지 않고 `seed-design init -y`를 안내한다. `add`에 `--yes`를 두지 않는 이유는 경로·프레임워크·telemetry 값이 한 번도 보이지 않은 채 정해지기 때문이다. 설정 파일을 만드는 일은 `init`이 이미 갖고 있다.

### `--on-diff`의 세 값과 `--include-deprecated`의 두 얼굴

`--on-diff`에 `skip`이 있는 이유는 대화형 선택지 셋을 모두 인자로 쓸 수 있게 하기 위해서다. 없으면 「기존 파일을 그대로 두라」를 비대화형으로 표현할 방법이 없다.

`add`의 `--include-deprecated`는 `add-all`의 같은 이름과 역할이 다르다. `add-all`에서는 대상을 넓히고, `add`에서는 호출자가 이름으로 지목한 항목을 허가한다. `add`에서 조용히 건너뛰면 그것이 「비대화형 실행」이 없애려는 증상 그 자체다.

### 명령 성공 경로에서 telemetry는 비핵심

`src/utils/analytics.ts`가 `init`, `add`, `add-all`, `compat`, `docs-list`, `docs-search`, `docs-read` 이벤트를 보낸다. 이벤트 이름에는 공백을 넣지 않는다. telemetry 실패는 명령의 성공·실패 판정에 영향을 주지 않는다.

opt-out 우선순위는 고정이다. `DISABLE_TELEMETRY=true`, `SEED_DISABLE_TELEMETRY=true`, `seed-design.json`의 `telemetry=false` 순으로 본다.

### 문서 조회를 세 하위 명령으로 나눔

관련 파일은 `src/commands/docs.ts`, `src/utils/docs-address.ts`, `src/utils/docs-index.ts`다.

- `docs list`, `docs search`, `docs read` 셋으로 나눈다. 하나의 `docs`가 인자의 모양에 따라 문서 본문과 경로 목록을 번갈아 내면, 파이프로 받는 쪽이 지금 받은 것이 무엇인지 알 수 없다.
- `docs`만 입력하면 하위 명령 안내를 stderr로 내고 `2`로 끝낸다. 뒤에 붙은 값을 주소로 해석하지 않는다.
- 주소 문법은 세 명령이 공유하며 `docs-address.ts`에 있다. 앞 슬래시는 고정 주소(경로 전체 일치), 슬래시 없음은 꼬리 질의(연속된 꼬리 일치), 뒤 슬래시는 범위(그 아래 전부)를 뜻한다.
- 앞 슬래시가 필요한 이유는 문서 경로 51개가 다른 문서 경로의 꼬리이기 때문이다. `components/bottom-sheet`는 그 자체로 완전한 경로인데 꼬리 규칙만으로는 여러 문서에 걸린다.
- 뒤 슬래시가 필요한 이유는 카테고리의 개요 문서와 카테고리 자체가 같은 자리에 있기 때문이다. `/react`는 문서, `react/`는 컨테이너다.
- 주소는 `docs-address.ts`의 `addressOf`가 `docUrl`에서 만든다. `category/section/item`으로 재조립하면 섹션 그룹핑보다 깊은 문서의 중간 slug가 사라지고 서로 다른 두 문서가 같은 주소를 갖는다.
- `docs read`는 주소가 여러 문서를 가리키면 후보를 stderr에 나열하고 `2`로 끝낸다. 자동으로 하나를 고르지 않는다.
- `docs read`는 뒤 슬래시가 붙은 범위 주소를 거부한다. 그 아래 문서가 지금 하나뿐이라고 해서 그것을 답하면, 사이트가 자라는 순간 같은 입력이 다른 뜻이 된다.
- `docs read`의 stdout은 `process.stdout.write`로 쓴다. `console.log`는 문서에 없던 개행을 붙여서 「사이트가 준 바이트만 내보낸다」는 규율을 깬다.
- `docs search`는 공백뿐인 질의를 거부한다. 빈 문자열은 모든 문서의 id에 포함되므로, 막지 않으면 검색이 인덱스 전체를 답한다.
- `docs search`는 이름과 제목의 대소문자 무시 부분 일치만 한다. stdout에는 한 줄에 주소 하나씩만 싣는다. 나중에 매칭 방식을 갈아 끼워도 이것을 쓰는 파이프라인이 그대로 유지되게 하기 위해서다.
- 인덱스에 없는 주소는 URL을 조합해 한 번 시도한다. changelog처럼 콘텐츠 트리가 아니라 패키지·버전별로 생성되는 라우트가 있기 때문이다. 사이트가 모두 404로 답하면 `LlmsTxtNotFoundError`를 인덱스 기반 안내로 바꿔 던지고, 5xx와 타임아웃은 그대로 전달한다.
- 세 명령 모두 `--cwd`를 받지 않고, 어떤 문서를 답할지 정할 때 `seed-design.json`을 읽지 않는다. 같은 입력이 실행 위치에 따라 다른 문서를 내지 않게 하기 위해서다. telemetry 수집 여부를 판정할 때만 `process.cwd()`의 설정을 읽는데, 이건 답에 관여하지 않는다.

## 패키지 로컬 스크립트

| 스크립트 | 설명 |
|---|---|
| `bun dev` | dev 번들 (`NODE_ENV=dev`) |
| `bun build` | prod 번들 (`bin/index.mjs`) |
| `bun lint:publish` | publint 검사 |

테스트는 저장소 루트에서 `bun test packages/cli`로 돌린다.

## 주요 환경 변수

| 변수 | 설명 |
|---|---|
| `NODE_ENV` | dev/prod 분기 (`build.mjs`, `dev.mjs`에서 주입) |
| `POSTHOG_API_KEY` | telemetry 전송 API 키 |
| `POSTHOG_HOST` | telemetry 전송 호스트 |
| `DISABLE_TELEMETRY` | telemetry 비활성화 |
| `SEED_DISABLE_TELEMETRY` | telemetry 비활성화(대체 키) |
