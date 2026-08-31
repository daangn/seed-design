---
"@seed-design/docs-mcp": major
---

`get_full_docs`를 제거했습니다.

문서 사이트가 섹션 전체를 하나로 합친 `llms-full.txt`를 더 이상 게시하지 않습니다. 이 파일은 페이지별 문서를 이어 붙인 사본이라 원본이 바뀔 때마다 따로 다시 만들어야 했고, 다섯 개 섹션만 가지고 있어 어떤 섹션에서 쓸 수 있는지 매번 확인해야 했습니다.

섹션 전체를 훑어야 한다면 `list_docs`로 목록을 받은 뒤 필요한 문서만 `get_doc`으로 읽으세요.

`discover_seed_docs` 응답에서 `endpoints` 객체도 사라지고, 섹션 목록 진입점이 `overviewUrl` 한 필드로 바뀝니다.
