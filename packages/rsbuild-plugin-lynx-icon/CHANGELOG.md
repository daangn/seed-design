# @seed-design/rsbuild-plugin-lynx-icon

## 0.1.0

### Minor Changes

- 05c799e: Lynx 아이콘 SVG를 WebP data URL로 변환하는 Rsbuild 플러그인 추가

  - Lynx 3.5에서 SVG를 지원하지 않아 빌드 시 `sharp`를 사용해 WebP로 변환하는 플러그인을 추가합니다.
  - 기존 수동 로더 설정 대신 `pluginLynxIcon()` 플러그인으로 간단하게 설정할 수 있습니다.
