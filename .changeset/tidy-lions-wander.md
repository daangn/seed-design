---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
---

`$gradient.fade-mask` 토큰을 추가하고, ScrollFog의 fog 마스크를 easing 그라데이션으로 개선합니다.

- `$gradient.fade-mask`(`--seed-gradient-fade-mask`)를 추가합니다. 콘텐츠를 부드럽게 가리는 마스크용 불투명도(alpha) easing 곡선이며, 라이트/다크 테마에서 동일합니다.
- ScrollFog의 가장자리 페이드가 기존 선형 2단계에서 16단계 easing 곡선으로 바뀌어 더 부드럽게 표현됩니다.
- ScrollFog spec의 `fromColor`/`toColor` 프로퍼티가 `gradient` 하나로 대체됩니다.
