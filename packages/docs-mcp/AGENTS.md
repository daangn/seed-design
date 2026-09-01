# packages/docs-mcp

## 디렉토리 개요

SEED Design 문서를 위한 **MCP(Model Context Protocol) 서버**. AI 도구에서 SEED Design 문서에 접근할 수 있게 한다. 섹션과 문서 목록은 이 패키지가 들고 있지 않고, 문서 사이트가 게시하는 인덱스를 호출 시점에 읽는다.

## 파일 작성 컨벤션

- Tool 이름: `snake_case` (예: `search_docs`)
- 함수/변수: `camelCase`, 타입: `PascalCase`
- import에 `.js` 확장자 포함

## 코드 작성 컨벤션

- 외부 요청: `src/fetch.ts`의 `fetchWithCache<T>()` 사용. 검색 색인만 예외로 `src/search.ts`가 프로세스 수명 동안 들고 있는다
- 문서 구조는 `/__docs__/index.json`에서 읽으므로 `docs/content/`가 바뀌어도 이 패키지에서 할 일이 없다. 그 응답의 형태를 아는 곳은 `src/docs-index.ts` 하나이고, 게시하는 쪽은 `docs/scripts/generate-docs-index.ts`다
- `search_docs`가 출력하는 주소를 `get_doc`이 그대로 받도록 유지한다. 두 도구가 주소를 다르게 읽으면 검색 결과를 이어서 열 수 없다
