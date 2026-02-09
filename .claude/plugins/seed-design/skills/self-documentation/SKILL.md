---
name: self-documentation
description: |
  Self-Documentation 구축/유지 스킬. README.md/AGENTS.md/TECH.md 역할 분리와
  nested AGENTS.md 규칙을 적용해 문서가 코드와 동기화되도록 돕습니다.

  사용 예: /self-documentation apps/seed-figma-mcp
argument-hint: "[대상 경로 또는 앱 이름]"
disable-model-invocation: true
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Apply_patch
  - Glob
  - Grep
  - Bash
  - Webfetch
---

# Self-Documentation Skill

문서가 코드와 항상 동기화되도록 유지합니다. 특히 README.md/AGENTS.md/TECH.md
역할을 분리하고, 구조적 디렉토리마다 AGENTS.md를 생성/갱신합니다.

## 레퍼런스 기반 원칙

- AGENTS.md는 "에이전트를 위한 README"로, 루트에 두고 규칙/컨벤션을 명확히 적는다.
- README.md는 사람용 빠른 소개/실행 방법만 담고, 에이전트 지침은 AGENTS.md로 분리한다.
- 모노레포는 하위 패키지/앱에 중첩 AGENTS.md를 두고, 가장 가까운 규칙이 우선한다.
- AGENTS.md는 표준 Markdown이며 필수 필드가 없다. 대신 프로젝트에 필요한 내용을 담는다.
- 문서는 living doc이다. 코드/아키텍처 변경 시 즉시 갱신한다.
- AGENTS.md는 빌드/테스트/컨벤션처럼 에이전트가 필요로 하는 정보에 집중하고 불필요한 중복을 줄인다.

## 사용 시점

- 새 프로젝트 초기화
- 새 디렉토리 생성
- 기능/아키텍처 변경
- 기술 의사결정 추가

## 실행 절차

1. **스코프 확정**
   - 루트인지, 특정 앱인지 확인한다.
   - 해당 경로의 AGENTS.md를 먼저 읽는다.

2. **문서 인벤토리 점검**
   - 루트: `CLAUDE.md`, `AGENTS.md`, `PRD.md`, `TECH.md`, `README.md`
   - 앱/워크스페이스 루트: `AGENTS.md`, `TECH.md`, `README.md`
   - 누락된 문서가 있으면 현재 구현을 근거로 1차 버전을 작성한다.

3. **역할 분리 준수**
   - README.md: 사람을 위한 빠른 소개/실행 방법
   - AGENTS.md: 에이전트용 규칙/컨벤션/실행 절차
   - TECH.md: 기술 의사결정/아키텍처/연동 정보

4. **Nested AGENTS.md 생성/갱신**
   - 구조적 의미가 있는 디렉토리는 AGENTS.md 필수
   - 예: `src/`, `apps/`, `components/`, `services/`, `utils/`, `lib/`, `api/`,
     `routes/`, `pages/`, `types/`, `schemas/`, `models/`
   - `AGENT.md`가 있으면 `AGENTS.md`로 마이그레이션(필요 시 심볼릭 링크 유지)

5. **Self-Documentation 체크리스트 반영**
   - 작업 디렉토리의 AGENTS.md/TECH.md 갱신 필요 여부를 확인한다.
   - 문서에 있는 내용이 코드와 불일치하면 즉시 수정하거나 필요없다면 삭제한다.
   - 기능 변경은 PRD.md, 기술 변경은 TECH.md에 기록한다.
   - README/AGENTS/TECH의 역할 분리 기준을 다시 점검한다.

6. **정확성 우선 작성**
   - 코드/설정/실행 결과로 검증 가능한 내용만 문서화한다.
   - 확인되지 않은 내용은 "미확인"으로 표기하고 추측하지 않는다.
   - 스크립트/엔드포인트/환경 변수는 실제 파일에 근거하여 작성한다.
   - 근거 파일 예: 패키지 매니저 설정(`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml` 등),
     빌드/런타임 설정(`tsconfig.json`, `vite.config.*`, `next.config.*`, `Dockerfile` 등),
     엔트리포인트(`src/index.*`, `main.*`, `app.*`) 및 환경 변수 예시(`.env.example`, `config.*`)

7. **검증 Before Done**
   - 변경 사항이 동작하는지 테스트/타입체크/로그로 증명한다.
   - 관련 스크립트는 `package.json`에 실제 존재하는지 확인한다.
   - 변경 전후 차이가 동작에 영향을 줄 경우 diff 관점으로 설명한다.
   - 스스로 "Staff Engineer가 승인할 수준인가?"를 점검한다.

8. **Self-Improvement Loop**
   - 새로운 디렉토리 생성 시 해당 디렉토리의 AGENTS.md 생성 여부도 확인한다.

## 산출물

- 생성/수정된 문서 목록
- 갱신 이유(기능/기술/아키텍처 변경 여부)
- 검증 결과(실행한 테스트/타입체크/로그)

## 확장 가이드

- 스킬이 길어지면 템플릿/예시는 별도 파일로 분리하고 `SKILL.md`에서 참조한다.
- 필요하면 `$ARGUMENTS`로 대상 경로를 전달해 스코프를 좁힌다.

## 초기 구축 템플릿

아래 템플릿은 **최초 Self-Documentation 구축**에 사용한다.
고정 문구는 그대로 사용하고, 가변 영역은 플레이스홀더로 유지한다.

### 플레이스홀더 규칙

- `{{PROJECT_NAME}}`: 프로젝트/앱 이름
- `{{PROJECT_OVERVIEW}}`: 한 줄 설명(코드/README 기반)
- `{{KEY_APPS}}`: 핵심 앱/모듈 목록
- `{{PRD_REF}}`: PRD 참조 경로
- `{{AGENTS_REF}}`: 해당 디렉토리의 AGENTS.md 경로
- `{{TECH_REF}}`: TECH.md 경로
- `{{COMMANDS}}`: 실제 `package.json` 기반 스크립트
- `{{STRUCTURE}}`: 실제 폴더 구조 요약
- `{{ENV_TABLE}}`: 실제 환경 변수 표
- `{{TECH_DECISIONS}}`: 현재 구현을 근거로 정리한 기술 결정

플레이스홀더는 **코드/문서에 근거한 값만 채운다**. 확증이 없으면 채우지 않고 `미확인`으로 둔다.

### CLAUDE.md (루트)

루트의 CLAUDE.md는 **루트 AGENTS.md 참조 강제**가 목적이다.

```markdown
---
NOTE: Always refer to @AGENTS.md and follow the directions. AGENTS.md files exist in every directory that matters - always read it first when you read or write files in that directory.
---
```

### AGENTS.md (루트)

루트 AGENTS.md는 **문서 분리 원칙 + nested 규칙 + self-documentation**을 고정 포함한다.

```markdown
# {{PROJECT_NAME}} - Agent Guidelines

## 프로젝트 개요

{{PROJECT_OVERVIEW}}

## 핵심 앱/모듈

{{KEY_APPS}}

자세한 기능 요구사항은 {{PRD_REF}} 참고

---

## 문서 분리 원칙

- README.md: 사람용 개요/사용 방법
- AGENTS.md: 에이전트용 규칙/컨벤션/실행 절차
- PRD.md: 기능 요구사항
- TECH.md: 기술 상세, 아키텍처, 구현 결정

---

## Nested AGENTS.md 규칙

- 구조적 의미가 있는 디렉토리에는 AGENTS.md를 둔다.
- 가장 가까운 AGENTS.md가 우선 적용된다.
- 루트 AGENTS.md는 공통 규칙을 제공하고, 하위 AGENTS.md는 해당 폴더 전용 규칙을 추가한다.
- 새 디렉토리를 만들면 즉시 해당 폴더의 AGENTS.md를 작성한다.

---

## Self-Documentation 규칙

- 작업한 폴더의 AGENTS.md/TECH.md 갱신 필요 여부를 항상 확인한다.
- 새 기능이면 PRD.md에 기록한다.
- 기술적 변경이면 해당 범위의 TECH.md에 기록한다.
- 문서와 코드가 불일치하면 즉시 수정한다.

---

## 작업 후 체크리스트

### 코드 품질 검사

- [ ] {{COMMANDS}}

### 문서 동기화

- [ ] 작업한 폴더의 AGENTS.md 업데이트 필요 여부 확인
- [ ] PRD.md / TECH.md 업데이트 필요 여부 확인
- [ ] 사용자 안내 사항(환경 변수 등) 기록

---

## 코드 작성 공통 규칙

- TypeScript/Import/네이밍 규칙을 실제 코드 기준으로 요약한다.
- 확정할 수 없는 규칙은 작성하지 않는다.
```

### AGENTS.md (하위 디렉토리)

하위 AGENTS.md는 **해당 폴더 전용 규칙**만 적는다.

```markdown
## 디렉토리 개요

{{PROJECT_OVERVIEW}}

## 파일 작성 컨벤션

- {{STRUCTURE}}

## 코드 작성 컨벤션

- {{TECH_DECISIONS}}
```

### PRD.md

```markdown
# PRD - Product Requirements Document

## 기능 요구사항

### {{FEATURE_GROUP}}

- {{FEATURE_ITEM}}

---

## 비기능 요구사항

- {{NON_FUNCTIONAL_ITEM}}
```

### TECH.md (앱/워크스페이스 루트)

TECH.md는 **현재 구현 기반**으로 작성한다.

```markdown
# {{PROJECT_NAME}} - 기술 상세

## 개요

| 항목 | 기술 |
|------|------|
| 런타임 | {{RUNTIME}} |
| 프레임워크 | {{FRAMEWORK}} |
| 주요 의존성 | {{DEPENDENCIES}} |

## 아키텍처

{{STRUCTURE}}

## 핵심 기술 결정

{{TECH_DECISIONS}}

## 개발 스크립트

{{COMMANDS}}

## 환경 변수

{{ENV_TABLE}}
```

## 템플릿 채우는 방법

- 프로젝트/앱의 기술 스택을 먼저 식별한다.
  - 패키지 매니저/언어: `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml` 등
  - 프레임워크/빌드: `vite.config.*`, `next.config.*`, `nuxt.config.*`, `svelte.config.*`, `tsconfig.json`,
    `webpack.*`, `Dockerfile`, `Makefile` 등
- 스택을 확정한 뒤, 해당 생태계의 표준 엔트리/설정 파일을 근거로 템플릿을 채운다.
- 스크립트는 실제 스크립트 정의에서만 가져온다(예: `package.json`의 `scripts`).
- 아키텍처/기술 결정은 실제 코드 구조와 데이터 흐름을 근거로 작성한다.
- 확증이 없으면 플레이스홀더를 `미확인`으로 유지한다.

## 주의사항

- AGENTS.md는 "규칙/컨벤션" 문서이며 코드 설명서가 아니다.
- TECH.md는 기술 결정의 근거와 맥락을 유지한다.
- 문서가 코드와 불일치하면 즉시 갱신하거나 필요없다면 삭제한다.
- 문서에 없는 내용을 추측하지 않는다.
