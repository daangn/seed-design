---
"@seed-design/css": patch
"@seed-design/react-tabs": patch
---

선택한 탭을 화면 안으로 스크롤할 때 탭 옆에 두는 여유 공간을 JS 고정값(16px) 대신 탭의 CSS `scroll-margin`으로 정합니다. Tabs·Chip Tabs는 목록의 좌우 padding과 같은 값을 `scroll-margin`으로 지정하므로, Chip Tabs와 `triggerLayout="hug"`의 동작은 그대로이고 `triggerLayout="fill"`에서는 여유 공간이 0이 됩니다. SEED CSS 없이 `@seed-design/react-tabs`만 쓰는 경우 탭에 `scroll-margin`을 지정하지 않으면 여유 공간이 없습니다.
