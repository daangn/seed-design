---
"@seed-design/css": major
---

(BREAKING CHANGE: Side Panel 본문의 높이를 `--seed-box-height`, `--seed-box-min-height`, `--seed-box-max-height` 계열 CSS 변수로 지정하고 있었다면 제거해야 합니다.) Side Panel 본문 스타일에서 높이 관련 CSS 변수를 제거합니다. Side Panel 본문은 항상 헤더와 푸터를 제외한 남은 높이를 채웁니다.
