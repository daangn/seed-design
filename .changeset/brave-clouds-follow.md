---
"@seed-design/react-floating": minor
---

`usePositionedFloating`에 가용 높이 변수와 열림 상태 변경 정보를 추가합니다.

- floating element에 `--seed-popover-available-height`를 설정합니다.
- 두 번째 인자 `getChangeDetails`로 floating-ui의 `(event, reason)`을 변환해 `onOpenChange`의 두 번째 인자로 받을 수 있습니다.
