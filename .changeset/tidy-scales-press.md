---
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/lynx-css": minor
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
---

Action Button에 눌렀을 때 살짝 축소되는 pressed scale 트랜지션을 추가합니다.

- 모션 선호도를 따르는 `$scale.s95`, `$scale.s97`, `$scale.s98` 토큰을 추가합니다. 웹(`@seed-design/css`)에서는 `prefers-reduced-motion`이 적용된 환경에서 축소 없이 `1`로 동작합니다. Lynx(`@seed-design/lynx-css`)는 `prefers-reduced-motion` 미디어 쿼리를 평가하지 않아, 해당 가드 없이 항상 축소가 적용됩니다.
- Action Button은 크기별로 다른 축소 비율을 적용합니다 (작은 사이즈일수록 더 크게 축소).
- Tailwind 플러그인에서 scale 토큰을 사용할 수 있습니다. v3는 `scale-*` 유틸리티, v4는 `--scale-*` 변수로 노출됩니다.
- List Item의 pressed contentScale을 하드코딩 `0.97`에서 `$scale.s97` 토큰 참조로 정리했습니다.
