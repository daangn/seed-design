---
"@seed-design/css": patch
---

Android 환경에서 테마 고정이 적용되지 않을 수 있는 문제를 수정합니다. (`[data-seed-color-mode="*-only"]`로 테마를 고정하는 경우, `color-scheme: only *;` 사용 가능한 환경에서는 `only` 키워드를 사용하도록 수정합니다.)
