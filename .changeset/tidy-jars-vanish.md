---
"@seed-design/docs-mcp": minor
---

아이콘 도구를 제거했습니다.

`list_icons`, `search_icons`, `get_icon_details`가 사라집니다. 나머지 다섯 도구가 문서 사이트를 HTTP로 읽는 것과 달리 이 셋만 `@karrotmarket/icon-data`를 함께 설치해 읽었고, 그 패키지 하나가 2.9MB를 차지했습니다. 아이콘은 문서 사이트의 아이콘 라이브러리(`/foundations/iconography/library`)에서 찾을 수 있습니다.

`initializeTools`가 동기 함수가 됩니다. 아이콘 데이터를 읽어야 해서 `async`였는데 그 이유가 사라졌습니다. `await initializeTools(server)`는 그대로 동작하므로 고치지 않아도 되고, 반환값에 `.then()`을 거는 코드만 영향을 받습니다.
