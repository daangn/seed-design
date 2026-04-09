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

전체 패키지 한 번에 조회:

```bash
npx @seed-design/cli@latest upgrade --all
```

특정 패키지만 조회:

```bash
npx @seed-design/cli@latest upgrade react
```

### 6) Docs 조회

컴포넌트/파운데이션에 대한 문서 링크, LLM용 텍스트 링크, 스니펫 링크를 조회합니다.

인터랙티브 모드 (카테고리 → 섹션 → 항목 순서로 선택):

```bash
npx @seed-design/cli@latest docs
```

특정 항목 직접 조회:

```bash
npx @seed-design/cli@latest docs action-button
```

경로 기반 조회 (카테고리/섹션/항목):

```bash
npx @seed-design/cli@latest docs react/components/action-button
```

카테고리만 지정:

```bash
npx @seed-design/cli@latest docs react
```

카테고리/섹션까지 지정:

```bash
npx @seed-design/cli@latest docs react/components
```

출력 예시:

```text
action-button
- docs: https://seed-design.io/react/components/action-button
- llms.txt: https://seed-design.io/llms/react/components/action-button.txt
- snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/ui/action-button.tsx
```

`snippet` 줄은 `ui` 또는 `breeze` 레지스트리 항목에만 출력됩니다. 파운데이션 등 스니펫이 없는 항목은 `docs`와 `llms.txt`만 출력됩니다.

오타가 포함된 경로를 입력하면 유사한 유효 경로를 제안합니다:

```text
react/component/action-buton: 문서를 찾을 수 없어요.

💡 이것을 의미했나요?
   - react/components/action-button
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
