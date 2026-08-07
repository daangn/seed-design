---
"@seed-design/css": patch
---

Chrome 104 / Safari 16.4 미만 버전에서 `@media (width >= npx)` 미디어 쿼리를 `(min-width: 768px)`로 교체하여 미디어 쿼리가 의도대로 작동하도록 수정합니다.

Chrome 108 / Safari 15.4 미만 버전에서 Dialog(`ContentDialog`)의 `dvh` `max-height`가 `vh`로 폴백되도록 수정합니다.
