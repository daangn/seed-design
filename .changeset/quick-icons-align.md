---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx `AppBar` 아이콘 버튼의 슬롯 양쪽 여백을 React와 같은 규칙으로 자동 보정합니다.

- 왼쪽·오른쪽 슬롯 모두 첫 자식이 아이콘 버튼이면 왼쪽, 마지막 자식이 아이콘 버튼이면 오른쪽 여백을 보정합니다. 버튼 하나는 양쪽을 보정하며, 44px 터치 영역은 유지합니다.
- Fragment와 조건부 자식을 지원하며, `edge="leading" | "trailing" | "both"`으로 자동 보정 방향을 덮어쓸 수 있습니다.
- 커스텀 슬롯의 배치와 기존 사용자 스타일을 유지합니다.
