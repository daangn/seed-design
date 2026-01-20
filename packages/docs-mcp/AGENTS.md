# packages/docs-mcp

## 디렉토리 개요

SEED Design 문서를 위한 **MCP(Model Context Protocol) 서버**. AI 도구에서 SEED Design 문서에 접근할 수 있게 한다. `docs/content/` 구조와 동기화 필수.

## 파일 작성 컨벤션

- Tool 이름: `snake_case` (예: `get_react_component`)
- 함수/변수: `camelCase`, 타입: `PascalCase`
- import에 `.js` 확장자 포함

## 코드 작성 컨벤션

- 외부 요청: `src/fetch.ts`의 `fetchWithCache<T>()` 사용
- `docs/content/` 구조 변경 시 → `src/config.ts`의 `SECTIONS` 업데이트 필수
