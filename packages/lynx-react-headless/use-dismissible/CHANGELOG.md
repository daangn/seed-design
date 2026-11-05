# @seed-design/lynx-react-use-dismissible

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- d087109: Lynx에서 닫을 수 있는 요소의 controlled 또는 uncontrolled 표시 상태를 관리하는 `@seed-design/lynx-react-use-dismissible`을 추가합니다.
  
  - `useDismissible`은 `open`·`defaultOpen`·`onDismiss`를 받아 `open`과 `dismiss`를 반환합니다. `dismiss`로 닫힘을 요청하고 `onDismiss`에서 이를 처리할 수 있습니다.

### Patch Changes

- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-controllable-state@1.0.0
