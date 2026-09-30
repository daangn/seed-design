---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: HelpBubble이 열린 동안 첫 바깥 탭이 아래 요소에 전달되지 않는 동작에 의존했다면, 해당 요소의 탭 handler에서 HelpBubble의 열림 상태를 확인해야 합니다.) HelpBubble의 `closeOnInteractOutside`가 바깥 탭을 가로채지 않습니다. Trigger·Anchor와 말풍선 밖을 한 번 탭하면 말풍선이 닫히고, 그 탭은 아래 요소에도 전달되어 React HelpBubble과 같이 동작합니다.
