---
"@seed-design/docs-mcp": minor
---

`discover_seed_docs` 결과에서 `overviewUrl`을 뺍니다.

섹션마다 문서 목록을 담고 있던 `/{섹션}/llms.txt`가 없어졌습니다. 같은 목록을 `list_docs`가 발행 인덱스에서 그대로 만들어 주므로, 그 목록을 URL로 한 번 더 가리킬 이유가 없어졌습니다.

**동작 변경**: `discover_seed_docs`의 각 섹션 항목에 `overviewUrl`이 더 이상 실리지 않습니다. 섹션에 무엇이 있는지는 `list_docs({ section })`으로 확인하고, 섹션 개요 문서는 `get_doc({ section, path: "overview" })`로 읽습니다.

이미 설치된 버전도 이 필드가 빈 채로 돌아옵니다. 사이트가 그 값을 더 이상 싣지 않기 때문이며, 나머지 도구는 영향을 받지 않습니다.
