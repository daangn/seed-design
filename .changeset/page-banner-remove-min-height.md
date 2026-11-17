---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": minor
---

Page Banner의 최소 높이(40px)를 제거해, 글자 크기를 줄여도 텍스트 아래에 여백이 남지 않습니다.

- 배너 높이는 위아래 padding과 콘텐츠 높이로 정해집니다. 기본 글자 크기에서 한 줄 배너는 39px로 렌더링됩니다.
- Rootage `page-banner` 스펙에서 `root.minHeight`를 제거합니다.
