# @seed-design/lynx-react-segmented-control

## 1.0.3

### Patch Changes

- 582d25b: Lynx 컴포넌트의 첫 표시와 상호작용에서 화면에 반영할 변경 없이 반복되던 렌더링과 커밋을 줄입니다.
  
  - `Tabs`·`ChipTabs`의 초기 레이아웃, `AppBar`의 너비 측정, `SegmentedControl`의 항목 등록, `Slider`의 값 변경에서 불필요한 하위 갱신을 줄입니다.
  - `Avatar`·`ImageFrame`의 이미지 로드 및 실패 상태가 중복 반영되는 문제를 수정합니다.
  - `ReactionButton`과 `AttachmentDisplay`·`AttachmentInput`의 항목 액션에서 눌림 피드백에 중복되던 상태 갱신을 줄입니다.

## 1.0.2

### Patch Changes

- 6c1fa1f: Lynx 컴포넌트에서 같은 props와 측정값으로 반복하던 main-thread 전송과 하위 파트 렌더링을 줄입니다.
- Updated dependencies [6c1fa1f]
  - @seed-design/lynx-react-use-press-tap@1.0.2

## 1.0.1

### Patch Changes

- 4b1d559: `@lynx-js/react` peer dependency 하한을 `>=0.100.0`에서 `>=0.117.0`으로 올려 Lynx 패키지 전체와 맞춥니다.
- Updated dependencies [4b1d559]
  - @seed-design/lynx-react-use-controllable-state@1.0.1
  - @seed-design/lynx-react-use-press-tap@1.0.1

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- ac07387: SEED 스타일 없이 단일 선택 세그먼트를 조합할 수 있는 `@seed-design/lynx-react-segmented-control`을 추가합니다. `SegmentedControl.Root`·`SegmentedControl.Item`과 `useSegmentedControl`·`useSegmentedControlContext`로 선택 상태와 접근성 속성을 연결합니다.
  
  - `value`·`defaultValue`·`onValueChange`로 선택값을 관리하고, `disabled`로 선택 변경을 막을 수 있습니다.
  - `--segment-count`·`--segment-index`로 직접 만든 선택 표시 요소의 위치와 크기를 지정할 수 있습니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
