# @seed-design/cli - 기술 상세

## 개요

| 항목 | 내용 |
|------|------|
| 패키지 | `@seed-design/cli` |
| 런타임 | Node.js >= 18 |
| 언어 | TypeScript (ESM) |
| CLI 프레임워크 | `cac` |
| 프롬프트 | `@clack/prompts` v1 |
| 번들러 | `esbuild` (`build.mjs`, `dev.mjs`) |

## 아키텍처

```text
src/index.ts
  ├─ commands/init.ts
  ├─ commands/add.ts
  └─ commands/add-all.ts

commands/*
  ├─ get-config.ts (seed-design.json 로드/자동 생성)
  ├─ fetch.ts (registry 조회)
  ├─ write.ts (snippet 파일 반영)
  ├─ install.ts (의존성 설치)
  ├─ analytics.ts (telemetry 전송)
  └─ error.ts (공통 에러 포맷)
```

## 핵심 동작

### 1. 설정 파일 로딩/자동 생성

- 설정 로더: `src/utils/get-config.ts`
- 탐색 대상: `seed-design.json` (cosmiconfig)
- 파일이 없으면 사용자 확인 후 기본 설정으로 내부 생성한다.
  - 기본값: `rsc=false`, `tsx=true`, `path="./seed-design"`, `telemetry=true`
- 기존처럼 외부 프로세스(`seed-design init` execa)를 호출하지 않는다.

### 2. 에러 처리 정책

- 공통 에러 유틸: `src/utils/error.ts`
  - `CliError`: 사용자 메시지/힌트/세부정보를 포함한 실패
  - `CliCancelError`: 사용자 취소 흐름
- 기본 출력: 실패 메시지 + 원인 + 해결 힌트
- `--verbose` 출력: stack trace 포함
- 원칙: 유틸은 throw, 명령어에서만 `process.exit` 처리

### 3. 명령어 흐름

- `init`
  - 인터랙티브 질문 또는 `--yes`/`--default`로 기본값 생성
- `add`
  - registry 조회 → 항목 선택/검증 → snippet 반영 → npm 의존성 설치
- `add-all`
  - registry 단위 일괄 선택/검증 → snippet 반영 → npm 의존성 설치

### 4. Telemetry

- 구현: `src/utils/analytics.ts`
- 이벤트: `init`, `add`, `add-all`
- 비활성화 우선순위
  1. `DISABLE_TELEMETRY=true`
  2. `SEED_DISABLE_TELEMETRY=true`
  3. `seed-design.json`의 `telemetry=false`

## 개발 스크립트

| 스크립트 | 설명 |
|---------|------|
| `bun dev` | dev 번들 (`NODE_ENV=dev`) |
| `bun build` | prod 번들 (`bin/index.mjs`) |
| `bun test` | CLI 테스트 실행 |
| `bun lint:publish` | publint 검사 |

## 환경 변수

| 변수 | 설명 | 기본 |
|------|------|------|
| `NODE_ENV` | telemetry 출력 모드 전환 (`dev`/`prod`) | `prod` |
| `POSTHOG_API_KEY` | PostHog API 키 | 선택 |
| `POSTHOG_HOST` | PostHog 호스트 URL | 선택 |
| `DISABLE_TELEMETRY` | telemetry 비활성화 | `false` |
| `SEED_DISABLE_TELEMETRY` | telemetry 비활성화(대체 키) | `false` |
