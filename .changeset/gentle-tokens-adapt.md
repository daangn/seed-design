---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
---

Lynx에서 웹용 CSS 패키지를 필수로 요구하던 peer dependency를 수정합니다. `@seed-design/css`와 `@seed-design/lynx-css`를 optional peer로 선언하며, 사용자는 플랫폼에 맞는 CSS 패키지를 설치하고 토큰 CSS를 불러와야 합니다.
