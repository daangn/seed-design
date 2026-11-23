---
"@seed-design/lynx-react-bottom-sheet": patch
"@seed-design/lynx-react": patch
---

`skipAnimation`으로 연 Bottom Sheet·Menu Sheet가 레이어 크기를 측정한 뒤 닫힌 위치로 돌아가 화면에 보이지 않던 문제를 수정합니다. 측정값으로 시트의 인라인 style이 다시 적용되어도 현재 위치를 유지합니다.
