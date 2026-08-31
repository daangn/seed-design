---
"@seed-design/docs-mcp": major
"@seed-design/cli": major
---

문서 인덱스에서 카테고리 아래의 하위 묶음을 없앴습니다.

지금까지 인덱스는 섹션 안의 문서를 다시 하위 묶음으로 나눠 담았고, 그 묶음은 콘텐츠 구조에서 나오는 게 아니라 문서 사이트가 섹션마다 손으로 선언한 것이었습니다. 같은 문서를 두 도구가 서로 다른 이름으로 부르게 되는 원인이기도 했습니다.

이제 각 섹션이 문서 목록 하나만 들고 있고, 문서를 가리키는 유일한 이름은 그 문서의 주소입니다.

**`@seed-design/docs-mcp`**

- `list_docs`에서 `category` 인자가 사라졌습니다. 섹션 전체를 `path` 순으로 정렬해 반환하므로 같은 경로 아래 문서끼리 모여서 나옵니다.
- `discover_seed_docs` 응답에서 `categories` 배열이 사라졌습니다. `documentCount`는 섹션 전체 문서 수를 뜻합니다.

**`@seed-design/cli`**

- `docs list`가 없는 주소를 오타 후보로 제안하던 문제를 고쳤습니다. 후보를 선언된 묶음이 아니라 실제 문서 주소에서 만들기 때문에, 이제 제안한 주소는 모두 열립니다.
- 한 섹션 안에서 제목이 겹치던 문서들이 구분됩니다. React의 `Alert Dialog`, `Bottom Sheet`, `Menu Sheet`가 `Alert Dialog (Components)`와 `Alert Dialog (Stackflow)`처럼 나옵니다.
