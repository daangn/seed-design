---
"@seed-design/lynx-react-popover": patch
---

`HelpBubble`·headless Popover가 열린 동안 기준 요소의 layout이 다시 보고될 때마다 다시 렌더링해 빈 Main Thread commit을 보내던 문제를 수정합니다. 이제 다시 렌더링하지 않고 다음 frame 측정에서 위치를 갱신합니다. `@lynx-js/react` 0.125.0에서 열린 HelpBubble의 Trigger layout이 같은 값으로 다시 보고될 때 commit이 6회에서 0회로, 열고 위치를 잡을 때까지의 commit이 23회에서 17회로 줄어듭니다. 이에 따라 `usePopover`의 `positionRevision`은 항상 `0`이며 사용 중단됩니다. 측정 요청 횟수는 `positionRevisionRef`로 읽습니다.
