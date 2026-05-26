---
"@seed-design/lynx-css": minor
---

(BREAKING CHANGE: Lynx에서 `.layered.css` 파일을 직접 import하고 있다면 일반 CSS 파일로 변경해야 합니다.) Lynx CSS 패키지에서 layered CSS 산출물을 제거합니다.

- Lynx에서 CSS cascade layer가 지원되지 않아 `all.layered.css`, `base.layered.css`, `recipes/*.layered.css`와 layered recipe entry를 더 이상 제공하지 않습니다.
- 기존 import는 `@seed-design/lynx-css/base.css`, `@seed-design/lynx-css/all.css`, `@seed-design/lynx-css/recipes/*.css` 또는 `@seed-design/lynx-css/recipes/*`로 변경하세요.
