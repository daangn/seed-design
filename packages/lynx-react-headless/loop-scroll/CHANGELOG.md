# @seed-design/lynx-react-loop-scroll

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 3a9dbc2: 세로 드래그와 관성 스크롤로 항목을 선택하는 휠 UI를 조합할 수 있는 `@seed-design/lynx-react-loop-scroll`을 추가합니다.
  
  - `LoopScroll.Root`·`Track`·`Highlight`를 조합하고 `itemCount`·`itemSize`·`visibleItemCount`로 표시 영역을 지정합니다. `Track`의 render callback으로 항목 내용을 그립니다.
  - `loop`로 마지막 항목 다음에 첫 항목이 이어지게 반복합니다.
  - `index`·`defaultIndex`로 선택 상태를 지정하고, `onIndexChange`로 조작 후 정착한 항목을, `onActiveIndexChange`로 조작 중 지나가는 항목을 확인할 수 있습니다.

### Patch Changes

- a8229fe: iOS 네이티브 접근성 트리에서 LoopScroll 항목이 빠지지 않게 합니다. 항목을 옮기는 Track 내부 view에 항목 한 칸 높이를 줍니다.
- e056828: `WheelPicker`가 가까운 항목에 정착하기 전에 렌더 창을 불필요하게 갱신해 항목을 생성하던 문제를 수정합니다.
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-controllable-state@1.0.0
