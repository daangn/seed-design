---
"@seed-design/rsbuild-plugin": patch
"@seed-design/webpack-plugin": patch
"@seed-design/vite-plugin": patch
"@seed-design/css": patch
---

iOS Font Scaling

- iOS 기기에서 시스템 폰트 크기 설정에 따라 동적으로 폰트 크기와 줄 높이를 조정하는 폰트 스케일링 옵션이 추가되었습니다.
- 플러그인(webpack, vite, rsbuild)에서 `fontScaling` 옵션을 통해 폰트 스케일링 기능을 활성화할 수 있습니다.
- `data-seed-font-scaling='enabled'` 일 때, 폰트 크기를 조정합니다.
