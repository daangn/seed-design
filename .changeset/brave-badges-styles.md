---
"@seed-design/css": major
"@seed-design/lynx-css": minor
---

(BREAKING CHANGE: Badge의 기본 최대 너비로 긴 라벨을 말줄임하고 있었다면 최대 너비를 직접 지정해야 합니다.) Badge 스타일에 Prefix와 Action을 추가하고 기본 최대 너비를 제거합니다.

- Badge 스타일에 `prefix`, `action` slot(`.seed-badge__prefix`, `.seed-badge__action`)을 추가합니다.
- Badge에 기본으로 적용되던 최대 너비(`size="medium"` 7.5rem, `size="large"` 6.75rem)를 제거합니다.
