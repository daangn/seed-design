---
"@seed-design/css": patch
---

Android WebView에서 시스템 폰트 스케일링이 `t*Static` 폰트 크기·행간 토큰에도 적용되던 문제를 수정합니다. 이제 static 토큰은 지정된 px 크기로 렌더링됩니다.

theming 스크립트가 측정한 사용자 폰트 배율을 `[0.8, 1.5]` 범위로 clamp해 `--seed-user-font-scale` CSS 변수와 `data-seed-font-multiplier` 데이터 속성에 동일한 값으로 노출합니다. SEED 토큰 외부에서 raw px로 지정한 `font-size` / `line-height`도 `calc(<px> / var(--seed-user-font-scale, 1))` 형태로 감싸 static하게 만들 수 있으며, 이 상쇄는 네이티브 앱이 각 Activity의 `Configuration.fontScale`을 같은 범위(1.5 이하) 안으로 캡한다는 전제 위에서 정확합니다.
