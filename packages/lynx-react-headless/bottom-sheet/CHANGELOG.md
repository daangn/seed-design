# @seed-design/lynx-react-bottom-sheet

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 0e01546: SEED 스타일 없이 `BottomSheet`를 조합하는 `@seed-design/lynx-react-bottom-sheet`를 제공합니다.
  
  - `Root`의 `open`·`defaultOpen`·`onOpenChange`로 열림 상태와 변경 사유를 관리합니다.
  - `Trigger`·`Backdrop`·`Positioner`·`Content`·`Handle`·`CloseButton`을 조합하며, `Positioner`는 `container`를 지정한 overlay 레이어를 채웁니다.
