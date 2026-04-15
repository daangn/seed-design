# Upgrade Diagnosis

## Overview

업그레이드 진단은 CLI 프리미티브(`docs`, `compat`)를 조합하여 수행합니다. CLI는 데이터 fetch만 담당하고, 이 스킬이 해석과 분석을 담당합니다.

## Upgrade Diagnosis Workflow

### Step 1: 패키지와 버전 결정

사용자의 요청에서 **어떤 패키지**의 **어떤 버전부터** 변경사항을 확인할지 파악합니다. 아래 판단 트리를 따릅니다.

```text
사용자 요청 분석
├─ 패키지와 버전 모두 명확함
│   예: "react 1.2.5에서 최신까지 변경사항 알려줘"
│   → 바로 Step 2로 진행
│
├─ 패키지는 명확하지만 버전이 불명확함
│   예: "react 패키지 업그레이드 변경사항 알려줘"
│   ├─ 프로젝트 환경이 있음 → package.json에서 버전 확인
│   └─ 프로젝트 환경이 없음 → 사용자에게 현재 버전 질문
│
├─ 패키지도 버전도 불명확함
│   예: "seed-design 업그레이드하고 싶어"
│   ├─ 프로젝트 환경이 있음 → package.json에서 설치된 @seed-design/* 패키지 전체 확인
│   └─ 프로젝트 환경이 없음 → 사용자에게 어떤 패키지/버전인지 질문
│
└─ 특정 버전 범위를 지정함
    예: "react 1.2.5에서 1.2.7까지 변경사항"
    → from 버전으로 fetch 후 Step 3에서 범위 필터링
```

**프로젝트 환경에서 버전 확인 방법:**

`package.json`을 직접 읽어 `@seed-design/react`, `@seed-design/css` 등의 버전을 확인합니다. `package.json`이 버전의 source of truth입니다.

**사용자에게 질문이 필요한 경우:**

패키지나 버전을 특정할 수 없으면 추측하지 말고 반드시 사용자에게 질문하여 명확한 답을 얻은 후 진행합니다.

**질문 판단 흐름:**

```text
정보 부족 판단
├─ 패키지가 불명확함
│   → 먼저 사용자의 의도를 파악:
│   │
│   ├─ "전체 @seed-design 패키지의 변경사항을 모두 보고 싶으신가요,
│   │    아니면 특정 패키지(react, css 등)를 지정하실 수 있나요?"
│   │
│   ├─ 사용자가 "전체" → 프로젝트 환경이 있으면 package.json에서
│   │   설치된 @seed-design/* 패키지 전체에 대해 각각 진단
│   │
│   └─ 사용자가 특정 패키지 지정 → 해당 패키지로 진행
│
├─ 패키지는 명확하지만 버전이 불명확함 (프로젝트 환경 없음)
│   → "현재 사용 중인 @seed-design/{패키지} 버전이 어떻게 되나요?"
│   → 사용자 답변을 받은 후 해당 버전으로 진행
│
└─ 패키지도 버전도 불명확함 (프로젝트 환경 없음)
    → 위 두 질문을 순서대로 진행:
      1. 먼저 패키지 범위 확인 (전체 vs 특정)
      2. 그다음 버전 확인
```

**질문 원칙:**
- 추측하지 말 것 — 잘못된 패키지/버전으로 진행하면 무의미한 결과가 나옴
- 한 번에 하나씩 — 패키지와 버전을 동시에 묻지 말고 순서대로 확인
- 프로젝트 환경이 있으면 질문 최소화 — package.json에서 읽을 수 있는 정보는 직접 확인

### Step 2: Changelog fetch

`docs --raw` 명령으로 changelog를 가져옵니다. Step 1에서 결정된 패키지와 버전에 따라 적절한 경로를 사용합니다.

```bash
# 전체 changelog (모든 패키지) — 패키지 목록 파악에도 사용
npx @seed-design/cli@latest docs react/updates/changelog --raw

# 특정 패키지의 버전 인덱스 (사용 가능한 버전 목록)
npx @seed-design/cli@latest docs react/updates/changelog/react --raw

# 특정 패키지의 특정 버전 이후 changelog (가장 일반적인 케이스)
npx @seed-design/cli@latest docs react/updates/changelog/react/1.2.5 --raw
```

버전이 결정된 경우 마지막 형태(`{package}/{version}`)를 사용합니다. 이 엔드포인트는 해당 버전 이후부터 최신까지의 변경사항을 반환합니다.

**전체 패키지 목록 확인:**

전체 changelog(`react/updates/changelog --raw`)의 `## @seed-design/{pkg}` 헤더를 파싱하면 changelog를 제공하는 모든 패키지 목록을 얻을 수 있습니다. "전체 진단"이 필요한데 프로젝트 환경이 없는 경우(package.json에서 읽을 수 없는 경우) 이 방법으로 패키지 목록을 확인합니다.

프로젝트 환경이 있는 경우에는 package.json의 `@seed-design/*` 의존성이 곧 대상 패키지 목록이므로 전체 changelog를 fetch할 필요 없이 각 패키지별로 버전 지정 fetch를 사용합니다.

### Step 3: 버전 범위 파싱 (필요 시)

llms.txt 엔드포인트는 "since version → latest" 형태로 응답합니다. 사용자가 특정 target 버전까지만 확인하고 싶은 경우 (예: 1.2.5 → 1.2.7), 마크다운에서 해당 버전 범위의 섹션만 추출합니다.

changelog 마크다운 형식:
```md
# @seed-design/react — Changes since {version}

## {latest-version}
### Patch Changes
- ...

## {next-version}
### Patch Changes
- ...
```

각 `## {version}` 섹션이 하나의 릴리즈입니다. target 버전이 있으면 해당 버전보다 높은 섹션만 필터링합니다.

### Step 4: 프로젝트 영향도 분석 (선택)

프로젝트 환경이 있는 경우에만 수행합니다.

changelog에서 언급된 컴포넌트/API를 기준으로 프로젝트 코드를 검색합니다:

- **Breaking Changes / Minor Changes**: 변경된 컴포넌트 이름, prop 이름, API 시그니처를 프로젝트에서 grep
- **Patch Changes**: 버그 수정으로 인한 동작 변경이 프로젝트에 영향을 주는지 확인
- **Updated Dependencies**: 하위 패키지 변경이 프로젝트의 직접 import에 영향을 주는지 확인

프로젝트 환경이 없으면 changelog 요약만 제공합니다.

### Step 5: 영향도 보고

보고 형식:

```md
## 업그레이드 진단: @seed-design/react {현재버전} → {최신버전}

### 수정 필요
- [변경 내용]: [영향받는 파일과 라인] — [수정 방법]

### 확인 권장
- [변경 내용]: [관련 파일] — [확인 포인트]

### 영향 없음
- [변경 내용]: 프로젝트에서 사용하지 않음
```

프로젝트 환경이 없는 경우:

```md
## @seed-design/react {from버전} → {to버전} 변경사항

### Breaking Changes
- ...

### Patch Changes
- ...

### Updated Dependencies
- ...
```

### Step 6: 업그레이드 안내

프로젝트 환경이 있는 경우 업그레이드 명령을 안내합니다:

```bash
bun add @seed-design/react@{최신버전}
```

수정이 필요한 항목이 있으면 업그레이드 전후로 어떤 코드를 바꿔야 하는지 구체적인 diff를 제시합니다.

## CLI Primitives

이 스킬이 조합하는 CLI 명령어:

| 명령어 | 역할 |
|--------|------|
| `docs react/updates/changelog --raw` | 전체 changelog fetch (패키지 목록 파악에도 사용) |
| `docs react/updates/changelog/{pkg} --raw` | 특정 패키지의 버전 인덱스 (사용 가능한 버전 목록) |
| `docs react/updates/changelog/{pkg}/{ver} --raw` | 특정 버전 이후 changelog fetch |
| `compat --all` | 프로젝트의 설치된 seed 패키지 버전 + 스니펫 호환성 확인 |

## Decision Guide

- 최신 버전과 동일하면 "이미 최신 버전"으로 종료합니다.
- Breaking Changes가 있으면 반드시 수정 후 업그레이드합니다.
- Patch 릴리스는 대체로 안전하지만, 회귀 가능성을 고려해 변경사항을 확인한 후 업그레이드하는 것을 권장합니다.
- Updated Dependencies에서 하위 패키지를 직접 import하는 경우 해당 변경사항도 확인합니다.
