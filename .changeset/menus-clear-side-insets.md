---
"@seed-design/react-menu": patch
---

Menu가 화면 좌우 가장자리 근처에서 위치를 잡을 때 좌우 safe area inset도 피하도록 수정합니다. 위아래처럼 inset이 있는 가장자리에서는 `overflowPadding` 대신 inset을 기준으로 밀리거나 뒤집히고, inset이 없는 가장자리는 지금처럼 `overflowPadding`을 씁니다.
