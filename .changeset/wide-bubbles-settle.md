---
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/lynx-css": patch
---

Help Bubble의 기본 최대 너비를 `280px`로 지정합니다.

- 지금까지 Help Bubble에는 최대 너비가 없어 사용처마다 폭이 달랐습니다. 이제 `content`가 기본으로 `280px`에서 줄바꿈합니다. 본문 타이포(`$font-size.t3`, 13px) 기준으로 한 줄에 20자 안팎이 들어가는 폭입니다.
- 좌우 padding을 포함한 말풍선 전체 폭이 `280px`가 되도록 `content`에 `box-sizing: border-box`를 함께 지정합니다.
- 280px보다 넓게 쓰던 화면은 줄바꿈이 달라집니다. 기존 폭을 유지하려면 `HelpBubble.Content`(Registry 컴포넌트에서는 `contentProps`)에 `maxWidth`를 지정해 주세요. 최대 너비 제한 자체를 없애려면 `maxWidth="none"`을 지정하면 됩니다.
