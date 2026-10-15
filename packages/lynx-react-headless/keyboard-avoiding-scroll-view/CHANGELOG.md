# @seed-design/lynx-react-keyboard-avoiding-scroll-view

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 575cdfe: 키보드에 가려지는 입력과 하단 버튼을 배치할 수 있는 `@seed-design/lynx-react-keyboard-avoiding-scroll-view`를 추가합니다.
  
  - `KeyboardAvoidingScrollView.Root` 안에 `Content`·`Footer`를 조합하고, scroll ref·prop·event는 `Content`에 전달합니다.
  - `useKeyboardAvoidingScrollViewContext`로 등록한 `Content` 안의 입력이 포커스되면 키보드와 하단 영역 위로 스크롤합니다. `Footer`는 키보드 바로 위로 이동하며, 그 안의 입력은 `Content`를 스크롤하지 않습니다.
  - `Root`의 `keyboardGap`·`scrollBehavior`로 회피 간격과 이동 방식을 지정합니다.
  - 내부 입력의 Lynx `avoid-keyboard`와 함께 사용하지 않습니다.
