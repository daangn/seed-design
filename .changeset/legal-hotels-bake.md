---
"@seed-design/react-collapsible": major
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": patch
---

Select Box 관련 컴포넌트를 업데이트합니다.

- `CheckSelectBoxGroup`, `RadioSelectBoxRoot`에 기본적으로 그리드 레이아웃이 적용됩니다.
  - 1.1 → 1.2 업그레이드 시 변경 필요: `CheckSelectBox`, `RadioSelectBoxItem`을 묶어서 사용하던 `<VStack asChild>`을 제거하고 `CheckSelectBoxGroup`, `RadioSelectBoxRoot`만 남겨야 합니다. `<CheckSelectBoxGroup asChild>` 또는 `<RadioSelectBoxRoot asChild>`로 사용하고 있는 경우 `VStack`을 제거하고 `asChild` prop을 제거합니다.
  - `CheckSelectBoxGroup`와 `RadioSelectBoxRoot`에 `columns`를 지정할 수 있습니다. `columns`가 `2` 이상인 경우 하위 항목에 기본적으로 `layout="vertical"`이 적용됩니다. 기본 `layout`은 하위 항목에서 오버라이드할 수 있습니다.
- 1.1 → 1.2 업그레이드 시 확인 필요: `CheckSelectBox`와 `RadioSelectBoxItem`의 `rootRef` 타입을 `Ref<HTMLLabelElement>`에서 `Ref<HTMLDivElement>`로 변경합니다.
  - Select Box 한 개의 전체 영역을 감싸는 것은 동일합니다. `footer`에 `button`이나 `input` 등 interactive element를 넣는 케이스에 대응하기 위해 상위 마크업을 추가하고 label을 내부로 이동했습니다.
- 1.1 → 1.2 업그레이드 시 변경 필요: `CheckSelectBox`, `RadioSelectBoxItem`에 기본적으로 적용되던 `Checkmark`와 `RadioMark`가 기본적으로 표시되지 않습니다. `suffix` prop을 통해 선택적으로 추가할 수 있습니다.
  - 단순 마이그레이션 시 `suffix={<CheckSelectBoxCheckmark />}`와 `suffix={<RadioSelectBoxRadioMark />}`를 추가합니다.
- `prefixIcon`, `footer`, `footerVisibility` prop 추가
  - `footer`에 넣는 요소는 기본적으로 해당 `CheckSelectBox` 또는 `RadioSelectBoxItem`가 선택된 상태일 때 표시됩니다. `footerVisibility="always"`를 설정하여 footer 요소를 항상 표시할 수 있습니다.
- `label`이 기본적으로 가로 나열되며 `$dimension.x2` gap을 갖는 flex container로 변경되었습니다.
  - 1.1 → 1.2 업그레이드 시 확인 권장: `label={<HStack gap="x2">{/* ... */}</HStack>}`와 같은 코드는 `HStack`을 `Fragment` 등으로 대체할 수 있습니다.
- `CheckSelectBox`와 `RadioSelectBoxItem`에 `children`을 전달할 수 없도록 제외합니다. 1.1에서도 `children`은 렌더링되지 않았습니다.
- `RadioSelectBoxRoot`의 `role`이 `radiogroup`에서 `group`으로 변경되었습니다.
