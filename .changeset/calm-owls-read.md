---
"@seed-design/docs-mcp": minor
---

`list_docs`가 문서마다 언제 읽으면 되는지를 함께 보여줍니다.

각 항목의 description 뒤에, 그 문서를 어떤 상황에서 읽으면 되는지가 ` — `로 이어 붙습니다. 문서 사이트가 인덱스에 `whenToRead`를 싣기 시작했기 때문입니다. 같은 컴포넌트의 디자인 스펙·React·Lynx 문서는 description이 같은 경우가 많아서, description만으로는 셋을 가려낼 수 없었습니다.

인덱스에 `whenToRead`가 없는 문서는 이전과 같이 description까지만 나옵니다.
