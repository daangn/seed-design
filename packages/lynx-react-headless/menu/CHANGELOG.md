# @seed-design/lynx-react-menu

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- bb2513e: SEED 스타일 없이 메뉴를 조합하는 `@seed-design/lynx-react-menu`를 추가합니다.
  
  - `Root`·`Trigger`·`Anchor`·`Positioner`·`Content`·`Group`·`GroupLabel`·`Item`을 제공합니다.
  - `useMenu`·`useMenuItem`으로 열림 상태 제어, 항목 비활성화, 바깥 탭 닫기를 지원합니다.
  - `Positioner`의 `container`로 native overlay를 선택할 수 있습니다.

### Patch Changes

- Updated dependencies [6faa8c1]
- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-floating@1.0.0
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
