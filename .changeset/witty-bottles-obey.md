---
"@seed-design/css": patch
---

feat: change theming data attribute names

- theming에 사용되는 data attribute 이름을 변경합니다.
- 유저가 선호하는 color scheme과 사전에 지정된 color mode를 구분하기 쉽도록 이름을 부여합니다.
- 파편화된 platform 관련 네이밍을 통일합니다.
- 테마 관련 data attribute가 지정되지 않은 경우 light theme로 fallback하는 동작을 추가합니다.
