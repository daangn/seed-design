---
"@seed-design/lynx-react-image": patch
"@seed-design/lynx-react": patch
---

Lynx `Image.Content`가 로딩 상태를 자체 state를 거치지 않고 `Image.Root`에 바로 알리도록 바꿔, 이미지 load·error 때 Main Thread로 보내던 빈 commit을 없앱니다. `Avatar`는 load 한 번에 commit을 두 번 보내던 것을 한 번으로 줄입니다. `onLoadingStatusChange` 호출 순서와 fallback 표시는 그대로입니다.
