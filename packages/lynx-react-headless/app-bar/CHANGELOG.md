# @seed-design/lynx-react-app-bar

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- e91d2d9: SEED 스타일 없이 App Bar를 구성할 수 있는 `@seed-design/lynx-react-app-bar`를 제공합니다.
  
  - `AppBar.Root`·`Left`·`Main`·`Right`·`IconButton`과 `useAppBar`·`useAppBarSide`·`useAppBarIconButton`을 사용할 수 있습니다.
  - safe area, 좌우 영역 너비, 가운데 제목 padding, 아이콘 버튼 접근성을 구성할 수 있습니다.

### Patch Changes

- Updated dependencies [e91d2d9]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-safe-area@1.0.0
