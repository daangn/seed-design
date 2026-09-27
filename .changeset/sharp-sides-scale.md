---
"@seed-design/react": patch
"@seed-design/react-menu": patch
"@seed-design/react-navigation-menu": patch
"@seed-design/react-select": patch
---

placement가 `left`/`right` 계열일 때 transform origin이 trigger와 맞닿은 모서리를 가리키도록 고칩니다. 이전에는 가로축이 `center`로 남고, `start`/`end` 정렬이 세로축 대신 가로축에 반영됐습니다.
