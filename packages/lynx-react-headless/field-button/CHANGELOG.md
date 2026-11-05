# @seed-design/lynx-react-field-button

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- f98c5aa: SEED 스타일 없이 선택값을 표시하고 지우는 필드를 조합할 수 있는 `@seed-design/lynx-react-field-button`을 추가합니다.
  
  - `FieldButton.Root`에 `values`·`onValuesChange`를 연결하고 `Button`·`ClearButton`·`Description`·`ErrorMessage`를 조합합니다.
  - `ClearButton`을 누르면 `onValuesChange([])`로 값 삭제를 요청합니다.
  - `disabled`·`readOnly` 상태에서는 버튼 조작을 차단합니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
