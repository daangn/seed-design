# @seed-design/lynx-react-dialog

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- e1a260b: SEED 스타일 없이 `Dialog`를 조합하는 `@seed-design/lynx-react-dialog`를 제공합니다.
  
  - `Root`의 제어·비제어 열림 상태와 `onOpenChange`·`skipAnimation`을 제공합니다.
  - `Trigger`·`Positioner`·`Backdrop`·`Content`·`Title`·`Description`·`CloseButton`을 사용할 수 있습니다.
  - `Positioner`는 `container`·`overlayLevel`·`dialogViewProps`를 지원합니다.
