---
"@seed-design/docs-mcp": patch
---

문서 사이트 개편 뒤 MCP에서 읽을 수 없던 컴포넌트 디자인 가이드라인과 Foundations, Patterns 문서를 다시 제공합니다.
- `components`, `foundations`, `patterns`, `updates` 섹션으로 문서 사이트와 같은 구성을 읽을 수 있습니다. 예: `get_doc({ section: "components", path: "action-button" })`
- `docs` 섹션의 이름과 설명을 마이그레이션 문서만 남은 실제 내용에 맞춥니다.
- `get_full_docs`는 전체 문서 파일이 있는 `react`, `docs`, `breeze`, `ai-integration`, `lynx` 섹션에서만 사용할 수 있습니다.
