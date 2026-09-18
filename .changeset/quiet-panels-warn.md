---
"@seed-design/react": patch
---

`SidePanelBody`와 `ResponsiveSidePanelBody`의 `height`, `minHeight`, `maxHeight` prop을 deprecated 처리합니다. 세 prop은 SEED React 3.0.0에서 제거됩니다.

- Side Panel 본문은 항상 헤더와 푸터를 제외한 남은 높이를 채우므로, 세 prop은 효과가 없거나 푸터 위치를 깨뜨립니다.
- Bottom Sheet로 렌더링되는 `ResponsiveSidePanelBody`에서 본문 높이를 지정해야 한다면, 본문 안에 `Box`를 두고 높이를 지정하세요.
