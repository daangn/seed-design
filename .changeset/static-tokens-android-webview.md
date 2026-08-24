---
"@seed-design/css": patch
---

Android WebView에서 시스템 폰트 스케일링이 `t*Static` 폰트 크기·행간 토큰에도 적용되던 문제를 수정합니다. 이제 static 토큰은 시스템 폰트 배율과 무관하게 지정된 px 크기로 렌더링됩니다. theming 스크립트가 Android에서 측정한 textZoom 배율을 `--seed-user-font-scale` CSS 변수로 노출하며, SEED 토큰 외부에서 raw px로 지정한 `font-size` / `line-height`도 `calc(<px> / var(--seed-user-font-scale, 1))` 형태로 감싸 static하게 만들 수 있습니다.
