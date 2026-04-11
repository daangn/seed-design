---
name: seed-design
description: SEED Design 통합 가이드. 프로젝트 셋업, 컴포넌트 탐색/사용, 파운데이션(색상·타이포·스페이싱) 활용, 테마/스타일링, CLI 워크플로우(init/add/add-all/compat/docs/upgrade), 스니펫 버전 호환성, 업그레이드 진단까지 커버. SEED Design 관련 질문이면 이 스킬을 사용한다. 사용자가 "SEED 어떻게 써?", "컴포넌트 뭐 있어?", "색상 토큰 쓰는 법", "디자인시스템 셋업" 같은 질문을 하면 반드시 이 스킬을 로드한다.
user-invocable: true
argument-hint: "[질문 또는 주제]"
---

# SEED Design

당근의 디자인 시스템 SEED Design을 프로젝트에 도입하고 활용할 때 사용하는 통합 가이드입니다. 처음 셋업부터 컴포넌트 사용, 파운데이션 활용, CLI 운영까지 모든 단계를 안내합니다.

## 동작 방식

이 스킬이 호출되면 아래 순서로 동작합니다.

### 1단계: 프로젝트 상태 파악

사용자의 프로젝트를 분석하여 현재 상태를 파악합니다.

- `seed-design.json` 존재 여부 → 초기 설정 완료 여부
- `package.json`에서 `@seed-design/react`, `@seed-design/css` 설치 여부와 버전
- 번들러 종류 감지 (`vite.config`, `rsbuild.config`, `webpack.config` 등)
- `seed-design/` 디렉토리 존재 여부 → 스니펫 설치 여부
- 패키지 매니저 감지 (lock 파일 기준):
  - `bun.lockb` / `bun.lock` → bun
  - `pnpm-lock.yaml` → pnpm
  - `yarn.lock` → yarn
  - `package-lock.json` 또는 기본 → npm

이후 모든 패키지 설치/실행 명령어는 감지된 패키지 매니저에 맞춰 안내합니다.

### 2단계: 상황 분류 및 분기

파악한 상태와 사용자의 질문에 따라 적절한 가이드로 분기합니다.

| 상황 | 참조 |
|------|------|
| `seed-design.json` 없음 → 처음 셋업이 필요 | `references/getting-started.md` |
| 컴포넌트 관련 질문 (어떤 컴포넌트 있어?, 버튼 쓰고 싶은데) | `references/components.md` |
| 파운데이션/토큰 질문 (색상, 타이포, 스페이싱, 테마) | `references/foundation.md` |
| CLI 명령어 관련 (init, add, docs 등) | `references/usage.md` |
| 버전 호환/마이그레이션 | `references/migration.md` |
| 패키지 업그레이드 진단 | `references/upgrade.md` |

사용자가 명시적으로 주제를 말한 경우 프로젝트 분석을 건너뛰고 해당 시나리오로 직행해도 됩니다.

### 3단계: 안내 + 실행

- 기존 문서 링크 제공: `https://seed-design.io/react/components/{component-name}`
- llms.txt URL로 상세 정보 참조: `https://seed-design.io/llms/react/components/{component-name}.txt`
- CLI `docs` 명령어로 문서/llms.txt/스니펫 링크 한 번에 조회:
  ```bash
  npx @seed-design/cli@latest docs {component-name}
  ```
- 사용자가 원하면 CLI 명령어를 직접 실행 (init, add 등)

### 4단계: 다음 단계 제안

현재 작업이 끝나면 자연스럽게 다음 단계를 안내합니다.

- 셋업 완료 → "이제 컴포넌트를 추가해볼까요?"
- 컴포넌트 추가 → "테마 설정이나 다른 컴포넌트도 필요하신가요?"
- 파운데이션 안내 → "실제 코드에서 이렇게 사용하면 됩니다"

## 정보 조회 도구

SEED Design의 모든 문서에는 llms.txt 형태의 LLM 최적화 문서가 있습니다. 컴포넌트 목록, 파운데이션 가이드 등 최신 정보가 필요하면 llms.txt를 WebFetch로 읽어옵니다.

### llms.txt 인덱스

| 영역 | 인덱스 URL | 용도 |
|------|-----------|------|
| React | https://seed-design.io/react/llms.txt | 컴포넌트 목록, 설치/스타일링 가이드 |
| Design | https://seed-design.io/docs/llms.txt | 파운데이션(색상, 타이포, 스페이싱 등) |

### 개별 문서 조회

```text
https://seed-design.io/llms/react/components/{component-name}.txt
https://seed-design.io/llms/docs/foundation/color/color-system.txt
```

### CLI docs 명령어

```bash
npx @seed-design/cli@latest docs {component-name}
# 출력:
# - docs: https://seed-design.io/react/components/action-button
# - llms.txt: https://seed-design.io/llms/react/components/action-button.txt
# - snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/ui/action-button.tsx
```

## Reference Files

| 파일 | 용도 | 읽는 시점 |
|------|------|-----------|
| `references/getting-started.md` | 처음 셋업 가이드 | seed-design.json이 없거나 셋업 질문 시 |
| `references/components.md` | 컴포넌트 탐색/추가 방법 | 컴포넌트 관련 질문 시 |
| `references/foundation.md` | 파운데이션 llms.txt 인덱스 | 색상, 타이포, 스페이싱, 테마 질문 시 |
| `references/usage.md` | CLI 명령어 상세 | CLI 사용법 질문 시 |
| `references/migration.md` | 스니펫 버전 호환/마이그레이션 | 버전 불일치 또는 마이그레이션 시 |
| `references/upgrade.md` | 패키지 업그레이드 진단 | 업그레이드 질문 시 |
