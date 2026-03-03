---
"@seed-design/docs-mcp": major
---

docs-mcp를 재설계합니다.

- 도구 재구성: `list_sections`, `list_docs`, `search_docs`, `read_doc`, `read_docs_batch`, `read_rootage`, `list_icons`, `search_icons`, `read_icon`
- 구 도구 제거: `discover_seed_docs`, `get_doc`, `get_full_docs`, `get_rootage`, `get_icon_details`
- llms.txt 우선 정책 적용: HTML 응답 fallback 제거
- Streamable HTTP 엔트리 추가
- resources/prompts 추가 및 문서/AI 연동 코드 동기화
