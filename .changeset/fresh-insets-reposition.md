---
"@seed-design/react-floating": patch
"@seed-design/react-popover": patch
"@seed-design/react-tooltip": patch
"@seed-design/react-menu": patch
"@seed-design/react-navigation-menu": patch
"@seed-design/react-select": patch
"@seed-design/react-snackbar": patch
"@seed-design/react": patch
---

웹뷰 위 네이티브 바나 툴바처럼 `resize` 없이 safe area inset이 바뀌면 Popover, Help Bubble, Menu, Navigation Menu, Select가 이전 inset으로 위치를 잡아 네이티브 바와 겹치고, Snackbar가 피해야 할 영역과 겹치던 문제를 수정합니다.
