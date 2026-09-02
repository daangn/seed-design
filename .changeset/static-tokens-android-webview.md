---
"@seed-design/css": patch
---

Android WebView에서 시스템 폰트 스케일링이 `t*Static` 폰트 크기·행간 토큰에도 적용되던 문제를 수정합니다. 이제 static 토큰은 지정된 px 크기로 렌더링됩니다.

theming 스크립트가 측정한 사용자 폰트 배율을 기존 `data-seed-font-multiplier` 데이터 속성과 새 `--seed-user-font-scale` 변수에 함께 노출합니다. 두 값은 항상 같고, SEED가 실제로 적용하는 상한(`--seed-font-size-limit-max`, Android `1.5` / iOS `1.35`)으로 clamp됩니다.

이 상쇄는 네이티브 앱이 각 Activity의 `Configuration.fontScale`을 같은 범위(1.5 이하) 안으로 캡한다는 전제 위에서 정확합니다.
