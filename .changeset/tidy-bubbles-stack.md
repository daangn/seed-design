---
"@seed-design/react": patch
"@seed-design/react-popover": patch
---

`HelpBubble`의 닫힘 동작을 수정합니다.

- 다이얼로그나 시트 같은 레이어 안에서 연 `HelpBubble`을 Escape 키나 외부 영역 누름으로 닫을 때 바깥 레이어까지 함께 닫히던 문제를 수정합니다. 이제 가장 위에 열린 `HelpBubble`만 닫힙니다.
- 바깥 레이어가 닫혀도 `HelpBubble`이 열린 채 남던 문제를 수정합니다.
- 터치 환경에서 외부 영역에 손가락이 닿는 순간 닫히던 동작을, 탭을 마치거나 손가락을 움직였을 때 닫히도록 바꿉니다. Menu, Select와 같은 방식입니다.
