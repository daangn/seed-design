---
"@seed-design/lynx-react": patch
"@seed-design/lynx-react-popover": patch
---

Lynx 컴포넌트가 Main Thread에 보내는 commit 수를 줄입니다. `RadioGroup`·`RadioGroupField`·`RadioSelectBox`에서 항목을 선택하거나 `SegmentedTextInput`에 입력할 때 항목·Segment 수만큼 생기던 commit이 `@lynx-js/react` 0.126 이상에서 한 번으로 줄어듭니다. `HelpBubble`·headless Popover는 기준 요소의 layout이 다시 보고되어도 다시 렌더링하지 않고 다음 frame 측정에서 위치를 갱신합니다. 이에 따라 `usePopover`의 `positionRevision`은 항상 `0`이며 사용 중단됩니다. 측정 요청 횟수는 `positionRevisionRef`로 읽습니다.
