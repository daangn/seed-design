---
"@seed-design/docs-mcp": patch
---

문서와 rootage 조회가 요청과 다른 것을 돌려주던 세 자리를 고쳤습니다.

- `get_doc`에 이름만 넘겼을 때 그 이름을 가진 문서가 둘 이상이면, 앞에 있는 것을 말없이 돌려주는 대신 후보 경로를 담아 거부합니다. `react` 섹션의 `alert-dialog`, `bottom-sheet`, `menu-sheet`는 `components`와 `stackflow` 양쪽에 있어서, 지금까지 `stackflow` 쪽 문서는 이 방식으로 열 수 없었습니다.
- `get_rootage`가 경로를 인덱스와 대조한 뒤 가져옵니다. 이전에는 값을 그대로 주소에 이어 붙여서 `../`가 섞이면 `/rootage` 밖 페이지를 받아왔고, rootage 스펙이 아닌 문서를 rootage인 줄 알고 쓰게 됐습니다.
- `list_docs`가 항목 경로에서 섹션 접두어만 잘라냅니다. 이전에는 첫 등장을 치환해서, 섹션 이름이 경로 중간에 다시 나오면 어느 문서도 가리키지 않는 경로가 나올 수 있었습니다.
