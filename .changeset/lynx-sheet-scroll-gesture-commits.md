---
"@seed-design/lynx-react": patch
---

BottomSheet·MenuSheet가 같은 props로 다시 렌더링될 때 스크롤 영역의 scroll gesture main-thread handler를 다시 보내던 문제를 수정합니다. `@lynx-js/react` 0.117.0에서 이 렌더링이 보내던 patch가 빠지고 빈 commit 하나만 남습니다.
