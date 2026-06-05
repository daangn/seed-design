---
"@seed-design/react-floating": minor
"@seed-design/react-tooltip": minor
"@seed-design/react": minor
"@seed-design/react-popover": patch
"@seed-design/css": patch
---

hover/focus로 열리는 `HelpBubbleTooltip` 컴포넌트를 추가합니다.

- `@seed-design/react`에 `HelpBubbleTooltip` 컴포넌트를 추가합니다. 포인터를 올리거나(hover) 키보드로 포커스(focus)하면 열리며, `role="tooltip"`을 사용해 트리거에 `aria-describedby`를 연결합니다. HelpBubble의 시각 스타일(recipe)을 공유하지만 별도 컴포넌트이며, tooltip 성격에 맞게 Close Button이나 내부 인터랙션 요소는 포함하지 않습니다.
- 헤드리스 로직을 의미 단위로 분리합니다.
  - `@seed-design/react-tooltip`(`useTooltip`): hover+focus 트리거와 `role="tooltip"` 전용 헤드리스 패키지를 추가합니다.
  - `@seed-design/react-floating`(`usePositionedFloating`): popover와 tooltip이 공유하는 positioning 로직을 별도 패키지로 분리합니다.
- `@seed-design/react-popover`는 positioning 로직을 `@seed-design/react-floating`에서 가져오도록 내부 리팩터했습니다. 공개 API 변경은 없습니다.
- `TooltipDelayGroup`으로 tooltip을 연속해서 전환할 때 enter/exit 애니메이션을 건너뛰고 즉시 swap되도록 help-bubble recipe에 `[data-instant]` 스타일을 추가합니다. (`@seed-design/css`)
