---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `HelpBubble.Arrow` 없이 HelpBubble을 직접 조립하면서 기존 간격을 유지하려면 `HelpBubble.Root`의 `gutter`를 8만큼 늘려야 합니다.) HelpBubble은 `HelpBubble.Arrow`를 렌더링할 때만 화살표가 튀어나온 길이 8px을 기준 요소와의 간격에 더합니다. Registry `ui:help-bubble`은 항상 화살표를 렌더링하므로 간격이 그대로입니다.
