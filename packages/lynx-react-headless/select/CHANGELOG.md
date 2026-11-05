# @seed-design/lynx-react-select

## 1.0.1

### Patch Changes

- 6ec5b80: `globalPropsMode: "event"`에서 host가 `safeAreaInset*` global props를 바꿔도 `useSafeArea`가 이전 값을 반환하던 문제를 수정합니다. 이제 `useGlobalProps()`로 값을 구독해 화면 회전이나 폴더블 기기의 inset 변경을 반영합니다.
  
  - `useGlobalProps()`를 사용하므로 `useSafeArea`를 직접·간접으로 쓰는 headless 패키지의 `@lynx-js/react` peer dependency 하한을 `>=0.117.0`으로 올립니다. `@seed-design/lynx-react`는 이미 `>=0.117.0`을 요구합니다.
- Updated dependencies [6ec5b80]
  - @seed-design/lynx-react-floating@1.0.1

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- e5ebfb1: SEED 스타일 없이 선택 목록을 조합하는 `@seed-design/lynx-react-select`를 추가합니다.
  
  - `Root`·`Trigger`·`Value`·`Placeholder`·`Positioner`·`Content`·`ScrollArea`·`Group`·`GroupLabel`·`Item`과 `useSelect`으로 단일·다중 선택, 값과 열림 상태 제어, 선택 항목 스크롤을 지원합니다.
  - `formatValue`로 선택값 표시를 지정하고, `disabled`·`readOnly`로 사용자 선택을 제한할 수 있습니다.

### Patch Changes

- Updated dependencies [6faa8c1]
- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-floating@1.0.0
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
