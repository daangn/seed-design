# @seed-design/lynx-react-floating

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 6faa8c1: 기준 요소에 맞춰 콘텐츠 위치를 계산하는 `@seed-design/lynx-react-floating`을 추가합니다.
  
  - `computePosition`으로 `placement`, `flip`, `shift`를 지정하고 화살표 위치와 콘텐츠가 사용할 수 있는 너비·높이를 계산합니다.

### Patch Changes

- Updated dependencies [e91d2d9]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-safe-area@1.0.0
