---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx `ContentPlaceholder` 컴포넌트를 추가합니다.

- `Root`와 `Asset`으로 이미지나 콘텐츠가 없는 영역에 배경과 중앙 정렬된 시각 요소를 표시합니다.
- 웹의 `type` 프리셋 대신 아이콘이나 이미지를 `children`으로 전달합니다. 단색 아이콘을 직접 넣으면 `Asset`이 크기와 색상을 적용합니다. 사진과 멀티컬러 아이콘은 원래 색상을 유지합니다.
- `npx @seed-design/cli@latest add ui:content-placeholder`로 Registry 컴포넌트를 설치할 수 있습니다.
- `preserveOriginalColor` 전환 시 같은 아이콘을 유지하면서 기존 tint를 복원합니다.
