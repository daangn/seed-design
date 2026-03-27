# @seed-design/docs-mcp

## 1.0.0

### Major Changes

- V2 MCP API로 재설계:
  - 도구 교체: `list_sections`, `list_docs`, `search_docs`, `read_doc`, `read_docs_batch`, `read_rootage`, `list_icons`, `search_icons`, `read_icon`
  - 제거: `discover_seed_docs`, `get_doc`, `get_full_docs`, `get_rootage`, `get_icon_details`
- 모든 도구를 `registerTool + outputSchema + structuredContent` 패턴으로 통일
- llms.txt 우선 정책 적용:
  - `read_doc`, `read_docs_batch`는 `/llms/.../*.txt` 또는 `.../llms.txt`만 허용
  - `text/html` 응답은 fallback 없이 오류 처리
- Resources / Prompts 추가:
  - `seed-docs://sections`
  - `seed-docs://{section}/index`
  - `seed-rootage://index`
  - `seed-icons://services`
  - `seed_docs_lookup` prompt
- Streamable HTTP 엔트리 추가 (`seed-docs-mcp-http`)

## 0.5.1

### Patch Changes

- e92892a: 아이콘 정보를 업데이트합니다.

## 0.5.0

### Minor Changes

- c300110: Tool의 개수를 유지보수 가능한 형태로 줄였습니다

## 0.4.0

### Minor Changes

- 0315e98: 아이콘 라이브러리 관련 새로운 도구 3개를 추가합니다. (아이콘 목록 조회, 검색, 상세 정보 조회)

## 0.3.0

### Minor Changes

- 63b65db: - `get_rootage` tool 추가 (design token 및 component spec 조회)
  - React 문서 조회 기능 개선 및 fetch 함수 통합

## 0.2.0

### Minor Changes

- f385599: `list_foundation`, `get_foundation`, `list_docs_components`, `get_docs_component` tools 추가

## 0.1.0

### Minor Changes

- 8661d79: `@seed-design/docs-mcp` 패키지 추가

  Tools:

  - `get_react_component`
  - `get_breeze_component`
  - `get_react_changelog`
  - `list_react_components`
  - `list_breeze_components`
  - `get_react_changelog`
