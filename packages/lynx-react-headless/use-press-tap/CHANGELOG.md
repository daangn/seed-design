# @seed-design/lynx-react-use-press-tap

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- bc976a5: `usePressTap`에 커스텀 터치 동작과 눌림 상태 관리를 함께 사용할 수 있는 callback을 추가합니다.
  
  - `mainThreadOnTouchStart`·`mainThreadOnTouchEnd`·`mainThreadOnTouchCancel`을 지정할 수 있습니다.
  - 반환하는 `main-thread:bindtouchstart`·`main-thread:bindtouchend`·`main-thread:bindtouchcancel` handler는 지정한 callback을 호출한 뒤 눌림 상태를 갱신합니다.

### Patch Changes

- d8228c3: `usePressTap`이 `disabled`로 바뀐 뒤 탭할 때마다 `MainThreadFunction: Invalid function object` 경고를 남기던 문제를 수정해, 비활성 상태의 탭을 callback 호출이나 경고 없이 무시합니다.

## 0.1.0

### Minor Changes

- fa699aa: Lynx 상태·press/tap 훅을 독립 패키지로 분리합니다.

  - 기존 `@seed-design/lynx-react`의 훅 import와 Scale Feedback 연동을 유지합니다.
  - 누르는 도중 `disabled`로 바뀌면 pressed 상태를 해제합니다.
