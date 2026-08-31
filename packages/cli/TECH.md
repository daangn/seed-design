# @seed-design/cli TECH

## 개요

- 패키지: `@seed-design/cli`
- 런타임: Node.js >= 20.19.0
- 언어/모듈: TypeScript, ESM
- 핵심 의존성: `cac`, `@clack/prompts@1`, `cosmiconfig`, `zod`, `execa`
- 빌드: `esbuild` (`build.mjs`, `dev.mjs`)

## 아키텍처

```text
src/index.ts
  ├─ commands/init.ts
  ├─ commands/add.ts
  ├─ commands/add-all.ts
  ├─ commands/compat.ts
  ├─ commands/docs.ts
  └─ commands/docs-search.ts

src/utils/*
  ├─ get-config.ts / init-config.ts
  ├─ fetch.ts / write.ts / resolve-dependencies.ts / install.ts
  ├─ docs-index.ts
  ├─ analytics.ts
  └─ error.ts
```

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
- `init`, `add`, `add-all`, `compat`, `docs` 이벤트를 전송한다.
- telemetry 실패는 명령 성공/실패 판정에 영향을 주지 않는다(실패는 무시 또는 verbose 로그).

### 4) telemetry opt-out 우선순위 고정

- 파일: `src/utils/analytics.ts`
- 우선순위:
  1. `DISABLE_TELEMETRY=true`
  2. `SEED_DISABLE_TELEMETRY=true`
  3. `seed-design.json`의 `telemetry=false`

### 5) 문서 조회와 문서 검색을 분리

- 파일: `src/commands/docs.ts`, `src/commands/docs-search.ts`, `src/utils/docs-index.ts`
- `docs`는 주소만 해석한다. 인덱스가 발행하는 문서 경로와 카테고리·섹션 경로 외에는 받지 않으며, `seed-design.json`의 `framework`를 참조하지 않는다. 같은 입력이 실행 위치에 따라 다른 문서를 내지 않게 하기 위해서다.
- 이름 부분 일치와 제목 일치는 `docs-search`가 전담한다. 결과가 여럿인 것이 정상이므로 종료 코드는 `0`이다.
- 문서의 주소는 `docs-index.ts`의 `pathOf`가 `docUrl`에서 만든다. `category/section/item`으로 재조립하면 섹션 그룹핑보다 깊은 문서의 중간 slug가 사라지고 서로 다른 두 문서가 같은 경로를 갖는다.
- `docs`의 종료 코드는 `0`과 `1` 두 개다. 주소는 유일하므로 여러 후보를 뜻하던 `2`가 필요 없다.

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
