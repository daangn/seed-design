# @seed-design/lynx-react-app-bar

## 1.0.2

### Patch Changes

- 582d25b: Lynx 컴포넌트의 첫 표시와 상호작용에서 화면에 반영할 변경 없이 반복되던 렌더링과 커밋을 줄입니다.
  
  - `Tabs`·`ChipTabs`의 초기 레이아웃, `AppBar`의 너비 측정, `SegmentedControl`의 항목 등록, `Slider`의 값 변경에서 불필요한 하위 갱신을 줄입니다.
  - `Avatar`·`ImageFrame`의 이미지 로드 및 실패 상태가 중복 반영되는 문제를 수정합니다.
  - `ReactionButton`과 `AttachmentDisplay`·`AttachmentInput`의 항목 액션에서 눌림 피드백에 중복되던 상태 갱신을 줄입니다.

## 1.0.1

### Patch Changes

- 6ec5b80: `globalPropsMode: "event"`에서 host가 `safeAreaInset*` global props를 바꿔도 `useSafeArea`가 이전 값을 반환하던 문제를 수정합니다. 이제 `useGlobalProps()`로 값을 구독해 화면 회전이나 폴더블 기기의 inset 변경을 반영합니다.
  
  - `useGlobalProps()`를 사용하므로 `useSafeArea`를 직접·간접으로 쓰는 headless 패키지의 `@lynx-js/react` peer dependency 하한을 `>=0.117.0`으로 올립니다. `@seed-design/lynx-react`는 이미 `>=0.117.0`을 요구합니다.
- Updated dependencies [6ec5b80]
- Updated dependencies [755e0a0]
  - @seed-design/lynx-react-use-safe-area@1.0.1

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- e91d2d9: SEED 스타일 없이 App Bar를 구성할 수 있는 `@seed-design/lynx-react-app-bar`를 제공합니다.
  
  - `AppBar.Root`·`Left`·`Main`·`Right`·`IconButton`과 `useAppBar`·`useAppBarSide`·`useAppBarIconButton`을 사용할 수 있습니다.
  - safe area, 좌우 영역 너비, 가운데 제목 padding, 아이콘 버튼 접근성을 구성할 수 있습니다.

### Patch Changes

- Updated dependencies [e91d2d9]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-safe-area@1.0.0
