---
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/lynx-css": patch
---

Help Bubble 및 Help Bubble Tooltip에 기본 최대 너비 `280px`을 추가합니다.

- 좌우 padding을 포함한 말풍선 전체 폭이 `280px`가 되도록 `content`에 `box-sizing: border-box`를 추가합니다.
- 최대 너비 제한을 제거하려는 경우 `contentProps`를 통해 `maxWidth="none"`을 지정할 수 있습니다.
