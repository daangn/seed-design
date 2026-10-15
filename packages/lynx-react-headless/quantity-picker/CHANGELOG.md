# @seed-design/lynx-react-quantity-picker

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 248941e: iOS·Android 네이티브 접근성 트리에 컨트롤의 이름과 항목이 빠지지 않게 합니다.
  
  - ActionButton, Chip, Checkbox, Switch, Accordion Trigger, List 행, RadioGroup·SelectBox 항목, Tabs·ChipTabs·SegmentedControl 항목이 텍스트 children으로 `accessibility-label`을 채웁니다. children에 `<text>` 같은 native 요소만 있으면 이름을 알 수 없으므로 `accessibility-label`을 직접 지정하세요(개발 환경에서 경고합니다).
  - Menu·HelpBubble·Dialog·AlertDialog·MenuSheet Trigger가 접근성 요소로서 이름을 갖고, 안에 둔 ActionButton·Chip은 별도 요소로 노출하지 않습니다. Dialog·AlertDialog Trigger는 `accessibility-label`을 받습니다.
  - RadioGroup·SelectBox·QuantityPicker·Chip.RadioRoot·Checkbox.Group·List Root가 기본적으로 접근성 요소가 아니어서 안쪽 항목이 가려지지 않습니다. QuantityPicker의 이름과 현재 수량은 ValueDisplay가 노출합니다.
  - 접근성 요소 root에 `flatten={false}`를 기본으로 두어 Android에서 노드가 사라지지 않게 합니다.
  - 컨트롤 안의 label 텍스트는 같은 이름이 두 번 읽히지 않도록 접근성 트리에서 숨깁니다.
- 77eaa1e: SEED 스타일 없이 수량 선택기를 조합할 수 있는 `@seed-design/lynx-react-quantity-picker`를 추가합니다.
  
  - `QuantityPicker.Root`·`DecrementButton`·`ValueDisplay`·`IncrementButton`으로 수량 감소·표시·증가 영역을 조합합니다.
  - 필수 `min`·`max`와 `step`·`value`·`defaultValue`·`onValueChange`로 수량을 관리합니다.
  - `removable`에 `onRemove`·`removeAccessibilityLabel`을 함께 전달하면 최솟값에서 감소 버튼이 삭제 버튼으로 바뀝니다.
  - `loading`·`readOnly`·`disabled`로 조작을 차단할 수 있습니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
