# Upgrade & Compatibility Diagnosis

## Overview

업그레이드 진단은 CLI 프리미티브(`docs`, `compat`)를 조합하여 수행합니다. **CLI는 데이터 fetch를 담당하고, 이 스킬은 해석·판단·경로 제시를 담당합니다.**

다루는 세 가지:

- **패키지 간 호환**: 설치된 `@seed-design/react`와 `@seed-design/css`가 서로 맞는지 — **CLI가 판정하지 않습니다.** 2.x는 peer 선언, 1.x는 v1 호환표로 이 스킬이 판단합니다 (Step 2)
- **스니펫 호환**: 설치된 스니펫이 현재 패키지 버전을 만족하는지 (`compat`)
- **버전 업그레이드**: 현재 → 목표 버전 사이의 변경사항과 마이그레이션 경로 (`docs ... changelog`)

소비자용 업그레이드 문서는 https://seed-design.io/react/updates/upgrade 를 참고하세요.
SDK·공유 라이브러리 저자용 문서는 https://seed-design.io/react/getting-started/library-authors 를 참고하세요.

## 2.0 전후 버저닝 정책 (먼저 판단)

SEED는 **2.0을 분기점**으로 정책이 다르므로 진단 방식도 달라집니다.

| 구간 | 정책 | 진단 방식 |
| --- | --- | --- |
| **2.0 이상** | strict SemVer. breaking은 major에서만. minor·patch는 하위 호환. 의도적인 색상·디자인 변경도 major에서만(틀린 값 수정은 patch). | minor/patch 업그레이드는 안전. major를 넘을 때만 breaking을 확인. `peerDependencies` 선언을 신뢰. |
| **2.0 미만 (0.x·1.x)** | minor·patch에서도 breaking 가능. react↔css가 lockstep(같은 minor)이던 구간 존재. | v1 업그레이드 문서의 호환표로 react↔css 호환을 판단. minor 업그레이드도 breaking 확인 필요. |

`@seed-design/css/vars/component/typography`를 제외한 `@seed-design/css/vars/component/*` 경로는 SemVer 보장 대상이 아닙니다. rootage component spec 변경에 따라 minor·patch에서도 이름이나 구조가 바뀔 수 있으므로, 프로젝트 영향도 분석에서 직접 import 여부를 확인합니다.

## Changelog 경로 규칙 (반드시 준수)

changelog fetch URL을 조립할 때:

- **카테고리는 항상 `react`** — framework가 lynx여도 `react/updates/changelog/...`를 사용합니다. (`lynx/updates/changelog/...`는 404)
- **package slug = 패키지명에서 `@seed-design/` 제거**: `@seed-design/react`→`react`, `@seed-design/css`→`css`, `@seed-design/lynx-react`→`lynx-react`, `@seed-design/lynx-css`→`lynx-css`

| 목적 | 경로 |
| --- | --- |
| 특정 버전 이후 changelog | `react/updates/changelog/{slug}/{version}` |
| 버전 인덱스(사용 가능한 버전 목록) | `react/updates/changelog/{slug}` |
| 전체 changelog(모든 패키지) | `react/updates/changelog` |

## Workflow

### Step 1: 패키지와 버전 결정

사용자의 요청에서 **어떤 패키지**의 **어떤 버전부터** 확인할지 파악합니다.

```text
사용자 요청 분석
├─ 패키지·버전 모두 명확함 (예: "react 1.2.5에서 최신까지")  → Step 2
├─ 패키지만 명확함 (예: "react 업그레이드 변경사항")
│   ├─ 프로젝트 환경 있음 → package.json에서 버전 확인
│   └─ 없음 → 사용자에게 현재 버전 질문
├─ 둘 다 불명확함 (예: "seed-design 업그레이드하고 싶어")
│   ├─ 프로젝트 환경 있음 → package.json의 @seed-design/* 전체 확인
│   └─ 없음 → 패키지 범위(전체/특정) → 버전 순서로 질문
└─ 특정 범위 지정 (예: "1.2.5에서 1.2.7까지")  → from으로 fetch 후 Step 4에서 필터
```

**버전 확인**: **실제로 설치된 버전**을 읽습니다. `package.json`의 `^1.1.0`은 "1.1.0이 설치됨"이 아니라 "1.1.x를 받아들임"이라, 이걸 from으로 쓰면 이미 적용된 변경까지 마이그레이션 대상으로 잘못 보고합니다.

```bash
cat node_modules/@seed-design/react/package.json | grep '"version"'
```

**fallback**: node_modules나 lockfile을 읽을 수 없을 때만 선언 범위의 하한을 from으로 씁니다(`^1.1.0`→`1.1.0`). 이 경우 결과가 과다 보고일 수 있음을 함께 안내합니다.

**질문 원칙**: 추측 금지(잘못된 패키지/버전은 무의미한 결과). 한 번에 하나씩. 프로젝트 환경이 있으면 package.json에서 읽어 질문 최소화.

### Step 2: 현재 호환 진단

**패키지끼리(react↔css)의 호환은 CLI가 판정하지 않습니다.** `compat`은 설치된 **스니펫**이 요구하는 범위만 검사합니다.

```bash
npx @seed-design/cli@latest compat --json
```

- `--json`의 `snippets.issues`에 스니펫 호환 위반이 담깁니다. 사람용 출력은 `--json` 없이.

패키지 간 호환은 아래 기준으로 직접 판단합니다.

**2.0 이상 — `peerDependencies` 선언이 정답입니다.** strict SemVer를 따르므로 설치본의 선언을 그대로 신뢰합니다.

```bash
cat node_modules/@seed-design/react/package.json | grep -A5 peerDependencies
```

**1.x — 선언만으로 판단하면 안 됩니다.** 상한이 없거나 누락된 구간이 있어, 선언은 통과하지만 실제로는 스타일이 어긋나는 조합이 있습니다. 버전별 호환표와 알려진 비호환 조합을 아래 문서에서 읽고 대조합니다. 구간을 추측하지 말고 표를 실제로 확인하세요.

- `https://seed-design.io/llms/react/updates/upgrade/v1.txt` (섹션: 패키지 간 버전 호환성)

요약하면 `css`는 `react`와 **같은 마이너 라인**이면서 표의 하한 이상이어야 하고, `stackflow`는 1.2 라인이 없어 css 두 라인을 함께 지원하되 WAAPI 경계(stackflow 1.1.22 / css 1.1.25·1.2.11)를 섞으면 안 됩니다. 정확한 하한과 예외는 표를 따릅니다.

> lynx 계열(`@seed-design/lynx-react`·`lynx-css`)은 이 호환표의 대상이 아닙니다. 스니펫 검사와 changelog 기반 진단(Step 3 이후)으로 진행합니다.

### Step 3: Changelog fetch

위 **경로 규칙**에 따라 조립합니다.

```bash
npx @seed-design/cli@latest docs react/updates/changelog/react/{from버전} --raw
```

이 엔드포인트는 **from 버전 이후부터 최신까지** 모든 변경을 반환합니다(응답 최상단이 최신). 별도로 최신 버전을 조회할 필요가 없습니다.

**버전이 존재하지 않으면(404 등)**: 버전 인덱스(`react/updates/changelog/{slug}`)로 사용 가능한 버전을 확인하고 사용자에게 올바른 버전을 안내합니다. 추측하지 마세요.

### Step 4: target 버전까지 필터 (필요 시)

엔드포인트는 "from → latest"를 반환하므로, 사용자가 특정 target까지만 원하면 그보다 높은 섹션을 제외합니다. 각 `## {version}` 섹션을 SemVer로 비교해 **target보다 높은(>) 버전 섹션을 제거**합니다. (예: 1.2.5→1.2.7 요청 시 2.0.0·1.2.10·1.2.8 제외, 1.2.6·1.2.7만 사용.)

changelog 섹션 형식: `## {version}` 아래 `### Major Changes` / `### Minor Changes` / `### Patch Changes` / `### Updated Dependencies`.

### Step 5: 마이그레이션 경로 구성

목표까지 가는 경로를 구성합니다.

- **breaking 경계**: changelog의 Major/Minor Changes와 "BREAKING CHANGE"·"재설치 필요" 표시를 모읍니다. 1.x 구간의 경계(1.0.0·1.1.0·1.2.0)는 v1 업그레이드 문서에 구간별로 정리돼 있습니다.
- **재설치 snippet**: 경계에서 재설치가 필요한 컴포넌트는 `add ui:{component}`로 다시 받도록 안내합니다.
- **react↔css 함께 올리기**: 1.x 구간을 넘나들면 react와 css를 호환되는 버전으로 **함께** 올려야 합니다(한쪽만 올리면 클래스네임이 어긋나 스타일이 깨짐). Step 2의 호환 범위를 사용합니다.
- **component vars 직접 import 확인**: `@seed-design/css/vars/component/typography`를 제외한 `@seed-design/css/vars/component/*` 사용처가 있으면 SemVer 비보장 경로로 분류하고, 공개 API나 런타임 로직 의존을 제거하도록 안내합니다.

### Step 6: 프로젝트 영향도 분석 (선택)

프로젝트 환경이 있을 때만 수행합니다. changelog에서 언급된 컴포넌트/API를 프로젝트 코드에서 grep:

- **Breaking/Minor Changes**: 변경된 컴포넌트·prop·API 시그니처를 grep
- **Patch Changes**: 버그 수정으로 인한 동작 변경 영향 확인
- **Updated Dependencies**: 하위 패키지 변경이 직접 import에 영향을 주는지 확인
- **Component vars**: `@seed-design/css/vars/component/*` 직접 import 확인(`typography` 제외)

### Step 7: 보고 (상황별 형식)

**A. 업그레이드 필요 (breaking 있음)**

```md
## 업그레이드 진단: @seed-design/react {현재} → {목표}
### 수정 필요
- [변경]: [영향 파일·라인] — [수정 방법]
### 확인 권장
- [변경]: [관련 파일] — [확인 포인트]
### 영향 없음
- [변경]: 프로젝트에서 사용하지 않음
```

**B. 이미 최신**

```md
@seed-design/react: {버전} = 최신. 업그레이드 불필요.
(설치된 스니펫 외에 모든 registry 항목까지 검사하려면 `compat --all`)
```

**C. 다패키지** — 패키지별 요약 테이블 + 통합 breaking + 단계별 경로

```md
| 패키지 | 현재 | 목표/최신 | 호환 | 액션 |
| --- | --- | --- | --- | --- |
| @seed-design/react | ... | ... | ✓/⚠ | ... |
| @seed-design/css   | ... | ... | ✓/⚠ | ... |
```

### Step 8: 업그레이드 안내

1단계에서 감지한 패키지 매니저에 맞춰 안내합니다 (아래는 bun 예시).

```bash
bun add @seed-design/react@{react목표} @seed-design/css@{css목표}
```

**두 패키지는 버전 번호가 다릅니다**(예: react 2.0.4 ↔ css 2.2.1). 같은 번호를 맞춰 설치하면 없는 버전이거나 호환되지 않는 조합이 됩니다. css 목표 버전은 Step 2의 기준으로 따로 산출하세요 — 2.x는 react의 peer 선언 범위에서, 1.x는 v1 호환표에서.

1.x 구간은 react·css를 함께 올립니다. 재설치가 필요한 snippet은 `add ui:{component}`로. 업그레이드 후 다시 `compat`으로 스니펫을 검증합니다.

## CLI Primitives

| 명령어 | 역할 |
| --- | --- |
| `compat --json` | 설치된 스니펫의 호환 진단(구조화 출력) |
| `compat --all` | 설치 여부와 무관하게 모든 registry 항목의 스니펫 호환 검사 |
| `docs react/updates/changelog/{slug}/{ver} --raw` | from 버전 이후 changelog |
| `docs react/updates/changelog/{slug} --raw` | 버전 인덱스(버전 목록) |
| `docs react/updates/changelog --raw` | 전체 changelog(모든 패키지) |

## Decision Guide

- 최신과 동일 → "이미 최신".
- **2.0 이상**: minor/patch는 안전(strict semver). major를 넘을 때 breaking 확인.
- **2.0 미만**: minor도 breaking 가능 → 항상 changelog 확인 + react↔css 호환을 v1 호환표로 확인.
- react↔css는 호환 범위 안에서 **함께** 올립니다.
- Breaking이 있으면 수정 후 업그레이드.
- `@seed-design/css/vars/component/typography`를 제외한 component vars 직접 import는 제거 또는 대체를 권장합니다.

## SDK·공유 라이브러리 진단

SDK·공유 라이브러리는 `/react/getting-started/library-authors` 문서의 기준을 함께 적용합니다.

- `@seed-design/*`는 `peerDependencies`로 선언하고 `dependencies`에 넣지 않습니다.
- 빌드 결과물에 `@seed-design/*`를 포함하지 않도록 external 처리합니다.
- 라이브러리 코드에서 `@seed-design/css/*.css`를 직접 import하지 않습니다.
- SEED 2.0 transition에서는 검증 후 `~1.2.0 || ^2.0.0` 같은 dual-compat 범위로 프로젝트 전환을 막지 않도록 합니다. 1.x 구간은 minor에 breaking이 있을 수 있어 caret(`^1.2.0`)이 아니라 tilde를 씁니다.

## 다패키지 진단

프로젝트의 `@seed-design/*` 각각에 대해 Step 1~5를 수행하고 Step 7-C 형식으로 통합 보고합니다. react는 css를 의존하므로 css 변경이 react로 전파될 수 있음을 고려합니다.
