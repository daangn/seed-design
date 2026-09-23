---
"@seed-design/react": patch
"@seed-design/react-floating": patch
---

Help Bubble과 Help Bubble Tooltip의 위치 추적을 수정합니다.

- 닫히는 애니메이션이 끝날 때까지 기준 요소를 따라갑니다. 이전에는 닫히기 시작하는 순간 위치 추적이 멈춰, 사라지는 도중에 페이지를 스크롤하면 기준 요소에서 떨어져 보였습니다.
- 스크롤로 위치가 바뀔 때마다 스크롤 리스너와 옵저버를 해제하고 다시 등록하던 문제를 수정합니다.
