# @seed-design/lynx-react-accordion

## 1.0.1

### Patch Changes

- 35d7ec1: 조상 요소를 `display: none`으로 숨겼다가 다시 표시하면 Lynx `useCollapsible`로 열어 둔 내용이 높이 0에서 다시 펼쳐지던 문제를 수정합니다. `Accordion`, `CheckSelectBox`, `RadioSelectBox`에 적용됩니다.
- 4b1d559: `@lynx-js/react` peer dependency 하한을 `>=0.100.0`에서 `>=0.117.0`으로 올려 Lynx 패키지 전체와 맞춥니다.
- Updated dependencies [35d7ec1]
- Updated dependencies [4b1d559]
  - @seed-design/lynx-react-collapsible@1.0.1
  - @seed-design/lynx-react-use-controllable-state@1.0.1
  - @seed-design/lynx-react-use-press-tap@1.0.1

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 2d2f4df: SEED 스타일 없이 Accordion을 조합할 수 있는 `@seed-design/lynx-react-accordion`을 추가합니다.
  
  - `Accordion.Root`·`Accordion.Item`·`Accordion.Header`·`Accordion.Trigger`·`Accordion.Content`와 `useAccordion`·`useAccordionItem` 등 상태 hook을 제공합니다.
  - `values`·`defaultValues`·`onValuesChange`로 열린 항목을 관리하고, `multiple`로 여러 항목을 동시에 열 수 있습니다. Root 또는 Item의 `disabled`로 열림 전환을 막을 수 있습니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [362cada]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-collapsible@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
