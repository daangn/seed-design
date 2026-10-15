# @seed-design/lynx-react-collapsible

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 362cada: SEED 스타일 없이 접히는 영역을 조합할 수 있는 `@seed-design/lynx-react-collapsible`을 추가합니다.
  
  - `Collapsible.Root`·`Collapsible.Trigger`·`Collapsible.Content`와 `useCollapsible`로 열림 상태와 내용 높이를 관리합니다.
  - `open`·`defaultOpen`·`onOpenChange`로 열림 상태를 제어하고, `disabled`로 사용자 열림 전환을 막습니다.
  - 닫힌 내용은 접근성 트리에서 숨깁니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
