---
"@seed-design/lynx-react": patch
"@seed-design/lynx-css": patch
---

Lynx `BottomSheet`의 snap point 레이아웃을 수정합니다.

- host가 화면 높이를 전달하지 않아도 기기 화면 높이로 퍼센트 snap point를 계산합니다. 이전에는 500px을 기준으로 계산했습니다.
- 공간이 부족할 때 Header·Footer는 줄어들지 않고 Body만 줄어들어 제목·설명이 겹치지 않습니다.
