---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `HelpBubble.Arrow` 없이 조합한 말풍선의 기존 간격을 유지하려면 `HelpBubble.Root`에 `gutter={oldGutter + 8}`을 지정해야 합니다.) `HelpBubble`은 화살표를 렌더링할 때만 화살표 길이 8px을 기준 요소와의 간격에 더합니다. 항상 화살표를 렌더링하는 Registry `ui:help-bubble`의 간격은 그대로 유지합니다.
