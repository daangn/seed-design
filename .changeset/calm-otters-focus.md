---
"@seed-design/stackflow": patch
---

`AppScreen`이 화면 진입 애니메이션 완료 후 포커스를 이동할 때 `preventScroll`을 적용해, 스크롤 가능한 컨테이너(예: iframe)에 임베드된 경우 발생하던 원치 않는 스크롤 점프를 방지합니다.
