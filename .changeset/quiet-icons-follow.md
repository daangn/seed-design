---
"@seed-design/css": patch
"@seed-design/lynx-css": patch
"@seed-design/rootage-artifacts": patch
---

Page Banner 닫기 버튼의 solid 톤 아이콘이 팔레트 색상을 직접 참조하던 문제를 수정합니다. 이제 Page Banner 본문과 같은 `$color.fg.on-*-solid` 토큰을 참조하며, 렌더링되는 색상은 바뀌지 않습니다.
