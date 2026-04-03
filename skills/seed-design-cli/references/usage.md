# Usage

## Core Commands

### 1) Initialization

```bash
npx @seed-design/cli@latest init
```

질문 없이 기본값으로 만들려면:

```bash
npx @seed-design/cli@latest init --yes
```

### 2) Add Snippets

```bash
npx @seed-design/cli@latest add ui:action-button
```

여러 항목 추가:

```bash
npx @seed-design/cli@latest add ui:action-button ui:alert-dialog
```

### 3) Add by Registry

```bash
npx @seed-design/cli@latest add-all ui
```

모든 레지스트리:

```bash
npx @seed-design/cli@latest add-all --all
```

### 4) Compatibility Check

현재 프로젝트의 `@seed-design/react`, `@seed-design/css`와 스니펫 요구 버전이 맞는지 검사합니다.

```bash
npx @seed-design/cli@latest compat
```

특정 항목만 검사:

```bash
npx @seed-design/cli@latest compat ui:action-button ui:alert-dialog
```

컴포넌트 shorthand 검사:

```bash
npx @seed-design/cli@latest compat -c action-button -c alert-dialog
```

모든 레지스트리 항목 검사:

```bash
npx @seed-design/cli@latest compat --all
```

### 5) Upgrade Changelog

패키지의 현재 버전과 최신 버전 사이의 변경사항을 확인합니다.

```bash
npx @seed-design/cli@latest upgrade react
```

UI 없이 순수 마크다운 출력 (LLM 파이프에 유용):

```bash
npx @seed-design/cli@latest upgrade react --raw
```

인자 없이 실행하면 설치된 `@seed-design/*` 패키지 중 선택:

```bash
npx @seed-design/cli@latest upgrade
```

## seed-design.json Settings

주요 필드:

- `path`: 스니펫 출력 루트 경로
- `tsx`: TypeScript 변환 여부
- `rsc`: `"use client"` 유지 여부
- `telemetry`: 익명 사용 데이터 수집 여부

## Reference Links

- Commands: https://seed-design.io/llms/react/getting-started/cli/commands.txt
- Configuration: https://seed-design.io/llms/react/getting-started/cli/configuration.txt
