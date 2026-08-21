# @seed-design/design-token

## 1.0.5

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 1.0.4

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.

## 1.0.3

### Patch Changes

- 5751b08: fix missing export lineHeight

## 1.0.2

### Patch Changes

- cd0f24e: add types field in exports map

## 1.0.1

### Patch Changes

- 420299b: fix missing letterSpacing scale export

## 1.0.0

### Major Changes

- 1.0.0 Release

  ## Karrot UI → Seed Design 주요 변경 사항

  - 프로젝트/디자인 시스템 명이 **Seed Design**으로 리브랜딩 됩니다.
  - 패키지 명이 `@seed-design/*` 으로 변경됩니다.
  - `@karrot-ui/*` packages are deprecated.
  - `color-scheme: light dark` 지원이 기본값이 됩니다.
  - 디자인 토큰이 [KDT](https://github.com/daangn/kdt/tree/main/language) 의미론을 따릅니다.
