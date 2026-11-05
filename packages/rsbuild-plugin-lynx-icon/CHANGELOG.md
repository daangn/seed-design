# @seed-design/rsbuild-plugin-lynx-icon

## 0.2.1

### Patch Changes

- a6aca14: `sharp` 의존성을 v0.35.0으로 업데이트하여 보안 취약점(CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591)을 수정합니다.

## 0.2.0

### Minor Changes

- 86f74d7: 라이선스를 MIT에서 Apache-2.0으로 변경합니다. 저장소 루트의 Apache License 2.0과 표기가 달랐던 것을 일치시킵니다.

  - 배포물에 `LICENSE`와 `NOTICE`를 포함해, 설치한 패키지에서 바로 이용 조건을 확인할 수 있습니다.
  - MIT와 달리 재배포할 때 라이선스 사본과 `NOTICE`의 귀속 고지를 함께 전달해야 하고, 수정한 파일에는 변경 사실을 표시해야 합니다.
  - 당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 0.1.0

### Minor Changes

- 05c799e: Lynx 아이콘 SVG를 WebP data URL로 변환하는 Rsbuild 플러그인 추가

  - Lynx 3.5에서 SVG를 지원하지 않아 빌드 시 `sharp`를 사용해 WebP로 변환하는 플러그인을 추가합니다.
  - 기존 수동 로더 설정 대신 `pluginLynxIcon()` 플러그인으로 간단하게 설정할 수 있습니다.
