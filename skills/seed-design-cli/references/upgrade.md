# Upgrade Diagnosis

## Overview

`upgrade` 명령은 프로젝트에 설치된 `@seed-design/*` 패키지의 현재 버전과 최신 버전 사이의 변경사항(changelog)을 가져옵니다. `--raw` 플래그를 사용하면 UI 없이 순수 마크다운으로 출력되어 LLM이 파싱하기에 적합합니다.

## Upgrade Diagnosis Workflow

이 스킬이 호출되면 아래 순서로 프로젝트 영향도를 진단합니다.

### Step 1: Changelog 수집

```bash
npx @seed-design/cli@latest upgrade react --raw
```

`--raw` 플래그로 changelog 마크다운을 받습니다. 대상 패키지를 지정하지 않으면 interactive select가 나오므로 반드시 패키지명을 명시합니다.

### Step 2: 프로젝트 코드 탐색

changelog에서 언급된 컴포넌트/API를 기준으로 사용자 프로젝트에서 해당 코드를 검색합니다.

- **Breaking Changes / Minor Changes**: 변경된 컴포넌트 이름, prop 이름, API 시그니처를 프로젝트에서 grep
- **Patch Changes**: 버그 수정으로 인한 동작 변경이 프로젝트에 영향을 주는지 확인
- **Updated Dependencies**: 하위 패키지 변경이 프로젝트의 직접 import에 영향을 주는지 확인

### Step 3: 영향도 보고

changelog 항목별로 프로젝트 영향 여부를 분류하여 보고합니다.

보고 형식:

```
## 업그레이드 진단: @seed-design/react {현재버전} → {최신버전}

### 수정 필요
- [변경 내용]: [영향받는 파일과 라인] — [수정 방법]

### 확인 권장
- [변경 내용]: [관련 파일] — [확인 포인트]

### 영향 없음
- [변경 내용]: 프로젝트에서 사용하지 않음
```

### Step 4: 업그레이드 안내

진단 결과에 따라 업그레이드 명령을 안내합니다.

```bash
bun add @seed-design/react@{최신버전}
```

수정이 필요한 항목이 있으면 업그레이드 전후로 어떤 코드를 바꿔야 하는지 구체적인 diff를 제시합니다.

## Commands

### Interactive Mode

```bash
npx @seed-design/cli@latest upgrade
```

패키지를 선택하고 changelog를 터미널에서 확인합니다.

### Raw Mode (LLM 진단용)

```bash
npx @seed-design/cli@latest upgrade react --raw
npx @seed-design/cli@latest upgrade css --raw
```

순수 마크다운 출력. 파이프나 LLM 입력에 사용합니다.

### Options

- `--cwd <path>`: 작업 디렉토리 지정 (기본: 현재 디렉토리)
- `--baseUrl <url>`: changelog를 가져올 docs 서버 URL (기본: https://seed-design.io)
- `--raw`: UI 없이 순수 마크다운 출력

## Decision Guide

- 최신 버전과 동일하면 "이미 최신 버전" 으로 종료됩니다.
- Breaking Changes가 있으면 반드시 수정 후 업그레이드합니다.
- Patch Changes만 있으면 바로 업그레이드해도 안전합니다.
- Updated Dependencies에서 하위 패키지를 직접 import하는 경우 해당 변경사항도 확인합니다.
