---
"@seed-design/tailwind3-plugin": patch
"@seed-design/tailwind4-theme": patch
---

Lynx에서 웹용 CSS 패키지를 필수로 요구하던 peer dependency를 수정합니다. `@seed-design/css`와 `@seed-design/lynx-css`를 optional peer로 선언하며, 사용자는 플랫폼에 맞는 CSS 패키지를 설치하고 토큰 CSS를 불러와야 합니다.

`@seed-design/tailwind4-theme`의 웹 CSS peer 하한을 `^2.7.0`으로 수정합니다. 참조하는 `--seed-gradient-fade-mask` 토큰이 이 버전부터 제공됩니다. `@seed-design/tailwind3-plugin`의 웹 CSS peer 범위는 유지합니다.
