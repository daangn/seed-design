---
"@seed-design/rootage-artifacts": major
"@seed-design/css": major
"@seed-design/lynx-css": major
"@seed-design/tailwind3-plugin": major
"@seed-design/tailwind4-theme": major
"@seed-design/react": major
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `$scale.s95`·`$scale.s97`·`$scale.s98` 토큰과 그 CSS 변수·Tailwind 유틸리티를 쓰는 코드를 제거해야 합니다. 눌림 축소에는 Scale Feedback을 사용하세요.) scale 토큰을 제거합니다.

- Rootage에서 `$scale.s95`, `$scale.s97`, `$scale.s98` 토큰을 제거합니다.
- `--seed-scale-s95`, `--seed-scale-s97`, `--seed-scale-s98` CSS 변수와 `@seed-design/css/vars/scale`, `@seed-design/lynx-css/vars/scale`을 제거합니다.
- Tailwind CSS의 `scale-s95`, `scale-s97`, `scale-s98` 유틸리티를 제거합니다.
