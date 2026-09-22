---
"@seed-design/react": major
"@seed-design/css": major
---

(BREAKING CHANGE: `SidePanelBody`와 `ResponsiveSidePanelBody`에 전달하던 `height`, `minHeight`, `maxHeight`를 제거해야 합니다.) Side Panel 본문에서 높이 관련 prop을 제거합니다.

- Side Panel 본문은 항상 헤더와 푸터를 제외한 남은 높이를 채우므로, 세 prop은 효과가 없거나 푸터를 패널 밖으로 밀어내거나 패널 중간에 띄웠습니다.
- `ResponsiveSidePanelBody`에 전달한 높이는 Bottom Sheet로 렌더링될 때만 효과가 있었습니다. 같은 동작이 필요하면 `useResponsiveSidePanelContext()`의 `shouldUseBottomSheet`가 `true`일 때만 본문 안의 `Box`에 높이를 지정하세요.
