---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
---

Lynx에서 웹용 CSS 패키지를 필수로 요구하던 문제를 수정합니다.

`@seed-design/css`와 `@seed-design/lynx-css`를 optional peer로 변경합니다. 웹에서는 `@seed-design/css`, Lynx에서는 `@seed-design/lynx-css`를 설치하고 해당 패키지의 토큰 CSS를 불러와야 합니다.
