---
"@seed-design/react-collapsible": major
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": patch
---

[Select Box](/react/components/select-box) 관련 컴포넌트를 업데이트합니다.

- **1.1 → 1.2 업그레이드 시 snippet을 다시 내려받아 주세요.**
  - `npx @seed-design/cli@latest add ui:select-box`
- `CheckSelectBoxGroup`, `RadioSelectBoxRoot`의 children이 기본적으로 gap이 포함된 그리드 레이아웃으로 정렬됩니다.
  - **1.1 → 1.2 업그레이드 시 변경 필요**: `CheckSelectBox`, `RadioSelectBoxItem`을 묶어서 사용하던 `VStack`을 제거하여 `CheckSelectBox`와 `RadioSelectBoxItem`이 `CheckSelectBoxGroup` 또는 `RadioSelectBoxRoot`의 direct child가 되도록 변경하세요. `VStack`에 `gap` 이외의 스타일이 적용된 경우 `<VStack paddingX="x4"><CheckSelectBoxGroup>...</CheckSelectBoxGroup></VStack>`와 같이 `VStack`을 외부에 남겨두세요.
  - **기능 추가**: `CheckSelectBoxGroup`와 `RadioSelectBoxRoot`에 `columns`를 지정할 수 있습니다. `columns`가 `2` 이상인 경우 하위 항목에 기본적으로 `layout="vertical"`이 적용됩니다. 기본 `layout`은 하위 항목에서 오버라이드할 수 있습니다.
  - **기능 추가**: `CheckSelectBoxGroup`과 `RadioSelectBoxRoot`에 `label`, `description`, `errorMessage`, `indicator` 등 Fieldset 관련 prop을 사용할 수 있습니다.
- **1.1 → 1.2 업그레이드 시 변경 필요**: `CheckSelectBox`, `RadioSelectBoxItem`에 기본적으로 표시되던 `Checkmark`와 `RadioMark`가 이제 표시되지 않습니다. `suffix` prop을 통해 선택적으로 추가할 수 있습니다.
  - 단순 마이그레이션 시 `suffix={<CheckSelectBoxCheckmark />}`와 `suffix={<RadioSelectBoxRadioMark />}`를 추가하세요.
- **기능 추가**: `prefixIcon`, `footer`, `footerVisibility` prop 추가
  - `footer`에 넣는 요소는 기본적으로 해당 `CheckSelectBox` 또는 `RadioSelectBoxItem`가 선택된 상태일 때 표시됩니다. `footerVisibility="always"`를 설정하여 footer 요소를 항상 표시할 수 있습니다.
- `label`이 기본적으로 가로 나열되며 `$dimension.x2` gap을 갖는 flex container로 변경되었습니다.
  - **1.1 → 1.2 업그레이드 시 확인 권장**: `label={<HStack gap="x2">{/* ... */}</HStack>}`와 같은 코드는 `HStack`을 `Fragment` 등으로 대체할 수 있습니다.
- **문제 수정**: `CheckSelectBox`와 `RadioSelectBoxItem`에서 사용되지 않는 `children`을 타입 정의에서 제거합니다.
- `CheckSelectBoxGroup`에 `label`, `aria-label`, `aria-labelledby` 중 아무것도 설정하지 않은 경우 경고를 표시합니다. (`RadioSelectBoxRoot`는 기존에도 표시)
