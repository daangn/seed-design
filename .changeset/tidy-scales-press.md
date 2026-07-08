---
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/lynx-css": minor
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
---

Action Button의 pressed 상태에 scale 모션을 추가합니다.

pressed 상태에 적절한 모션 피드백을 제공하기 위해 사용하는 `$scale.s95`, `$scale.s97`, `$scale.s98` 토큰을 추가합니다.

- `scale` 토큰은 플랫폼 별 동작 줄이기 설정에 따라 값이 `1`로 동작합니다.
- 웹 CSS 환경에서는 `(prefers-reduced-motion: reduce)` 미디어 쿼리가 매치되는 환경에서 `1`로 동작합니다.
- Tailwind 유틸리티 클래스 `scale-s*`를 통해 scale 토큰을 사용할 수 있습니다. 신규 토큰을 사용할 수 있도록 Tailwind 패키지의 `@seed-design/css` peerDependency 범위를 `^2.1.0`에서 `^2.2.0`으로 올립니다.
