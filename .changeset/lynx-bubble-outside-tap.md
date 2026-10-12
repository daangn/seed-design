---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `HelpBubble`이 첫 바깥 탭을 차단하는 동작에 의존했다면 바깥 요소의 탭 handler에서 말풍선을 닫는 탭에 해당 요소의 동작을 실행하지 않도록 처리해야 합니다.)

`HelpBubble`의 `closeOnInteractOutside`가 바깥 탭을 가로채지 않고 말풍선만 닫도록 변경합니다.

- 이전에는 바깥 탭으로 말풍선을 닫을 때 탭한 요소의 동작은 실행되지 않았습니다. 이제 같은 탭이 바깥 요소에도 전달되므로, 버튼이나 링크를 탭하면 말풍선이 닫히면서 해당 요소의 동작도 실행됩니다.
