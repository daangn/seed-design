---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Lynx Select Trigger와 Select Item에 Content Scale을 적용합니다. 누르면 배경은 그대로 두고 콘텐츠만 줄어들며, Trigger는 `disabled`·`readOnly`, Item은 `disabled`일 때 줄어들지 않습니다. `select-trigger`·`select-item` Recipe에 `scaleContent` slot을 추가하고, 크기별 `gap`을 `root`에서 `scaleContent`로 옮깁니다.
