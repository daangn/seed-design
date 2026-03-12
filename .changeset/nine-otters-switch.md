---
"@seed-design/rootage-artifacts": minor
"@seed-design/react": minor
"@seed-design/css": minor
---

Content Placeholder 컴포넌트의 슬롯 구조를 개선합니다.

- 슬롯 구조를 3개(root, container, image)에서 2개(root, asset)로 단순화
- asset 슬롯에 minWidth(16px), maxWidth(64px), heightFraction(0.5) 속성 추가
- heightFraction을 통해 부모 높이의 50%로 크기를 동적으로 계산
