---
"@seed-design/lynx-css": patch
"@seed-design/rootage-artifacts": patch
"@seed-design/css": patch
---

Menu Sheet의 디자인 스펙에서 핸들 여백 확보를 위해 `content` 상단 패딩을 `x4` → `x6`으로 늘리고 `header.paddingTop`을 제거합니다 (핸들 여백 확보). React/CSS `MenuSheet`의 경우 핸들이 존재하지 않으므로 변경사항이 없습니다.
