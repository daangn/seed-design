# @seed-design/lynx-react-slider

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 46bab1a: SEED 스타일 없이 슬라이더를 조합할 수 있는 `@seed-design/lynx-react-slider`를 추가합니다.
  
  - `Slider.Root`·`Thumb`·`Range`·`Tick`·`Marker`·`ValueIndicatorRoot`·`ValueIndicatorLabel`과 `useSlider`로 제어·비제어 값, 여러 thumb, 드래그 조작을 지원합니다.
  - `step`·`allowedValues`·`minStepsBetweenThumbs`로 선택 범위를 제한합니다.
  - `onValuesChange`·`onValuesCommit`으로 값 변경과 조작 완료를 구분합니다.

### Patch Changes

- 7dae990: Lynx `Slider`의 controlled 값을 최솟값으로 바꾸면 Value Indicator 위치 계산이 반복되어 `CallLepusMethod called too frequently` 경고가 발생하던 문제를 수정합니다.
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-controllable-state@1.0.0
