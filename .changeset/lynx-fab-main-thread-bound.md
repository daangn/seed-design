---
"@seed-design/lynx-react": patch
---

`FloatingActionButtonRoot`가 `disabled`로 바뀐 뒤 누를 때마다 `MainThreadFunction: Invalid function object` 경고를 남기던 문제를 수정합니다. 비활성 상태에서도 Scale Feedback·tap handler를 연결한 채로 두며, 눌림 축소·탭 차단은 기존과 같습니다.
