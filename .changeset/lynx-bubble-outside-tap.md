---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `HelpBubble`이 첫 바깥 탭을 차단하는 동작에 의존했다면 바깥 요소의 탭 handler에서 말풍선의 열림 상태를 확인해 탭을 직접 차단해야 합니다.) `HelpBubble`의 `closeOnInteractOutside`는 바깥 탭으로 말풍선을 닫으면서 탭한 요소에도 같은 탭을 전달합니다.
