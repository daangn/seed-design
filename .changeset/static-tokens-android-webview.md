---
"@seed-design/css": patch
---

Android WebView에서 시스템 폰트 스케일링이 `t*Static` 폰트 크기·행간 토큰에도 적용되던 문제를 수정합니다. 이제 static 토큰은 지정된 px 크기로 렌더링됩니다.

상쇄는 네이티브 앱이 `Configuration.fontScale`을 어떻게 캡하든 정확합니다. theming 스크립트가 Android에서 실측한 textZoom을 그대로 `--seed-static-font-scale`에 넣고, static 토큰이 그 값으로 나눠지기 때문입니다.

그래서 이제 `--seed-font-size-limit-max`가 실제 상한으로 동작합니다. 예를 들어 시스템 배율 200%에서 텍스트는 200%가 아니라 `--seed-font-size-limit-max`인 150%까지만 커지고, AppBar처럼 자체 상한을 둔 컴포넌트도 그 상한을 지킵니다.

`data-seed-font-multiplier`의 값과 범위는 바뀌지 않습니다. 이 속성은 지금처럼 SEED가 실제로 적용한 배율(Android `1.5` / iOS `1.35` 상한)을 담습니다.
