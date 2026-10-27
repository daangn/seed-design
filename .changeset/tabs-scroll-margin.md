---
"@seed-design/react-tabs": major
"@seed-design/css": minor
---

(BREAKING CHANGE: SEED CSS 없이 `@seed-design/react-tabs`만 쓰는 경우, 선택한 탭을 화면 안으로 스크롤할 때 옆에 여유 공간을 두려면 탭에 CSS `scroll-margin`을 지정해야 합니다.) 선택한 탭을 화면 안으로 스크롤할 때 탭 옆에 두는 여유 공간을 고정값 16px 대신 탭의 CSS `scroll-margin`으로 정합니다.

- `@seed-design/css`가 Tabs와 Chip Tabs의 탭에 16px `scroll-margin-inline`을 지정하므로, SEED CSS를 쓰면 동작이 그대로입니다. `@seed-design/react-tabs`를 올릴 때는 `@seed-design/css`도 함께 올려야 합니다.
