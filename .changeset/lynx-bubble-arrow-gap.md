---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `HelpBubble.Arrow` 없이 조합한 말풍선의 기존 간격을 유지하려면 `HelpBubble.Root`에 `gutter={oldGutter + 8}`을 지정해야 합니다.)

`HelpBubble`의 기준 요소와의 간격에 화살표 길이 8px을 더하는 조건을 변경합니다.

- 이전에는 `HelpBubble.Arrow`가 없어도 8px을 더했지만, 이제 화살표를 렌더링할 때만 더합니다.
- 항상 화살표를 렌더링하는 Registry `ui:help-bubble`의 간격은 그대로 유지합니다.
