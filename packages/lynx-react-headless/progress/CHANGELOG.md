# @seed-design/lynx-react-progress

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 6ad3b50: SEED 스타일 없이 원형 진행 상태를 조합할 수 있는 `@seed-design/lynx-react-progress`를 추가합니다. `ProgressCircle.Root`·`ProgressCircle.Track`·`ProgressCircle.Range`, `useProgress`, `ProgressCircleProvider`와 `useProgressCircleContext`를 제공합니다.
  
  - `value`·`minValue`·`maxValue`로 진행률과 접근성 값을 계산하며, `value`를 생략하면 indeterminate 상태가 됩니다.
  - `Track`은 전체 배경 링, `Range`는 완료된 구간을 위한 별도 파트입니다. 각 파트의 스타일은 직접 지정합니다.
