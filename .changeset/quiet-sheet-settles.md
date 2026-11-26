---
"@seed-design/lynx-react-bottom-sheet": minor
"@seed-design/lynx-react": minor
---

Bottom Sheet에 열림·닫힘 애니메이션이 끝났을 때 호출되는 `onAnimationEnd`를 추가합니다.

- 닫힘(`false`)은 시트 레이어가 화면에서 제거된 뒤에 호출되므로, 시트를 닫은 뒤 띄우는 스낵바 같은 native UI가 닫히는 overlay와 함께 사라지지 않습니다.
