---
"@seed-design/rsbuild-plugin": patch
"@seed-design/webpack-plugin": patch
"@seed-design/vite-plugin": patch
"@seed-design/css": patch
---

iOS font scaling을 위한 attribute를 추가합니다
- `data-seed-font-scaling='enabled'` 일 때, 폰트 크기를 조정합니다.
- vite, webpack, rsbuild 플러그인에 `fontScaling` 옵션을 추가합니다.
