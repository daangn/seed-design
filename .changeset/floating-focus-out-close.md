---
"@seed-design/react-menu": patch
"@seed-design/react-navigation-menu": patch
"@seed-design/react-select": patch
---

`AppScreen`, Dialog처럼 포커스를 가두는 레이어 안에서 Menu, Select, Navigation Menu를 연 채 Tab 키로 트리거 밖으로 이동하면, 포커스가 이동할 요소 대신 레이어 컨테이너로 가던 문제를 수정합니다.
