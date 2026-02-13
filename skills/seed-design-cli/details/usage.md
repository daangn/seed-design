# Usage

## 핵심 명령어

### 1) 초기화

```bash
npx @seed-design/cli@latest init
```

질문 없이 기본값으로 만들려면:

```bash
npx @seed-design/cli@latest init --yes
```

### 2) 스니펫 추가

```bash
npx @seed-design/cli@latest add ui:action-button
```

여러 항목 추가:

```bash
npx @seed-design/cli@latest add ui:action-button ui:alert-dialog
```

### 3) 레지스트리 단위 추가

```bash
npx @seed-design/cli@latest add-all ui
```

모든 레지스트리:

```bash
npx @seed-design/cli@latest add-all --all
```

### 4) 버전 호환성 검사

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

## seed-design.json 운영

주요 필드:

- `path`: 스니펫 출력 루트 경로
- `tsx`: TypeScript 변환 여부
- `rsc`: `"use client"` 유지 여부
- `telemetry`: 익명 사용 데이터 수집 여부

## 참고 링크

- Commands: https://seed-design.io/llms/react/getting-started/cli/commands.txt
- Configuration: https://seed-design.io/llms/react/getting-started/cli/configuration.txt
