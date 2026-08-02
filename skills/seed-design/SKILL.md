---
name: seed-design
description: SEED Design 통합 가이드. 프로젝트 셋업·컴포넌트·파운데이션·CLI는 공식 문서로 안내하고, 문서를 대조해야 답이 나오는 것(스니펫 버전 호환, 업그레이드 경로)과 사용 상태 진단(doctor — 구버전 스니펫, deprecated 사용, 가이드라인 준수)을 직접 수행한다. SEED Design 관련 질문이면 이 스킬을 사용한다. 사용자가 "SEED 어떻게 써?", "컴포넌트 뭐 있어?", "색상 토큰 쓰는 법", "디자인시스템 셋업", "잘 쓰고 있나?", "뭘 고쳐야 하나?" 같은 질문을 하면 반드시 이 스킬을 로드한다.
user-invocable: true
argument-hint: "[질문 또는 주제]"
---

# SEED Design

당근의 디자인 시스템 SEED Design을 프로젝트에 도입하고 활용할 때 사용하는 통합 가이드입니다.

**문서에 이미 있는 것은 문서를 읽어 답하고, 이 스킬은 문서만으로는 안 나오는 것을 담습니다** — 여러 문서를 대조해야 결론이 나오는 판단(버전 호환, 업그레이드 경로)과 코드를 문서 기준으로 검사하는 진단입니다.

## 동작 방식

이 스킬이 호출되면 아래 순서로 동작합니다.

### 1단계: 프로젝트 상태 파악

사용자의 프로젝트를 분석하여 현재 상태를 파악합니다.

- `seed-design.json` 존재 여부 → 초기 설정 완료 여부
- `package.json`에서 `@seed-design/react`, `@seed-design/css` 설치 여부와 버전
- 번들러 종류 감지 (`vite.config`, `rsbuild.config`, `webpack.config` 등)
- `seed-design.json`의 `path`가 가리키는 디렉토리 존재 여부 → 스니펫 설치 여부 (기본 `./seed-design`, 프로젝트에 따라 `./src/seed-design` 등)
- 패키지 매니저 감지 (lock 파일 기준):
  - `bun.lockb` / `bun.lock` → bun
  - `pnpm-lock.yaml` → pnpm
  - `yarn.lock` → yarn
  - `package-lock.json` 또는 기본 → npm

이후 모든 패키지 설치/실행 명령어는 감지된 패키지 매니저에 맞춰 안내합니다.

### 2단계: 상황 분류 및 분기

질문은 세 층으로 갈립니다. **아래로 갈수록 스킬이 할 일이 많아집니다.**

**① 문서에 답이 있는 것** — 셋업 절차, 컴포넌트 목록, 토큰 이름, CLI 옵션. 문서를 읽고 답하면 됩니다. 스킬에 옮겨 적지 않는 이유는 그 복사본이 문서보다 먼저 낡기 때문입니다. 어디를 읽을지는 아래 "정보 조회 도구"에 있습니다.

**② 판단이 필요한 절차** — 문서 여러 곳을 대조해야 결론이 나오는 것들입니다.

| 언제 읽는가 | 참조 |
|------|------|
| 스니펫 버전 맞추기, 파일 충돌 해결, 패키지 간 호환 판단 | [migration.md](references/migration.md) |
| 업그레이드 진단 (changelog 해석, 마이그레이션 경로) | [upgrade.md](references/upgrade.md) |

**③ 진단** — "잘 쓰고 있나?", "뭘 고쳐야 하나?", 코드 리뷰 → [doctor.md](references/doctor.md)가 절차이고, `rules/`가 판정 기준입니다.

②와 ③의 경계: **무엇이 문제인지 알아내는 것은 진단, 실제로 버전을 올리는 절차는 업그레이드**입니다. 진단이 "major 하나 뒤졌다"까지 말하면 그다음은 `upgrade.md`가 받습니다.

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
| Foundations | https://seed-design.io/foundations/llms.txt | 파운데이션(색상, 타이포, 스페이싱 등) |
| Components | https://seed-design.io/components/llms.txt | 컴포넌트 디자인 스펙(Anatomy, Properties, Guidelines) |

### 개별 문서 조회

```text
https://seed-design.io/llms/react/components/{component-name}.txt
https://seed-design.io/llms/foundations/color.txt
```

자주 쓰는 것들입니다. 절차를 여기 옮겨 적지 않는 이유는 문서가 원본이고 복사본은 낡기 때문입니다.

| 무엇 | URL |
|------|-----|
| 설치·셋업 (번들러별) | `/llms/react/getting-started/installation/{vite\|rsbuild\|webpack\|manual}.txt` |
| 테마 설정 | `/llms/react/getting-started/styling/theming.txt` |
| CLI 명령어 (init·add·compat·docs) | `/llms/react/getting-started/cli/commands.txt` |
| `seed-design.json` 설정 | `/llms/react/getting-started/cli/configuration.txt` |
| 파운데이션 (색상·타이포·스페이싱 등) | `/llms/foundations/{color\|typography\|spacing\|radius\|elevation\|motion}.txt` |

셋업을 안내할 때는 1단계에서 감지한 번들러와 패키지 매니저에 맞춰 해당 문서를 읽고 답합니다.

### CLI docs 명령어

```bash
npx @seed-design/cli@latest docs {component-name}
# 출력:
# - docs: https://seed-design.io/react/components/action-button
# - llms.txt: https://seed-design.io/llms/react/components/action-button.txt
# - snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/react/ui/action-button.tsx
```

## Rules

`rules/`의 룰은 SEED 코드를 **작성할 때 항상 지키고**, 기존 코드는 [doctor.md](references/doctor.md)의 진단 절차가 같은 룰을 소급 적용해 판정합니다. 룰 파일 하나가 작성 가이드이자 진단 기준입니다.

- **[outdated-version](rules/outdated-version.md)** — 설치된 `@seed-design/*`가 npm 최신에서 major 뒤지면 `warn`. 격차에 따라 v1→v2 가이드 순서 안내.
- **[snippet-generation](rules/snippet-generation.md)** — 설치 스니펫의 `@requires`가 registry 최신 세대와 다르면 `info`. `add --on-diff backup`으로 재설치.
- **[no-deprecated-component](rules/no-deprecated-component.md)** — deprecated 컴포넌트·스니펫·토큰·옵션은 `warn`. 대체안은 deprecations 문서가 단일 출처.
- **[component-guidelines](rules/component-guidelines.md)** — 컴포넌트 사용이 가이드라인 문서에 맞는지. **기준은 룰이 아니라 문서에서 도출** — 문서에 Do/Dont가 늘면 기준도 늘어납니다.
