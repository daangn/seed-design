# @seed-design/cli TECH

이 문서는 CLI 패키지의 구현 경계와 동작 계약을 다룬다. 저장소 전체 의존성과 작업 경로는 루트 `ARCHITECTURE.md`를 먼저 참고한다.

## 개요

- 패키지: `@seed-design/cli`
- 런타임: Node.js >= 20.19.0
- 언어/모듈: TypeScript, ESM
- 핵심 의존성: `cac`, `@clack/prompts@1`, `cosmiconfig`, `zod`, `execa`
- 빌드: `esbuild` (`build.mjs`, `dev.mjs`)

## 아키텍처

```text
src/index.ts
  ├─ commands/
  │   ├─ init.ts / add.ts / add-all.ts
  │   └─ compat.ts / docs.ts
  ├─ utils/
  │   ├─ init-config.ts / get-config.ts
  │   ├─ fetch.ts / write.ts / install.ts
  │   ├─ get-package-info.ts / get-package-manager.ts
  │   ├─ resolve-dependencies.ts / registry-source.ts
  │   ├─ compatibility.ts / analytics.ts
  │   └─ error.ts
  └─ transformers/
      └─ index.ts
```

- `commands/`는 옵션 파싱, 사용자 상호작용, 종료 코드 결정을 담당한다.
- `utils/`는 설정·원격 registry/docs 조회·파일 기록·의존성 설치·telemetry 같은 재사용 로직을 담당한다.
- `transformers/`는 registry snippet의 TSX/JSX 변환을 담당한다.

## 기술적 결정

### 설정 파일 bootstrap

- `src/utils/get-config.ts`, `src/utils/init-config.ts`가 `seed-design.json`을 읽고 없으면 사용자 확인 후 내부 로직으로 생성한다.
- 기본 설정은 `rsc=false`, `tsx=true`, `framework="react"`, `path="./seed-design"`, `telemetry=true`다.
- `detectFramework(cwd)`는 프로젝트 의존성을 확인해 React 또는 Lynx framework를 선택한다.
- `seed-design init`을 `execa`로 재호출하지 않는다.

### 에러 처리

- `src/utils/error.ts`의 `CliError`와 `CliCancelError`를 사용한다.
- 유틸리티 레이어는 에러를 throw하고 종료하지 않는다.
- `process.exit(0/1)`은 command 레이어에서만 결정한다.
- 기본 출력은 실패 메시지·원인·힌트로 구성하고 `--verbose`에서 stack trace를 추가한다.

### Telemetry

- `init`, `add`, `add-all`, `compat`, `docs` command 결과를 best-effort로 전송한다.
- telemetry 실패는 command의 최종 성공·실패를 바꾸지 않는다.
- tracking 호출은 await되며 네트워크 요청은 최대 5초 timeout이 적용될 수 있다.
- opt-out 우선순위는 `DISABLE_TELEMETRY=true` → `SEED_DISABLE_TELEMETRY=true` → `seed-design.json`의 `telemetry=false`다.

## 패키지 로컬 스크립트

| 스크립트 | 설명 |
|---|---|
| `bun dev` | dev 번들 (`NODE_ENV=dev`) |
| `bun build` | prod 번들 (`bin/index.mjs`) |
| `bun lint:publish` | publint 검사 |

CLI 테스트는 루트 경로 명령으로 실행한다. 패키지 자체에는 test script가 없다.

## 주요 환경 변수

| 변수 | 설명 |
|---|---|
| `NODE_ENV` | dev/prod 분기 (`build.mjs`, `dev.mjs`에서 주입) |
| `POSTHOG_API_KEY` | telemetry 전송 API 키 |
| `POSTHOG_HOST` | telemetry 전송 호스트 |
| `DISABLE_TELEMETRY` | telemetry 비활성화 |
| `SEED_DISABLE_TELEMETRY` | telemetry 비활성화(대체 키) |
