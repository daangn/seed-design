# @seed-design/lynx-react-sortable

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 0f6e6a8: SEED 스타일 없이 길게 눌러 가로 목록의 순서를 바꾸는 `@seed-design/lynx-react-sortable`을 추가합니다.
  
  - `Sortable.Root`의 `items`·`getItemKey`·`onReorder`로 목록 순서를 관리하고, `Sortable.Item`으로 각 항목을 조합합니다.
  - `scrollableBoundaryId`로 가로 `<scroll-view>`를 지정하고, Root의 render prop으로 받는 `onScroll`·`dragging`을 스크롤 이벤트와 `enable-scroll`에 연결해 드래그 중 스크롤 잠금과 가장자리 자동 스크롤을 사용할 수 있습니다.
  - `reducedMotion`으로 항목 이동 애니메이션을 끄고, `Sortable.Item`의 `moveActionLabels`로 스크린 리더의 앞·뒤 이동 동작을 지정할 수 있습니다.
