---
"@seed-design/docs-mcp": major
---

`discover_seed_docs`를 제거했습니다.

이 도구는 섹션 id와 이름, 문서 수를 알려주는 입구였지만, `search_docs`가 생긴 뒤로는 맡을 일이 남지 않았습니다. 검색 결과의 주소가 섹션 id를 담고 있고, `list_docs`와 `get_doc`은 없는 섹션을 받으면 현재 섹션 목록을 담아 거부합니다. 에이전트 과제로 비교해 보니 이 도구가 없어도 정답 문서에 닿는 비율이 같았고, 탐색 호출은 오히려 조금 줄었습니다.

**동작 변경**: `discover_seed_docs`를 먼저 부르도록 적어 둔 설정이나 프롬프트가 있다면, `search_docs`로 문서를 찾은 뒤 그 주소를 나눠 `get_doc`에 넘기도록 바꿔 주세요. 섹션 전체를 훑어야 할 때는 `list_docs({ section })`을 부릅니다.
