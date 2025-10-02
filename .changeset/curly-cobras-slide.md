---
"@seed-design/css": patch
---

HelpBubble의 스타일을 업데이트하고, 신규 기능을 지원합니다.

- arrowTip이 content에서 떨어져 보이던 문제를 수정합니다.
- title과 description에서 `\n`을 줄바꿈으로 렌더링하도록 수정합니다.
- `closeOnInteractOutside`를 `false`로 설정하여 Help Bubble 외부와 상호작용 시에도 닫히지 않도록 설정할 수 있습니다. (기본값: `true`)
