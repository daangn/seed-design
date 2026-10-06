---
"@seed-design/react-floating": patch
---

Popover·HelpBubble·HelpBubbleTooltip이 화면 가장자리 근처에서 위치를 잡을 때 네 방향의 safe area inset을 피하도록 수정합니다. inset이 있는 가장자리에서는 `overflowPadding` 대신 inset을 기준으로 밀리거나 뒤집히고 가용 크기가 계산되며, inset이 없는 가장자리는 지금처럼 `overflowPadding`을 씁니다.
