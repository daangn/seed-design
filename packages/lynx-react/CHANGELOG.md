# @seed-design/lynx-react

## 1.0.1

### Patch Changes

- f5092ee: BottomSheet의 높이가 바뀔 때 배경이 깜빡이던 문제를 수정합니다. 리사이즈 중 닫거나 드래그해도 현재 배경 농도에서 자연스럽게 이어집니다.
- Updated dependencies [bf95a13]
- Updated dependencies [7540d3c]
- Updated dependencies [4879cff]
  - @seed-design/lynx-css@1.0.1
  - @seed-design/lynx-react-bottom-sheet@1.0.1

## 1.0.0

### Major Changes

- 524ad2f: (BREAKING CHANGE: `ProgressCircle.Root`와 `ProgressCircle.Range`를 직접 조합한다면 그 사이에 `<ProgressCircle.Track />`을 추가해야 트랙이 보입니다. `seed-progress-circle__root--tone_*` CSS 선택자는 `seed-progress-circle__track--tone_*`로 옮겨야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:progress-circle`과 `npx @seed-design/cli@latest add ui:quantity-picker`로 다시 설치해야 합니다.)
  
  `ProgressCircle`의 배경 트랙을 React와 같이 별도 `ProgressCircle.Track` 파트로 그립니다.
  
  - 이전에는 `Root`가 tone에 맞는 배경색으로 트랙을 직접 그렸습니다. 이제 `Root`는 트랙을 그리지 않고, `Track`이 진행률과 관계없이 전체 링을 tone의 트랙 색으로 그립니다.
  - tone별 트랙 색은 `Track` 요소에 적용되므로 tone class가 `seed-progress-circle__root--tone_*`에서 `seed-progress-circle__track--tone_*`로 바뀝니다.
  - `Track`에 `className`·`style`을 지정해 트랙만 따로 꾸밀 수 있습니다.
- 524ad2f: (BREAKING CHANGE: `Chip.Toggle`의 이전 역할을 유지하려면 `accessibility-role-description="toggle"`을 직접 지정해야 합니다.)
  
  `Chip.Toggle`과 `Chip.RadioRoot`의 기본 접근성 역할을 변경합니다.
  
  - `Chip.Toggle`의 기본 `accessibility-role-description`을 `"toggle"`에서 `"checkbox"`로 변경합니다.
  - 이전에는 별도 접근성 기본값이 없던 `Chip.RadioRoot`에 `"radiogroup"` 역할을 전달하며, `disabled`이면 기본 `accessibility-traits`는 `"disabled"`입니다. `Chip.RadioRoot`는 접근성 요소가 아니므로 각 `Chip.RadioItem`이 따로 노출됩니다.
- 524ad2f: (BREAKING CHANGE: `Chip.Toggle`의 변경된 선택값을 사용하는 `bindtap` 작업은 `onCheckedChange(next)`로, `Chip.RadioItem`의 작업은 상위 `Chip.RadioRoot`의 `onValueChange(next)`로 옮겨야 합니다.)
  
  `Chip.Toggle`·`Chip.RadioItem`의 callback 호출 순서를 변경합니다.
  
  - 이전에는 선택 상태를 바꾼 뒤 `bindtap`을 호출했지만, 이제 `bindtap`을 먼저 호출한 뒤 선택 상태를 바꾸고 `onCheckedChange`·`onValueChange`로 새 값을 전달합니다.
- 524ad2f: (BREAKING CHANGE: `List` 선택 행의 이전 접근성 안내가 필요하면 `accessibility-value`와 `accessibility-traits`를 직접 지정해야 합니다.)
  
  `List.CheckboxItem`·`List.RadioItem`·`List.SwitchItem`을 각각 하나의 접근성 요소로 안내하도록 기본값을 변경합니다.
  
  - Checkbox의 기본 `accessibility-value`는 `"선택됨"`·`"선택 안 됨"` 대신 `"checked"`·`"not checked"`이며, `indeterminate`이면 `"mixed"`입니다.
  - Radio의 기본 `accessibility-value`는 `"선택됨"`·`"선택 안 됨"` 대신 `"selected"`·`"not selected"`입니다.
  - Switch의 기본 `accessibility-value`는 `"켜짐"`·`"꺼짐"` 대신 `"checked"`·`"not checked"`입니다.
  - 활성 상태의 기본 `accessibility-traits="button"`을 제거합니다.
- 20d639c: (BREAKING CHANGE: `MenuSheet.List`나 `.seed-menu-sheet__list`로 그룹 배치(flex·gap)를 바꾸고 있었다면 `.seed-menu-sheet__listContent`를 덮어쓰거나 그룹을 직접 감싼 view로 옮겨야 합니다. `AlertDialog.Content`의 `className`·`style`로 자식 배치를 바꾸고 있었다면 자식을 직접 감싼 view로 옮겨야 합니다. `BottomSheet.Body` 안에 `scroll-view`를 두어 긴 내용을 스크롤하고 있었다면 그 `scroll-view`를 빼고 내용을 `Body`에 바로 넣고, 높이 제한은 `Body`의 `maxHeight`로 옮기고, `Body`에 준 `flex: "none"`은 지워야 합니다. `Body`의 `className`·`style`로 자식 배치를 바꾸고 있었다면 `.seed-bottom-sheet__scrollContent`를 덮어쓰거나 자식을 직접 감싼 view로 옮겨야 하고, `Body` 안의 `ScrollFog`에 `height: "100%"`를 주고 있었다면 고정 높이로 바꿔야 합니다.) 화면 끝을 기준으로 위치를 잡는 Lynx 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop은 그대로 화면 전체를 덮습니다.
  
  - `Dialog`·`AlertDialog`·`BottomSheet`·`MenuSheet`는 좌우 inset을 뺀 영역의 가운데에 놓입니다. `Dialog`의 기본 너비(90%)는 그 영역을 기준으로 계산합니다.
  - `Dialog`·`AlertDialog`는 위아래 inset도 피합니다. `Dialog`의 최대 높이는 화면 높이의 80%와 위아래 inset 사이 높이 중 작은 쪽입니다.
  - `AlertDialog.Content`는 자식을 세로 `scroll-view` 안에 렌더해서, 내용이 최대 높이를 넘으면 안에서 스크롤합니다. `Content`에 준 `className`·`style`은 이 `scroll-view`를 감싼 바깥 view에 적용됩니다.
  - 내용에 맞춰 높이가 정해지는 `BottomSheet`·`MenuSheet`는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 제한에 닿으면 `BottomSheet.Body`가 스크롤됩니다.
  - `BottomSheet.Body`는 자식을 세로 `scroll-view` 안에 렌더해서, 내용이 넘치면 `Body`만 스크롤합니다. `Body`에 준 `className`·`style`은 이 `scroll-view`를 감싼 바깥 view에 적용되고, 자식 배치는 새 `scrollContent` 슬롯이 맡습니다. `Body`가 스크롤된 상태에서 시작한 제스처는 `Body`만 움직이고, `Body`가 맨 위일 때 아래로 끌어야 시트가 움직입니다.
  - `MenuSheet.List`는 `scroll-view`로 렌더해서, 항목이 넘치면 목록만 스크롤하고 헤더와 닫기 버튼은 줄이지 않습니다. `List`의 `className`·`style`·`ref`는 이 `scroll-view`에 적용되고, 그룹 배치는 새 `listContent` 슬롯이 맡습니다. 목록이 스크롤된 상태에서 시작한 제스처는 목록만 움직이고, 목록이 맨 위일 때 아래로 끌어야 시트가 움직입니다.
- 524ad2f: (BREAKING CHANGE: `RadioGroup.Root`의 `value`·`defaultValue`·`onValueChange`·`disabled`를 바깥 `RadioGroupField.Root`로, `weight`·`size`·`tone`을 `RadioGroup.Item`으로 옮기고 `pressed`를 제거해야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:radio-group`와 `npx @seed-design/cli@latest add ui:select-box`로 다시 설치해야 합니다.)
  
  `RadioGroup.Root`가 함께 맡던 선택 상태, 항목 스타일, 배치를 분리합니다.
  
  - 이제 `RadioGroup.Root`는 항목 배치만 맡고, `RadioGroupField.Root`가 선택값과 `disabled` 상태를 제공합니다.
  - `weight`·`size`·`tone`은 Root에서 모든 항목에 적용하는 대신 `RadioGroup.Item`마다 지정합니다.
  - 외부에서 눌림 상태를 지정하던 `pressed` prop을 제거하고, 각 Item의 실제 눌림에 따라 효과를 표시합니다.
  - Field 표현이 필요 없다면 `@seed-design/lynx-react-radio-group`의 `RadioGroup.Root`로 선택 상태를 관리할 수 있습니다.
- 524ad2f: (BREAKING CHANGE: `ReactionButton`의 이전 접근성 안내가 필요하면 `accessibility-role-description`·`accessibility-value`·`accessibility-traits`를 직접 지정해야 합니다.)
  
  `ReactionButton`의 선택 상태를 `accessibility-traits="selected"` 대신 `accessibility-role-description="toggle button"`과 `accessibility-value="pressed"`·`"not pressed"`로 안내합니다.
  
  - `disabled` 또는 `loading`이면 기본 `accessibility-traits`는 `"disabled"`이며, 직접 지정한 값은 그대로 사용합니다.
- 4f1c681: (BREAKING CHANGE: `BottomSheet.Root`와 `MenuSheet.Root` ref의 `open()`·`close()` 호출에 의존하던 callback 작업은 앱 코드에서 직접 실행해야 합니다. 제어 상태에서는 ref 호출 대신 `open` 값을 갱신해야 합니다.)
  
  `BottomSheet.Root`와 `MenuSheet.Root`의 `onOpenChange`를 사용자 동작에 따른 열림 변경 요청으로 구분합니다.
  
  - 이전에는 열림 값만 전달했지만, 이제 두 번째 인자의 `details.reason`으로 `trigger`·`closeButton`·`interactOutside`·`drag` 사유도 전달합니다.
  - 이전에는 ref 호출로 열림 상태를 바꾸면 callback이 실행됐지만, 이제 ref 호출과 `open` prop 변경은 `onOpenChange`를 호출하지 않습니다.
  - 제어 상태에서는 사용자 동작이 callback으로 변경을 요청하고, 부모가 `open`을 갱신해야 시트 상태가 바뀝니다. 사유를 사용하지 않는 한 인자 callback은 그대로 사용할 수 있습니다.
- 524ad2f: (BREAKING CHANGE: `CheckSelectBox`의 이전 접근성 안내가 필요하면 `accessibility-value`를 직접 지정해야 합니다.)
  
  `CheckSelectBox.Root`의 기본 `accessibility-value`를 `"selected"`·`"not selected"`에서 `"checked"`·`"not checked"`로 변경하고, `indeterminate` 상태는 `"mixed"`로 안내합니다.
- 524ad2f: (BREAKING CHANGE: `SelectBoxGroupProps`를 `CheckSelectBox.GroupProps` 또는 `RadioSelectBox.GroupProps`로, `SelectBoxFooterProps`를 `CheckSelectBox.FooterProps` 또는 `RadioSelectBox.FooterProps`로 변경해야 합니다.)
  
  이전에 공통으로 제공하던 `SelectBoxGroupProps`·`SelectBoxFooterProps` export를 제거하고, `CheckSelectBox`·`RadioSelectBox`별 `GroupProps`·`FooterProps`를 제공합니다.
- 524ad2f: (BREAKING CHANGE: `formatValue`에서 읽는 `SelectSelectedItem.prefixIcon`을 `SelectSelectedItem.icon`으로 변경해야 합니다.)
  
  `formatValue`에 전달하는 `SelectSelectedItem`의 선택 항목 아이콘 필드를 `prefixIcon`에서 `icon`으로 변경합니다.
  
  - `Select.Item`에 전달하는 `prefixIcon` prop은 그대로 사용합니다.
- 524ad2f: (BREAKING CHANGE: `Slider.Thumb`·`Slider.ValueIndicatorRoot`·`Slider.ValueIndicatorLabel`의 `index={n}`을 `thumbIndex={n}`으로 변경해야 합니다. 생략한 곳에는 `thumbIndex={0}`을 지정하고, Registry `ui:slider`는 `npx @seed-design/cli@latest add ui:slider`로 다시 설치해야 합니다.)
  
  `Slider.Thumb`·`Slider.ValueIndicatorRoot`·`Slider.ValueIndicatorLabel`이 참조할 thumb를 지정하는 prop을 선택적 `index`에서 필수 `thumbIndex`로 변경합니다.
  
  - 이전에는 `index`를 생략하면 첫 thumb를 사용했지만, 이제 각 파트에 `thumbIndex`를 직접 지정해야 해당 thumb의 위치와 값을 표시합니다.
- 6faa8c1: (BREAKING CHANGE: `HelpBubble.Arrow` 없이 조합한 말풍선의 기존 간격을 유지하려면 `HelpBubble.Root`에 `gutter={oldGutter + 8}`을 지정해야 합니다.)
  
  `HelpBubble`의 기준 요소와의 간격에 화살표 길이 8px을 더하는 조건을 변경합니다.
  
  - 이전에는 `HelpBubble.Arrow`가 없어도 8px을 더했지만, 이제 화살표를 렌더링할 때만 더합니다.
  - 항상 화살표를 렌더링하는 Registry `ui:help-bubble`의 간격은 그대로 유지합니다.
- 6faa8c1: (BREAKING CHANGE: `HelpBubble`이 첫 바깥 탭을 차단하는 동작에 의존했다면 바깥 요소의 탭 handler에서 말풍선을 닫는 탭에 해당 요소의 동작을 실행하지 않도록 처리해야 합니다.)
  
  `HelpBubble`의 `closeOnInteractOutside`가 바깥 탭을 가로채지 않고 말풍선만 닫도록 변경합니다.
  
  - 이전에는 바깥 탭으로 말풍선을 닫을 때 탭한 요소의 동작은 실행되지 않았습니다. 이제 같은 탭이 바깥 요소에도 전달되므로, 버튼이나 링크를 탭하면 말풍선이 닫히면서 해당 요소의 동작도 실행됩니다.
- e1a260b: (BREAKING CHANGE: `Dialog`와 `AlertDialog`의 `dialogContentProps`·`dialogBackdropProps`에서 `bindanimationstart`·`bindanimationend`·`bindanimationcancel`·`bindtransitionstart`·`bindtransitionend`를 제거하고, `dialogBackdropProps.bindtap`은 `Backdrop`의 `onClick`으로 옮겨야 합니다. `dialogContentProps.bindtap`이 실행되면 안 되는 사용처에서는 해당 callback을 제거해야 합니다.)
  
  `Dialog`·`AlertDialog`의 Content 탭 callback과 `AlertDialog.Content`에 직접 전달한 접근성 속성을 실제 요소에 적용하도록 변경합니다.
  
  - 이전에는 `dialogContentProps.bindtap` 같은 callback이 Content에서 실행되지 않았습니다. 이제 열림·닫힘 처리용으로 예약된 callback을 제외한 native prop과 callback을 전달합니다.
  - `dialogContentProps`·`dialogBackdropProps`의 animation·transition callback과 Backdrop의 nested `bindtap`은 기존처럼 Dialog의 열림·닫힘 처리를 위해 예약하며, 공개 타입에서도 제외합니다.
  - Backdrop의 탭 callback은 `onClick`으로 지정합니다. 이 callback은 `clickToClose`로 실제로 닫히는 탭에서만 호출됩니다.
  - 이전에는 적용되지 않던 `AlertDialog.Content`의 직접 전달한 접근성 속성도 Content에 적용합니다. 같은 속성을 `dialogContentProps`에도 지정하면 nested 값이 우선합니다.
- d4a20aa: (BREAKING CHANGE: `InputButton.*`와 `InputButtonRoot`·`InputButtonRootProps` 등 `InputButton*` export를 `FieldButton*`으로 변경해야 합니다. 직접 사용한 `input-button` Recipe와 `seed-input-button__*` class도 `field-button` 이름으로 변경해야 합니다. Registry `ui:field-button`은 `npx @seed-design/cli@latest add ui:field-button`으로 다시 설치하고 `inputButtonRef`를 `controlRef`로 변경해야 합니다.)
  
  Lynx 선택값 필드의 이름을 `InputButton`에서 `FieldButton`으로 변경하며, 기존 스타일 값은 유지합니다.
  
  - 컴포넌트와 Props 타입의 `InputButton*` export를 제거하고 `FieldButton*` export를 제공합니다.
  - Recipe 경로는 `@seed-design/lynx-css/recipes/input-button`에서 `@seed-design/lynx-css/recipes/field-button`으로 바뀝니다.
  - Recipe의 `inputButton`·`inputButtonVariantMap`·`inputButtonVariantKeys`와 `InputButtonVariantProps`·`InputButtonSlotName`도 각각 `fieldButton*`·`FieldButton*` 이름으로 바뀌며, class는 `seed-field-button__*`로 생성됩니다.
  - Registry wrapper가 버튼 ref를 받는 prop은 `inputButtonRef`에서 `controlRef`로 바뀝니다.
- 257c335: (BREAKING CHANGE: Lynx `ActionButton`의 `icon`·`prefixIcon`·`suffixIcon` prop을 각각 children의 `<Icon icon={...} />`·`<PrefixIcon icon={...} />`·`<SuffixIcon icon={...} />`로 바꿔야 합니다.)
  
  `ActionButton`의 아이콘 전달 방식을 React와 같이 children slot으로 통일합니다.
  
  - 이전에는 `icon`·`prefixIcon`·`suffixIcon` prop으로 전달한 아이콘도 렌더링했습니다. 이제 이 prop을 제거하고 children에 배치한 `Icon`·`PrefixIcon`·`SuffixIcon`을 렌더링합니다.
- a5af36f: (BREAKING CHANGE: `List.CheckboxItem`의 `size`·`variant`·`tone`을 `Checkbox.Control`로, `List.SwitchItem`의 `size`·`tone`을 `Switch.Control`로 옮기고 행의 `pressed`를 제거해야 합니다. `List.CheckboxItem`의 `weight`는 제거하고, 글자 굵기가 필요하면 label의 `Text`에 직접 지정해야 합니다. `listItem` Recipe를 직접 조합한다면 `interactionRoot` wrapper를 제거하고 실제 행의 `root`에 handler와 ref를 연결해야 합니다.)
  
  `List` 선택 행에서 선택 상태와 mark 모양을 분리하고, 행 자체를 조작하는 요소로 사용합니다.
  
  - 이전에는 `CheckboxItem`·`SwitchItem`의 prop으로 mark 모양을 지정했습니다. 이제 행은 선택 상태를 관리하고, `Checkbox.Control`·`Switch.Control`이 각각 `size`·`tone`과 Checkbox의 `variant`를 받습니다.
  - `CheckboxItem`이 받던 `weight`를 제거하며, label의 글자 굵기는 `Text`에서 지정합니다.
  - 눌림 상태는 실제 터치에 따라 바뀌므로 행에 `pressed`를 직접 지정하지 않습니다.
  - 선택 행 바깥의 `interactionRoot`를 제거하고, handler와 ref를 행의 `root`에 연결합니다. `seed-list-item__interactionRoot` class는 더 이상 생성되지 않습니다.
- bb2513e: (BREAKING CHANGE: `Menu.Content`를 `Menu.Positioner > Menu.Content > Menu.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Menu.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. `menu` Recipe의 `backdrop` 대신 `positioner`를 바깥 탭 영역에 사용해야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:menu`로 재설치해야 합니다.)
  
  `Menu.Content`가 만들던 레이어와 스크롤 영역을 `Menu.Positioner`·`Menu.ScrollArea`로 분리합니다.
  
  - 이전에는 `Content`만으로 native overlay와 스크롤 영역을 만들었습니다. 이제 `Positioner`가 레이어를, `Content`가 메뉴 표면을, `ScrollArea`가 목록의 스크롤 영역을 만듭니다.
  - 기본 레이어는 native overlay에서 Lynx view 안의 고정 레이어로 바뀝니다. `container`를 지정하면 기존처럼 host 전체를 덮는 native overlay를 사용합니다.
  - `container`가 없는 기본 레이어에서는 Android 뒤로 가기로 메뉴가 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다.
  - 바깥 탭은 `Positioner`가 처리하므로 `menu` Recipe의 `backdrop` slot을 제거합니다. 최신 Registry snippet은 새 파트 구조를 조합합니다.
- b1a262d: (BREAKING CHANGE: `Accordion.Trigger`의 `accessibility-value`를 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 변경하고, `accessibility-traits` 사용을 제거해야 합니다. `accessibility-traits`를 직접 덮어쓰는 대체 API는 제공하지 않습니다.)
  
  Lynx 컴포넌트가 일부만 받던 native 속성을 각 파트가 렌더링하는 요소의 속성으로 확장하며, 상태를 알리는 일부 접근성 값은 컴포넌트 상태를 따르도록 변경합니다.
  
  - 각 파트의 native 요소에 맞는 `id`·`accessibility-*`·`bind*`·`main-thread:*`·`data-*`와 `ref`를 전달할 수 있습니다. `BottomSheet`·`MenuSheet`의 파트와 `AttachmentInput.Root`도 지원하며, `Box`의 터치 handler는 이벤트 인자를 받습니다.
  - 일반 속성은 사용자 값이 기본값보다 우선합니다. `className`은 합치고 `style`은 key 단위로 합치며, 이벤트 handler와 `ref`는 내부 값과 함께 실행합니다.
  - 이전에는 `Accordion.Trigger`의 `accessibility-value`·`accessibility-traits`를 직접 덮어쓸 수 있었습니다. 이제 열림·비활성 상태에 맞는 값을 유지하고, 열림 상태 문구만 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 지정합니다.
  - 비활성 또는 로딩 중 탭을 차단하는 컴포넌트의 `bindtap`·`main-thread:bindtap`은 기존처럼 호출하지 않습니다. `QuantityPicker.DecrementButton`의 삭제 상태 문구도 기존처럼 `Root.removeAccessibilityLabel`로 지정합니다.
- f67beff: (BREAKING CHANGE: `PrefixIcon`·`SuffixIcon`·`Chip.PrefixIcon`·`Chip.SuffixIcon`의 `size`·`color`를 제거해야 합니다. 의도적으로 크기나 색상을 덮어쓰려면 `style`을 사용하고, 독립 아이콘은 `Icon`의 `size`·`color`를 사용해야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:attachment-field`와 `npx @seed-design/cli@latest add ui:attachment-display-field`로 다시 설치해야 합니다.)
  
  Prefix·Suffix 아이콘에서 개별 크기와 색상을 지정하던 `size`·`color` prop을 제거하고, 아이콘을 감싼 컴포넌트의 recipe 스타일을 따르도록 변경합니다.
- 8653a08: (BREAKING CHANGE: `ReactionButton`의 변경된 선택값을 사용하는 `bindtap` 작업은 `onPressedChange(next)`로 옮겨야 합니다.)
  
  `ReactionButton`의 탭 처리 순서를 선택값 변경 후 `bindtap` 호출에서 `bindtap` 호출 후 선택값 변경으로 바꿉니다.
  
  - `bindtap`을 `onPressedChange`보다 먼저 호출하므로, 변경된 선택값은 `onPressedChange(next)`에서 받습니다.
  - `disabled` 또는 `loading`이면 `bindtap`과 `onPressedChange` 모두 호출하지 않습니다.
  - 선택 상태를 `selected` trait로 알리던 기본 접근성을 toggle button의 `"pressed"`·`"not pressed"` 안내로 변경합니다.
- 46ecb70: (BREAKING CHANGE: `ScrollFog` 안의 콘텐츠를 직접 `<scroll-view scroll-orientation="vertical">` 또는 `<scroll-view scroll-orientation="horizontal">`로 감싸야 합니다. 자식이 이미 스크롤을 처리하면 추가로 감싸지 않습니다. `hideScrollBar` 대신 자식 `<scroll-view>`에 `scroll-bar-enable={false}`를 지정하고, `placement`에는 세로 또는 가로 한 축의 방향만 지정해야 합니다. `@seed-design/lynx-css/recipes/scroll-fog`를 직접 사용한다면 제거된 `verticalScroll`·`horizontalScroll` slot에 의존하는 코드를 삭제해야 합니다.)
  
  `ScrollFog`를 스크롤 영역과 가장자리 mask를 함께 제공하던 컴포넌트에서 mask만 제공하는 컴포넌트로 변경합니다.
  
  - 내부 `<scroll-view>`와 `hideScrollBar` prop을 제거합니다. 스크롤 ref·이벤트·스크롤바는 자식 스크롤 영역에서 제어합니다.
  - `placement`는 세로 또는 가로 한 축만 지원합니다.
  - `scroll-fog` Recipe의 `verticalScroll`·`horizontalScroll` slot을 제거합니다.
- e5ebfb1: (BREAKING CHANGE: `Select.Content`를 `Select.Positioner > Select.Content > Select.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Select.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. `select` Recipe의 `backdrop` slot을 직접 사용했다면 바깥 탭 영역을 `Select.Positioner`로 옮겨야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:select`로 재설치해야 합니다.)
  
  `Select`의 선택 목록을 기본 native overlay에서 Lynx view 안의 고정 레이어로 변경하고, 레이어와 스크롤 영역을 별도 파트로 분리합니다.
  
  - 이전에는 `Content`가 레이어와 스크롤 영역을 함께 제공했습니다. 이제 `Positioner`가 레이어와 바깥 탭 영역을, `ScrollArea`가 스크롤 영역을 담당합니다.
  - `container`를 지정하지 않으면 Android 뒤로 가기로 목록이 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다. native container를 지정하면 기존 동작을 사용할 수 있습니다.
  - `select` Recipe의 `backdrop` slot을 제거합니다.
- 8cdcd8b: (BREAKING CHANGE: `wrap`을 사용하는 `HStack`·`VStack`의 줄 사이 간격을 확인해야 합니다. 기존 간격을 유지하려면 `HStack`에 `style={{ rowGap: "0px" }}`, `VStack`에 `style={{ columnGap: "0px" }}`을 지정해야 합니다.)
  
  `HStack`과 `VStack`의 `gap`을 한 축에서 가로·세로 두 축에 적용하도록 변경합니다.
  
  - 이전에는 `HStack`의 열 간격과 `VStack`의 행 간격에만 적용했습니다. 이제 줄바꿈된 `HStack`의 행 사이와 `VStack`의 열 사이에도 간격이 생깁니다.
  - `style`의 `rowGap`·`columnGap`은 해당 축에서 `gap`보다 우선합니다.
- ee36625: (BREAKING CHANGE: indeterminate Checkbox에서 이전 접근성 안내를 유지하려면 `accessibility-value`를 직접 지정해야 합니다.)
  
  `Checkbox.Root`의 `indeterminate` 상태를 기본 접근성 값 `"mixed"`로 안내합니다.
  
  - 이전에는 `indeterminate`여도 `checked`에 따라 `"checked"` 또는 `"not checked"`를 전달했습니다. 이제 `checked` 값과 관계없이 `"mixed"`를 전달합니다.
  - 직접 지정한 `accessibility-value`는 기본값보다 우선합니다.
- 4f1c681: (BREAKING CHANGE: `SwipeableMenuSheet`를 `MenuSheet`로, `SwipeableMenuSheetCloseReason`을 `MenuSheetOpenChangeReason`으로 바꾸고 모든 `SwipeableMenuSheet*` 타입과 part를 `MenuSheet*`로 바꿔야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:menu-sheet`로 새 snippet을 설치하고 `ui:swipeable-menu-sheet` 호출부와 파일을 제거해야 합니다.)
  
  메뉴 시트의 공개 이름을 `SwipeableMenuSheet*`에서 `MenuSheet*`로 변경합니다.
  
  - 이전 컴포넌트·part·Props 타입 이름은 더 이상 export하지 않으며, 닫힘 사유 타입 `SwipeableMenuSheetCloseReason`은 `MenuSheetOpenChangeReason`으로 바뀝니다.
  - Registry snippet도 `ui:swipeable-menu-sheet`에서 `ui:menu-sheet`으로 바뀝니다. CSS Recipe 이름 `menuSheet`과 `seed-menu-sheet-*` class는 그대로입니다.
- 524ad2f: (BREAKING CHANGE: 스크린 리더가 읽어야 하는 `Icon`·`PrefixIcon`·`SuffixIcon`·`TextField.PrefixIcon`·`TextField.SuffixIcon`·`AttachmentInput.TriggerIcon`에는 `accessibility-elements-hidden={false}`를 지정해야 합니다.)
  
  장식용 아이콘을 기본적으로 접근성 트리에서 숨깁니다.
  
  - 이전에는 위 아이콘에 숨김 기본값이 없어 접근성 트리에 포함될 수 있었습니다. 이제 `accessibility-elements-hidden`의 기본값이 `true`이므로 스크린 리더가 별도로 읽지 않습니다.
  - 아이콘의 의미를 감싼 컴포넌트에서 안내한다면 해당 컴포넌트의 `accessibility-label`로 설명합니다.
- c704e06: (BREAKING CHANGE: `<KeyboardAvoidingScrollView>`를 `<KeyboardAvoidingScrollView.Root>`와 그 안의 `<KeyboardAvoidingScrollView.Content>`로 변경해야 합니다. `KeyboardAvoidingScrollViewProps`는 `KeyboardAvoidingScrollViewRootProps`·`KeyboardAvoidingScrollViewContentProps`로 변경해야 합니다. `keyboardGap`·`scrollBehavior`와 바깥 높이는 `Root`에, 안쪽 여백·스크롤 ref·`<scroll-view>` 속성과 이벤트는 `Content`에 전달해야 합니다.)
  
  하나의 컴포넌트가 키보드 회피와 스크롤을 함께 처리하던 구조를 바깥 레이아웃인 `Root`와 스크롤 영역인 `Content`로 나눕니다.
  
  - `Root`는 키보드에 맞춰 영역을 배치하고, `Content`가 실제 스크롤과 입력 위치 이동을 담당합니다.
  - 새 `KeyboardAvoidingScrollView.Footer`에는 스크롤 내용과 별도로 키보드 위에 고정할 하단 버튼을 배치할 수 있습니다.
- 524ad2f: (BREAKING CHANGE: 설치한 항목만 남겨 `npx @seed-design/cli@latest add ui:switch ui:select-box ui:attachment-field-reorderable ui:attachment-display-field-reorderable ui:callout ui:page-banner ui:dialog ui:alert-dialog ui:list ui:text-field --on-diff backup`으로 Registry 컴포넌트를 다시 설치해야 합니다. `Switchmark`의 상태 prop을 `Switch.Root`로 옮기고, 로컬 `attachment-sortable` helper를 `@seed-design/lynx-react-sortable`로 변경하며, Registry `TextField`의 `nativeInsertionMaxLength` 지정을 제거해야 합니다. `RadioSelectBoxRoot`의 `className`·`style`로 grid를 꾸몄다면 안쪽 grid 스타일을 다시 적용해야 합니다.)
  
  패키지 업그레이드만으로는 갱신되지 않는 Registry 컴포넌트를 SEED Lynx 1의 API와 접근성 동작에 맞춰 변경합니다.
  
  - `Switchmark`는 상태를 가진 독립 Root에서 `Switch.Root` 안의 `Control`·`Thumb` 조합으로 바뀝니다. `RadioSelectBoxRoot`는 Field와 안쪽 grid를 분리하며, `className`·`style`은 이제 grid가 아니라 바깥 Field에 적용합니다.
  - 재정렬 첨부 컴포넌트는 로컬 `HorizontalReorderList`·`HorizontalReorderItem` 대신 `Sortable.Root`·`Sortable.Item`을 사용하고, 화면 읽기 프로그램에 이동·삭제·재시도 action을 제공합니다.
  - `ActionableCallout`·`ActionablePageBanner`는 이전과 달리 handler가 없어도 button 접근성과 눌림 효과를 제공합니다. `DialogAction`·`AlertDialogAction`은 `disabled`·`loading`일 때 닫힘을 요청하지 않으며, `ListDivider`는 직접 지정한 `accessibility-element` 값을 더 이상 덮어쓰지 않습니다.
  - Registry `TextField`는 내부에서 관리하는 `nativeInsertionMaxLength`를 공개 prop에서 제외합니다.
- 524ad2f: (BREAKING CHANGE: thumb·tick·marker의 위치를 직접 지정했다면 `--slider-thumb-offset`·`--slider-tick-offset`·`--slider-marker-offset`을 각각 `--slider-thumb-offset-ratio`·`--slider-tick-offset-ratio`·`--slider-marker-offset-ratio`로 변경하고, 픽셀 값 대신 thumb 크기에 곱할 비율을 사용해야 합니다. `--slider-marker-color`는 marker의 `color` 스타일로 변경해야 합니다. Track을 Root보다 좁게 배치했다면 Root와 Track의 가로 범위를 맞추거나 변경된 드래그 범위를 확인해야 합니다.)
  
  슬라이더의 위치 보정을 측정한 픽셀 값에서 thumb 크기에 곱하는 비율로 바꿔, 첫 표시 뒤 thumb 위치가 움직이던 문제를 해결합니다.
  
  - thumb·tick·marker는 각각 `--slider-*-offset-ratio`를 제공합니다. 직접 작성한 스타일에서는 `left: calc(var(--slider-thumb-left) + <thumb 크기> * var(--slider-thumb-offset-ratio))`처럼 크기와 비율을 곱합니다. Value Indicator의 픽셀 위치 보정 변수는 유지합니다.
  - marker 색은 더 이상 `--slider-marker-color`를 읽지 않고 Recipe의 상태별 색을 사용합니다.
  - 드래그 좌표는 이전의 `Slider.Track` 대신 `Slider.Root`의 가로 범위를 기준으로 계산합니다.
- 524ad2f: (BREAKING CHANGE: `AttachmentDisplay.Root`·`useAttachmentDisplay`의 `onTriggerTap`을 제거하고, 파일 선택 함수를 `AttachmentDisplay.Trigger`의 `bindtap`에 연결해야 합니다.)
  
  `AttachmentDisplay`의 파일 선택 동작을 Root의 callback에서 Trigger의 tap handler로 옮깁니다.
  
  - 이전에는 Trigger를 누르면 Root에 전달한 `onTriggerTap`을 호출하며 `addEntries`·`updateEntryStatus`를 인자로 제공했습니다. 이제 Trigger는 자신의 `bindtap`을 호출합니다.
  - 선택한 항목과 업로드 상태는 `AttachmentDisplay.Context` 또는 `useAttachmentDisplayContext`의 `addEntries`·`updateEntryStatus`로 갱신합니다.
  - Registry `ui:attachment-display-field`의 `AttachmentDisplay.onTriggerTap`은 유지합니다. 이 변경은 `@seed-design/lynx-react`에서 가져온 컴포넌트와 훅에만 적용합니다.
- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.
- ee36625: (BREAKING CHANGE: `Checkbox.Root`의 `pressed`, `checkmark({ pressed })`의 `pressed`, `checkmarkVariantMap.pressed` 사용을 제거해야 합니다. `checkmark` Recipe로 ghost mark를 직접 조합한다면 기존 `background`와 함께 `selectedBackground` slot도 렌더링해야 합니다.)
  
  Checkbox의 눌림 색상을 `pressed` prop과 Recipe variant 대신 Root의 `:active` 상태로 적용합니다.
  
  - ghost mark는 이전에 하나의 `background`로 선택 여부에 따른 눌림 배경을 그렸지만, 이제 미선택용 `background`와 선택·indeterminate용 `selectedBackground`를 따로 사용합니다.
- fe5d645: (BREAKING CHANGE: `Chip.Root`를 `Chip.Button`으로, `ChipRoot`를 `ChipButton`으로, `Chip.RootProps`·`ChipRootProps`를 `Chip.ButtonProps`·`ChipButtonProps`로 변경해야 합니다.)
  
  일반 Chip의 공개 이름을 React와 같이 `Chip.Button`으로 통일합니다.
  
  - 이전에는 `Chip.Root`·`ChipRoot`도 같은 버튼을 렌더링하는 별칭으로 제공했지만, 이제 이 별칭과 해당 Props 타입을 제거하고 `Chip.Button`·`ChipButton`만 제공합니다.
- 6ad3b50: (BREAKING CHANGE: indeterminate 상태로 표시할 `ProgressCircle`에서는 `value`를 제거해야 합니다.)
  
  `ProgressCircle`은 이전에 `value`·`minValue`·`maxValue`를 모두 전달해야 determinate 상태가 되었지만, 이제 숫자 `value`만으로 진행률을 표시합니다.
  
  - 범위를 생략하면 0에서 100을 사용하며, 표시하는 진행률은 0%에서 100% 사이로 제한합니다.
  - 숫자 `value`가 없으면 indeterminate 상태로 표시합니다. Registry `AttachmentField`·`AttachmentDisplayField`의 업로드 항목도 전달받은 진행률을 표시합니다.
- 524ad2f: (BREAKING CHANGE: `Field.Root` 밖의 `Field.Label`·`FieldLabel`을 `Field.Root` 안으로 옮겨야 합니다.)
  
  `Field.Label`을 필드 상태를 읽는 파트로 변경해, 이전과 달리 `Field.Root` 밖에서 렌더링하면 오류가 발생합니다.
- 524ad2f: (BREAKING CHANGE: `useAttachmentInputItemContext`의 `removeButtonProps`에서 `main-thread:bindtap`을 읽는 코드는 `bindtap`을 사용하도록 변경해야 합니다. 반환 객체를 직접 구성한다면 `removeButtonProps.bindtap`과, `imageProps`가 있으면 `imageProps.alt` 문자열을 제공해야 합니다. `AttachmentInputContextValue`를 직접 구성한다면 `acceptType`도 `"image"` 또는 `undefined` 값으로 제공하고, property 존재 여부 대신 값을 검사해야 합니다.)
  
  첨부 항목 context의 반환 타입에서 삭제 handler와 이미지 대체 설명, 파일 유형의 계약을 명시합니다.
  
  - `removeButtonProps`는 optional tap handler들을 허용하던 타입에서 필수 `bindtap`만 제공하는 객체로 바뀝니다.
  - `imageProps.alt`는 optional에서 필수 문자열로 바뀝니다. 이미지 미리보기가 없으면 `imageProps` 자체는 여전히 `undefined`입니다.
  - `AttachmentInputContextValue.acceptType`은 optional property에서 항상 존재하는 property로 바뀌며, 값은 `"image"` 또는 `undefined`입니다.

### Minor Changes

- a62322c: Action Button의 `bleed`, `bleedX`, `bleedY` prop을 지원합니다.
- a499751: `Dialog.Title`에 기본 `accessibility-heading`을 추가해 스크린 리더가 제목으로 읽도록 합니다.
  
  - 제목으로 읽히지 않게 하려면 `accessibility-heading={false}`를 지정합니다.
- b7cad68: `ProgressCircle.Root`에 `mainThreadProgress`를 추가해 제스처에 따라 바뀌는 진행률을 진행 링에 바로 반영할 수 있습니다.
- 6faa8c1: `HelpBubble.Positioner`의 `container`로 Lynx view 밖까지 덮는 native overlay에 말풍선을 표시하고, `overlayLevel`로 overlay 사이의 순서를 지정할 수 있습니다.
  
  Registry의 `HelpBubbleTrigger`와 `HelpBubbleAnchor`에서도 `container`, `overlayLevel`을 사용할 수 있습니다. `npx @seed-design/cli@latest add ui:help-bubble`로 최신 snippet을 설치합니다.
- 7f51d06: Lynx `ContentPlaceholder`와 React에 대응하는 12개 프리셋을 추가합니다.
  
  - `Root`·`Asset`과 Registry snippet으로 비어 있는 콘텐츠 영역을 구성합니다.
  - 필요한 프리셋만 개별 경로에서 import해 `preset`으로 전달하며, 사용하지 않는 프리셋은 번들에 포함하지 않습니다.
  - 프리셋은 React SVG와 SEED 토큰에서 생성한 테마별 WebP로 표시하며, 표시 후 색을 덮어쓰지 않습니다.
  - 커스텀 아이콘·이미지는 크기와 정렬만 적용합니다. 모노크롬 아이콘의 색은 `tint-color`로 직접 지정합니다.
- a1881c3: (BREAKING CHANGE: `select-trigger`·`select-item` Recipe를 직접 조합했다면 콘텐츠를 `scaleContent` slot으로 감싸고, `root`에 지정한 콘텐츠 간격과 직접 자식 selector를 새 slot에 맞게 수정해야 합니다.)
  
  `Select.Trigger`와 `Select.Item`에 배경과 분리된 콘텐츠 눌림 효과를 추가합니다.
  
  - 이전에는 콘텐츠가 `root`의 직접 자식이었습니다. 이제 새 `scaleContent` slot 안에 배치되며, 누르면 배경을 유지한 채 콘텐츠만 축소합니다.
  - 크기별 `gap`은 `root`에서 `scaleContent`로 이동합니다.
  - `@seed-design/lynx-react`의 styled 컴포넌트는 기존 children 조합을 그대로 사용할 수 있습니다.
- 7e9cdb9: Lynx `Skeleton`의 `height`에 `lineHeight.t4` 같은 line-height 토큰을 지정해 텍스트 줄 높이에 맞출 수 있습니다.
- 6adc7a1: Lynx `Text`에서 최대 줄 수와 텍스트 장식을 지정할 수 있습니다.
  
  - `maxLines`로 줄 수를 제한하고 넘치는 텍스트를 말줄임표로 표시합니다.
  - `textDecorationLine`으로 `underline` 또는 `line-through`를 적용합니다.
- 39d5917: 세로로 드래그하여 항목을 선택하는 Lynx `WheelPicker`를 추가합니다.
  
  - `WheelPicker.Root`·`WheelPicker.Column`·`WheelPicker.ItemLabel`로 여러 열을 조합하고, 각 `Column`의 `options`·`value`·`defaultValue`·`onValueChange`로 선택값을 관리합니다.
  - `loop`로 항목을 반복하고, `onIndexChange`로 조작 중 지나가는 항목을 확인할 수 있습니다.
  - `valueChangeBehavior`로 외부 선택값 변경 시 이동 방식을, `renderLabel`로 항목 표시를 지정합니다. `@seed-design/lynx-css/recipes/wheel-picker` Recipe를 제공합니다.
  - 접근성 이름은 각 `Column`의 `accessibility-label`로 지정합니다. 키보드·포커스 탐색은 지원하지 않습니다.
- 248941e: iOS·Android 네이티브 접근성 트리에 컨트롤의 이름과 항목이 빠지지 않게 합니다.
  
  - ActionButton, Chip, Checkbox, Switch, Accordion Trigger, List 행, RadioGroup·SelectBox 항목, Tabs·ChipTabs·SegmentedControl 항목이 텍스트 children으로 `accessibility-label`을 채웁니다. children에 `<text>` 같은 native 요소만 있으면 이름을 알 수 없으므로 `accessibility-label`을 직접 지정하세요(개발 환경에서 경고합니다).
  - Menu·HelpBubble·Dialog·AlertDialog·MenuSheet Trigger가 접근성 요소로서 이름을 갖고, 안에 둔 ActionButton·Chip은 별도 요소로 노출하지 않습니다. Dialog·AlertDialog Trigger는 `accessibility-label`을 받습니다.
  - RadioGroup·SelectBox·QuantityPicker·Chip.RadioRoot·Checkbox.Group·List Root가 기본적으로 접근성 요소가 아니어서 안쪽 항목이 가려지지 않습니다. QuantityPicker의 이름과 현재 수량은 ValueDisplay가 노출합니다.
  - 접근성 요소 root에 `flatten={false}`를 기본으로 두어 Android에서 노드가 사라지지 않게 합니다.
  - 컨트롤 안의 label 텍스트는 같은 이름이 두 번 읽히지 않도록 접근성 트리에서 숨깁니다.
- 524ad2f: `useAttachmentInputContext`·`useAttachmentInputItemContext`·`useAttachmentDisplayContext`·`useAttachmentDisplayItemContext`에 `{ strict: false }` 옵션을 추가해, Provider 안팎에서 함께 쓰는 컴포넌트가 context 유무를 확인할 수 있도록 합니다.
  
  - 이전에는 Provider 밖에서 호출하면 항상 오류가 발생했습니다. 이제 `{ strict: false }`를 전달하면 `null`을 반환하며, 옵션을 생략하면 기존처럼 오류가 발생합니다.
- 524ad2f: `FieldButton.Root`에 `values`·`onValuesChange`를 추가해 `FieldButton.ClearButton`으로 선택값 삭제를 요청할 수 있도록 합니다.
  
  - 이전에는 앱이 `ClearButton.bindtap`에서 직접 값을 지워야 했습니다. 이제 버튼을 누르면 `onValuesChange([])`가 호출되며, 앱에서 `values`를 갱신합니다.
  - 기존 `ClearButton.bindtap`에서도 값을 지운다면 같은 변경을 중복 처리하지 않아야 합니다.
- b7cad68: Lynx `PullToRefresh` 컴포넌트를 추가합니다.
  
  - `PullToRefresh.Root`·`Indicator`·`Content`와 `onPtrRefresh`로 콘텐츠를 당겨 새로고침하고 당긴 정도를 표시할 수 있습니다.
  - 앱의 `pluginReactLynx` 설정에 `enableNewGesture: true`를 추가해야 합니다.
  - `npx @seed-design/cli@latest add ui:pull-to-refresh`로 Registry 컴포넌트를 설치할 수 있습니다.
  - 스타일 없이 조합하려면 `@seed-design/lynx-react-pull-to-refresh`를 사용합니다.
- 83b5ca4: Lynx Avatar와 AvatarStack을 추가합니다.
  
  - 이미지 로딩 상태와 fallback, 배지 및 10가지 크기를 제공합니다.
  - React와 같은 compound API와 여러 프로필을 겹치는 Stack을 제공합니다.
  - 네이티브에서 배지가 표시되도록 쌓임 순서를 조정하고 예제 배지는 WebP로 제공합니다.
  - 이미지 상태·fallback을 headless Image에 위임합니다.
  - `badgeMask`로 원·꽃·방패 모양의 투명한 배지 여백을 제공합니다. React와 같은 도형·치수에서 생성한 `clip-path`를 적용하며, 배지 안의 커스텀 콘텐츠는 그대로 표시합니다.
  - headless 패키지를 외부 의존성으로 유지해 스타일드 컴포넌트와 공개 headless API가 같은 Context를 공유합니다.
- f423482: ImageFrame과 이미지 위에 배치하는 오버레이 컴포넌트를 제공합니다.
  
  - `useImage`로 로딩·실패·이미지 교체를 처리하며 비율, 모서리 라운드와 테두리를 지정할 수 있습니다.
  - Floater, Badge, Icon, Indicator와 `useToggle` 기반 ReactionButton을 함께 제공합니다.
  - 가운데 배치는 기본 오프셋 없이 정렬하고, 아이콘 크기·색상은 Recipe를 따릅니다.
  - 좋아요 아이콘은 SVG 디코딩에 의존하지 않는 WebP로 제공합니다.
  - 이미지·fallback과 좋아요 입력·접근성 처리를 headless Image·Toggle에 위임합니다.
  - headless 패키지를 외부 의존성으로 유지해 스타일드 컴포넌트와 공개 headless API가 같은 Context를 공유합니다.
  - 개별 모서리 radius와 숫자 `style.borderRadius`를 이미지 clipping과 stroke에 동일하게 적용합니다.
- 7147073: Lynx Bottom Sheet에 닫기 버튼을 추가합니다.
  
  - `BottomSheet.CloseButton`을 탭하면 시트가 닫히고 `onOpenChange`에 `"closeButton"` reason이 전달됩니다.
  - CloseButton이 렌더링되는 동안 Title이 버튼 자리만큼 여백을 둡니다.
  - Registry `BottomSheetContent`에 `showCloseButton`(기본값 `true`)을 추가했습니다. `npx @seed-design/cli@latest add ui:bottom-sheet`로 다시 설치해야 적용됩니다.

### Patch Changes

- 7dae990: Lynx `Tabs`를 스와이프할 때 Android logcat에 `illegal css key` 오류가 반복되던 문제를 수정합니다.
  
  - Headless `Tabs.Indicator`는 `--tabs-indicator-x`·`--tabs-indicator-width` 변수 대신 inline `transform`·`width`(px)로 위치와 폭을 지정합니다.
- 524ad2f: Lynx 4.0 미만 엔진에서 3.9.1을 제외하고 `TextField.Input`·`TextField.Textarea`의 `value`·`defaultValue` 초기 값이 표시되지 않던 문제를 수정합니다.
- 4f1c681: (BREAKING CHANGE: `MenuSheet.Item`을 직접 조합한다면 `menuSheetItem().divider` 요소를 `menuSheetItem().root` 요소의 다음 형제에서 마지막 자식으로 옮겨야 합니다.)
  
  `MenuSheet` 구분선을 각 Item 바깥에서 안쪽 하단에 겹쳐 표시하도록 변경해, Item 배경과 올바른 대비를 유지합니다.
- 925b628: `Select`를 마운트하거나 열 때 모든 항목을 다시 렌더링하던 문제를 수정해, 항목이 많은 목록에서도 렌더링 횟수가 늘지 않도록 합니다.
- 60141a0: AlertDialog.Content가 더 이상 기본으로 접근성 요소(`accessibility-element`)가 아니고 `accessibility-role-description="alertdialog"`도 적용하지 않습니다. iOS에서 열린 Alert Dialog의 제목·설명·action이 접근성 트리에서 가려지던 문제를 고칩니다. Content 자체를 하나의 요소로 노출해야 하면 `accessibility-element`를 직접 지정하세요.
- f164f8b: (BREAKING CHANGE: `badge({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `Badge`에 눌림 효과가 필요하면 `ScaleFeedback`을 별도로 적용해야 합니다.)
  
  `Badge.Action`의 눌림 축소 효과를 recipe의 `pressed` variant 대신 실제 눌림 동작에 맞춰 적용합니다.
  
  - 이전에는 `pressed` variant와 그 class로 축소를 지정했지만, 이제 recipe에서 이 variant와 class를 제거합니다.
  - `Badge.Action` 컴포넌트는 눌렀을 때 자동으로 축소되며, `GlobalProps.motion="reduced"`이면 축소되지 않습니다.
- 248aee6: `BottomSheet.Positioner`에 `container`를 지정했을 때 overlay 레이어의 크기가 잡히지 않아 시트가 화면 밖에 그려지던 문제를 수정합니다.
  
  - 이제 `Positioner`가 overlay 레이어의 너비와 높이를 채웁니다.
  - Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:bottom-sheet`로 다시 설치해야 `container`와 `overlayLevel`을 전달합니다.
- 6faa8c1: `HelpBubble`의 배치 방향이 바뀔 때 화살표에 이전 방향의 위치 값이 남아 잘못 배치되던 문제를 수정하여, 현재 방향에 맞는 위치만 적용합니다.
- e1a260b: `Dialog.Positioner`에 `container`를 지정했을 때 overlay 레이어를 채우지 않던 문제를 수정해 너비와 높이를 `100%`로 맞춥니다.
- 79b5761: `Divider`의 `orientation`이나 `inset`을 바꿀 때 이전 방향의 크기와 여백이 남아 레이아웃이 어긋나던 문제를 수정합니다.
  
  - 방향이나 inset이 바뀌면 새 크기와 여백으로 요소를 다시 만들며, 전달한 ref도 새 요소에 다시 연결합니다.
- 3b4d190: Lynx `ActionButton`·`FloatingActionButton`·`ContextualFloatingButton`의 기본 `accessibility-traits`가 버튼 상태를 올바르게 알리도록 수정합니다.
  
  - 이전에는 `ActionButton`이 `disabled`·`loading` 상태에서도 `"button"`으로 안내됐습니다. 이제 이 상태에서는 `"disabled"`로 안내합니다.
  - `FloatingActionButton`과 `ContextualFloatingButton`은 활성 상태에서 기본 trait가 없었습니다. 이제 `"button"`을 제공하고, 비활성 상태는 기존처럼 `"disabled"`로 안내합니다.
  - 직접 지정한 `accessibility-traits`는 그대로 사용합니다.
- 3b4d190: Lynx `FloatingActionButton.Label`의 축소·확장 전환에서 Label이 사라지거나 줄바꿈·잘림이 발생하던 문제를 수정합니다.
  
  - 이전에는 `extended={false}`일 때 Label을 제거했습니다. 이제 Label을 유지하고 opacity로 숨기거나 표시합니다.
  - Label은 전환 중에도 한 줄을 유지하며, 기존처럼 접근성 트리에서 숨깁니다.
- 695429c: Lynx `FloatingActionButton.Root`가 `disabled`로 바뀐 뒤 탭할 때 `MainThreadFunction: Invalid function object` 경고가 발생하던 문제를 수정합니다.
- 2146a67: Android 네이티브 접근성 트리에서 Menu 항목, Select Trigger·항목, MenuSheet 항목이 빠지지 않게 합니다. 접근성 요소인 각 root에 `flatten={false}`를 기본으로 둡니다.
- 26bf8c3: `List`와 `SelectBox`의 체크박스·라디오 마크가 세로 가운데에 놓이지 않던 문제를 수정해 콘텐츠와 중앙 정렬합니다.
- 412f1e8: Lynx `Tabs`·`ChipTabs`의 `Carousel`이 `Trigger`의 추가·제거·비활성화 변경으로 선택값을 바꾸고 `onValueChange`를 호출하던 문제를 수정하여, 실제 swipe에서만 선택값을 바꿉니다.
- c1e30e0: `TagGroup.Root`가 구분자를 스크린 리더에 노출하거나 `""`·`0` 같은 falsy child 앞에 구분자를 추가하던 문제를 수정해, falsy child를 항목에서 제외하고 구분자는 접근성 트리에서 숨깁니다.
- caf429b: 포커스된 `TextField.Input`·`TextField.Textarea`를 제거한 뒤 `blur` 이벤트가 오지 않으면 포커스 상태가 남던 문제를 수정해, 입력을 제거할 때 `TextField`와 상위 `Field`의 포커스 상태도 해제합니다.
- 8b58306: Fragment로 감싼 `MannerTempEmote`가 label 안의 inline 이미지로 표시되던 문제를 수정해 label 뒤의 emote slot에 표시합니다.
- 7dae990: Lynx `HelpBubble`·Popover를 좌우로 배치했을 때 좁은 화면에서 말풍선이 트리거를 덮던 문제를 수정하여, 남은 옆 공간에 맞춰 줄바꿈합니다.
- e056828: `ProgressCircle`의 indeterminate 상태와 `QuantityPicker`의 loading 상태가 매 프레임 JavaScript에서 스타일을 갱신해 CPU 사용과 DevTool 로그가 늘어나던 문제를 수정합니다.
- 524ad2f: `BottomSheet.Body`가 남는 높이를 모두 차지하던 문제를 수정해 콘텐츠 높이만큼 배치합니다.
- 524ad2f: `AttachmentInput`과 `AttachmentDisplay`의 삭제 버튼을 눌렀을 때 scale 피드백이 표시되지 않던 문제를 수정해, 누르는 동안 버튼이 축소되도록 합니다.
- 524ad2f: `PageBanner.CloseButton`에 `accessibility-label`이 없을 때 같은 개발 경고가 렌더링마다 반복되던 문제를 수정합니다. 이제 마운트하거나 `accessibility-element`·`accessibility-label`이 바뀔 때만 누락 여부를 확인해 경고합니다.
- 524ad2f: `AttachmentDisplay`에서 같은 위치로 `reorderEntry`를 호출하거나 여러 항목을 허용하는 목록이 가득 찬 상태에서 `addEntries`를 호출하면, 목록이 그대로인데도 `onEntriesChange`가 호출되던 문제를 수정합니다. 이제 이 경우에는 목록을 유지하고 `onEntriesChange`를 호출하지 않습니다.
- ac0b1ae: `Select`·`Menu`·`HelpBubble`이 화면 하단 안전 영역(홈 인디케이터, 제스처 내비게이션)까지 목록이나 말풍선을 배치하던 문제를 수정합니다.
- 925b628: Android에서 가로 `scroll-view` 안의 요소를 기준으로 연 `HelpBubble`·`Menu`·`Select`가 스크롤을 따라가지 않던 문제를 수정합니다.
- 7dae990: Lynx `BottomSheet`의 snap point 레이아웃을 수정합니다.
  
  - host가 화면 높이를 전달하지 않아도 기기 화면 높이로 퍼센트 snap point를 계산합니다. 이전에는 500px을 기준으로 계산했습니다.
  - 공간이 부족할 때 Header·Footer는 줄어들지 않고 Body만 줄어들어 제목·설명이 겹치지 않습니다.
- d0334da: 여러 HelpBubble을 띄운 화면을 스크롤할 때 말풍선이 늦게 따라오고 화면이 버벅이던 문제를 줄입니다.
- 308c087: Android 일부 기기에서 Accordion을 열 때 높이 측정이 1px씩 반복해 바뀌며 열림 애니메이션이 끊기던 문제를 고칩니다.
- 6c73893: Android에서 좌우로 배치한 `HelpBubble`이 위치를 매 프레임 다시 계산해 화면이 비거나 입력이 멈추던 문제를 수정합니다.
- 524ad2f: 처음부터 열린 `Accordion.Content`가 높이 `0px`에서 펼쳐지던 문제를 수정합니다.
  
  - 열린 `Accordion.Content`·`CheckSelectBox.Footer`·`RadioSelectBox.Footer`는 초기 높이를 내용에 맞춰, 처음 표시할 때 펼침 애니메이션 없이 내용을 보여줍니다.
- ac07387: (BREAKING CHANGE: `segmentedControl({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `SegmentedControl`에는 `itemSelectedBackground` slot을 추가해야 합니다.)
  
  Lynx `SegmentedControl`의 눌림 배경을 선택 상태별로 분리해, 선택이 바뀌는 순간 사라지는 배경의 색도 바뀌던 문제를 수정합니다.
  
  - 이전에는 하나의 `itemBackground`에서 선택 상태에 따라 눌림 색을 바꿨지만, 이제 미선택용 `itemBackground`와 선택용 `itemSelectedBackground`에 각각 색을 고정합니다.
  - `pressed` Recipe variant를 제거하고, Item의 `:active` 상태에서 선택 여부에 맞는 배경을 표시합니다.
- 524ad2f: Lynx `SegmentedControl.Indicator`가 처음 표시될 때 서서히 나타나던 문제를 수정해, 초기 선택 위치에 바로 표시하고 이후 선택 변경에만 전환 효과를 적용합니다.
  
  - 직접 조합한 `Indicator`는 새 `transitionEnabled` variant로 전환 효과를 켜고 끌 수 있습니다. 초기 배치에는 `false`를 사용하고 이후 선택 변경부터 `true`로 전환할 수 있습니다.
- 7dae990: Lynx `Slider`의 controlled 값을 최솟값으로 바꾸면 Value Indicator 위치 계산이 반복되어 `CallLepusMethod called too frequently` 경고가 발생하던 문제를 수정합니다.
- 524ad2f: `Slider.Marker`에 문자열이나 숫자를 직접 넣었을 때 라벨이 표시되지 않던 문제를 수정해, 별도 `<text>`로 감싸지 않아도 라벨을 표시합니다.
- Updated dependencies [7dae990]
- Updated dependencies [524ad2f]
- Updated dependencies [0e01546]
- Updated dependencies [7dae990]
- Updated dependencies [20d639c]
- Updated dependencies [7dae990]
- Updated dependencies [4f1c681]
- Updated dependencies [8337f8e]
- Updated dependencies [e91d2d9]
- Updated dependencies [f417a4f]
- Updated dependencies [580d5eb]
- Updated dependencies [f164f8b]
- Updated dependencies [f1225c4]
- Updated dependencies [7f51d06]
- Updated dependencies [e1a260b]
- Updated dependencies [3b4d190]
- Updated dependencies [f98c5aa]
- Updated dependencies [d4a20aa]
- Updated dependencies [caf429b]
- Updated dependencies [318193f]
- Updated dependencies [6faa8c1]
- Updated dependencies [575cdfe]
- Updated dependencies [a5af36f]
- Updated dependencies [a8229fe]
- Updated dependencies [bb2513e]
- Updated dependencies [bb2513e]
- Updated dependencies [b1a262d]
- Updated dependencies [6bf4f3d]
- Updated dependencies [6faa8c1]
- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [46ecb70]
- Updated dependencies [362cada]
- Updated dependencies [a1881c3]
- Updated dependencies [e5ebfb1]
- Updated dependencies [e5ebfb1]
- Updated dependencies [26bf8c3]
- Updated dependencies [46bab1a]
- Updated dependencies [eb01c01]
- Updated dependencies [cbbb6fe]
- Updated dependencies [bc976a5]
- Updated dependencies [8653a08]
- Updated dependencies [e91d2d9]
- Updated dependencies [39d5917]
- Updated dependencies [524ad2f]
- Updated dependencies [e056828]
- Updated dependencies [7dae990]
- Updated dependencies [248941e]
- Updated dependencies [e056828]
- Updated dependencies [524ad2f]
- Updated dependencies [34e7691]
- Updated dependencies [524ad2f]
- Updated dependencies [2d2f4df]
- Updated dependencies [fd2da0b]
- Updated dependencies [ee36625]
- Updated dependencies [6ad3b50]
- Updated dependencies [9c724ea]
- Updated dependencies [ac07387]
- Updated dependencies [37ae101]
- Updated dependencies [eb01c01]
- Updated dependencies [7dae990]
- Updated dependencies [524ad2f]
- Updated dependencies [7dae990]
- Updated dependencies [b7cad68]
- Updated dependencies [a684488]
- Updated dependencies [ee36625]
- Updated dependencies [77eaa1e]
- Updated dependencies [5769ae6]
- Updated dependencies [ac07387]
- Updated dependencies [524ad2f]
- Updated dependencies [7dae990]
- Updated dependencies [e056828]
- Updated dependencies [3a9dbc2]
- Updated dependencies [7dae990]
- Updated dependencies [83b5ca4]
- Updated dependencies [f423482]
- Updated dependencies [7dae990]
- Updated dependencies [26fa233]
- Updated dependencies [7147073]
  - @seed-design/lynx-css@1.0.0
  - @seed-design/lynx-react-bottom-sheet@1.0.0
  - @seed-design/lynx-react-tabs@1.0.0
  - @seed-design/lynx-react-scale-feedback@1.0.0
  - @seed-design/lynx-react-app-bar@1.0.0
  - @seed-design/lynx-react-attachment-display@1.0.0
  - @seed-design/lynx-react-callout@1.0.0
  - @seed-design/lynx-react-dialog@1.0.0
  - @seed-design/lynx-react-field-button@1.0.0
  - @seed-design/lynx-react-field@1.0.0
  - @seed-design/lynx-react-file-upload@1.0.0
  - @seed-design/lynx-react-floating@1.0.0
  - @seed-design/lynx-react-keyboard-avoiding-scroll-view@1.0.0
  - @seed-design/lynx-react-loop-scroll@1.0.0
  - @seed-design/lynx-react-menu@1.0.0
  - @seed-design/lynx-react-toggle@1.0.0
  - @seed-design/lynx-react-page-banner@1.0.0
  - @seed-design/lynx-react-popover@1.0.0
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-collapsible@1.0.0
  - @seed-design/lynx-react-select@1.0.0
  - @seed-design/lynx-react-slider@1.0.0
  - @seed-design/lynx-react-text-field@1.0.0
  - @seed-design/lynx-react-use-safe-area@1.0.0
  - @seed-design/lynx-react-radio-group@1.0.0
  - @seed-design/lynx-react-quantity-picker@1.0.0
  - @seed-design/lynx-react-accordion@1.0.0
  - @seed-design/lynx-react-action-button@1.0.0
  - @seed-design/lynx-react-checkbox@1.0.0
  - @seed-design/lynx-react-progress@1.0.0
  - @seed-design/lynx-react-segmented-control@1.0.0
  - @seed-design/lynx-react-switch@1.0.0
  - @seed-design/lynx-react-pull-to-refresh@1.0.0
  - @seed-design/lynx-react-image@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0

## 0.10.0

### Minor Changes

- 19ecbd6: (BREAKING CHANGE: `@seed-design/lynx-react`에서 가져온 `<Badge>`와 `BadgeProps`를 `ui:badge` snippet의 `Badge`와 `BadgeProps`로 교체해야 합니다. `npx @seed-design/cli@latest add ui:badge`로 snippet을 설치한 뒤 import를 바꾸세요.) Badge에 아이콘을 표시하는 Prefix와 정보 아이콘 버튼을 표시하는 Action을 추가하고, 완성된 Badge를 snippet으로 제공합니다.
  
  - `Badge`는 JSX 컴포넌트가 아니라 `Badge.Root`, `Badge.Prefix`, `Badge.Label`, `Badge.Action`으로 구성된 namespace로 바뀌며, `BadgeProps` export를 제거합니다.
  - snippet의 `Badge`에는 라벨을 `children`으로 전달하며, 기존 `tone`, `variant`, `size`를 그대로 사용할 수 있습니다.
  - `prefix`에 아이콘 요소를 바로 전달할 수 있습니다.
  - `actionProps`를 전달하면 고정된 정보 아이콘 버튼을 표시합니다. `actionProps`에 `accessibility-label`과 `bindtap`을 전달해 동작을 연결할 수 있으며, `prefix`와 함께 사용할 수 있습니다.
  - Badge에 기본으로 적용되던 최대 너비를 제거합니다. 한 줄 말줄임이 필요하다면 최대 너비를 직접 지정하세요.

### Patch Changes

- Updated dependencies [19ecbd6]
- Updated dependencies [d3edadf]
- Updated dependencies [5e34f78]
- Updated dependencies [78f0bc1]
- Updated dependencies [66c3bd9]
- Updated dependencies [ebdc295]
- Updated dependencies [66c3bd9]
- Updated dependencies [19ecbd6]
  - @seed-design/lynx-css@0.14.0

## 0.9.0

### Minor Changes

- ba7cfa8: `AppBar`가 좌우 safe area inset을 반영합니다.
  
  - `AppBar`의 내용이 좌우 inset만큼 안쪽으로 들어가서, 좌우 inset이 있는 화면에서도 디스플레이 컷아웃에 가려지지 않습니다. cupertino 테마의 가운데 타이틀은 safe area 안에서 가운데에 옵니다.
  - cupertino 테마에서 가운데 타이틀이 길면 좌우 버튼과 겹치던 문제를 고칩니다.
- 934e3ef: `useSafeArea`와 `Box`가 좌우 safe area inset을 지원합니다.
  
  - `useSafeArea`가 호스트 앱의 `lynx.__globalProps`에서 좌우 inset을 읽어 `safeAreaInsetLeft`, `safeAreaInsetRight`로 반환합니다. 호스트가 값을 주지 않으면 `env(safe-area-inset-*)`로 fallback합니다.
  - 내용을 좌우 inset만큼 안쪽으로 넣어야 하는 영역은 `Box`의 `pl`, `pr`에 `"safeArea"`를 지정합니다.
- 934e3ef: `Box`, `VStack`, `HStack`에 margin과 bleed style prop을 추가합니다.
  
  - `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`과 longhand margin prop으로 margin을 지정합니다. SEED 토큰, 길이, `"auto"`를 받습니다.
  - `bleed`, `bleedX`, `bleedY`, `bleedTop`, `bleedRight`, `bleedBottom`, `bleedLeft`로 요소를 부모의 padding 영역까지 넓힙니다. px 길이, `0`, `"safeArea"`를 받으며, `"safeArea"`는 같은 방향의 safe area inset만큼 넓힙니다. Lynx는 inline style의 `calc()` 안에 있는 CSS 변수를 적용하지 않으므로, bleed는 SEED 토큰을 받지 않습니다.
  - margin 계열과 bleed 계열은 함께 지정할 수 없습니다. 이 제약 때문에 `BoxProps`, `StackProps`, `VStackProps`, `HStackProps`가 union 타입으로 바뀌었습니다. 이 타입을 `interface ... extends`로 확장하던 코드는 `type MyBoxProps = BoxProps & { ... }`처럼 `type`으로 바꿔야 합니다.
  - 이 변경으로 기존 `ui:result-section` snippet은 타입 검사를 통과하지 못합니다. snippet을 다시 내려받아 주세요.
    - `npx @seed-design/cli@latest add ui:result-section`
- cb4c4a1: Top Navigation 높이를 iOS·Android 모두 56px로 통일합니다. `theme=cupertino` App Bar와 App Screen의 높이가 44px에서 56px로 바뀝니다.

### Patch Changes

- Updated dependencies [cb4c4a1]
  - @seed-design/lynx-css@0.13.0

## 0.8.0

### Minor Changes

- fa699aa: Lynx에 Attachment Field와 Attachment Display Field를 추가합니다. 호스트 네이티브 파일 선택 연동, 파일 검증, 업로드 상태 표시와 첨부 항목 관리를 지원합니다.
- fa699aa: Dialog와 Alert Dialog 컴포넌트를 추가합니다.

  - Dialog와 Alert Dialog 콘텐츠는 열릴 때 opacity와 scale 애니메이션을 제공하고, 닫힐 때 opacity로 사라집니다.
  - Alert Dialog는 중요한 작업에 대한 사용자 확인 흐름을 제공하며 기본적으로 backdrop 탭으로 닫히지 않습니다.

- fa699aa: `ScrollFog` 컴포넌트를 추가하고, `BottomSheetBody`를 스크롤 방식을 직접 구성할 수 있는 `view`로 변경합니다. `TabsList`와 `ChipTabsList`는 native scroll-view prop을 전달받아 같은 fading edge를 직접 적용할 수 있습니다.
- fa699aa: Lynx에 `Skeleton` 컴포넌트를 추가합니다.

  - `radius`, `tone`, `width`, `height`로 형태와 크기를 조절할 수 있습니다.

- fa699aa: Lynx용 `FloatingActionButton` 컴포넌트를 추가합니다. `extended`로 라벨 표시와 버튼 형태를 전환할 수 있습니다.
- fa699aa: Lynx 플랫폼에 Chip Tabs 컴포넌트를 추가합니다.
- fa699aa: Lynx에 `IdentityPlaceholder` 컴포넌트를 추가합니다. 사람과 매장 도형은 기존 SVG에서 변환한 640×640 WebP 이미지로 제공합니다.
- fa699aa: Lynx에서 Quantity Picker의 수량 증감, 개별 로딩, 삭제 전환, 레이아웃과 값 포매팅을 사용할 수 있도록 컴포넌트와 스타일을 추가합니다.
- fa699aa: Lynx 플랫폼에 단일·다중 선택을 지원하는 `Select` 컴포넌트를 추가합니다.
- fa699aa: Lynx에 `ContextualFloatingButton` 컴포넌트를 추가합니다.

  - `solid`, `layer` 변형과 텍스트·아이콘 전용 레이아웃을 지원합니다.
  - 눌림 피드백, 로딩 표시와 비활성 상태를 제공합니다.

- fa699aa: Lynx에서 사용할 수 있는 `HelpBubble` 컴포넌트를 추가합니다.
- fa699aa: Lynx `AppBar` 아이콘 버튼의 슬롯 양쪽 여백을 React와 같은 규칙으로 자동 보정합니다.

  - 왼쪽·오른쪽 슬롯 모두 첫 자식이 아이콘 버튼이면 왼쪽, 마지막 자식이 아이콘 버튼이면 오른쪽 여백을 보정합니다. 버튼 하나는 양쪽을 보정하며, 44px 터치 영역은 유지합니다.
  - Fragment와 조건부 자식을 지원하며, `edge="leading" | "trailing" | "both"`으로 자동 보정 방향을 덮어쓸 수 있습니다.
  - 커스텀 슬롯의 배치와 기존 사용자 스타일을 유지합니다.

- fa699aa: Lynx에 `Slider` 컴포넌트를 추가합니다. 터치 드래그, 다중 범위, 단계·허용값, RTL, 값 표시와 접근성 레이블을 지원합니다.
- fa699aa: React·Rootage 명세에 맞춰 Lynx 컴포넌트의 Scale Feedback과 배경색 전환을 보완하고, List를 처음 누를 때 모서리 형태가 바뀌는 문제를 수정합니다.

  컴포넌트별 Feedback 변경 사항은 다음과 같습니다.

  - `AppBar.IconButton`: 버튼 전체에 Scale Feedback을 추가합니다.
  - `ReactionButton`: 고정 축소율을 공통 Scale Feedback으로 교체하고, 선택 상태의 배경색 전환과 비활성·로딩 상태의 Feedback 처리를 보완합니다.
  - `InputButton`: 내용 영역에 Scale Feedback과 버튼 배경색 전환을 추가하고, `ClearButton`에는 독립적인 Scale Feedback을 추가합니다.
  - `List.ButtonItem`, `List.CheckboxItem`, `List.RadioItem`, `List.SwitchItem`: 내용 영역에 공통 Scale Feedback을 연결하고, 누름 배경이 처음부터 둥근 모서리를 유지하도록 수정합니다. 내부 선택 컨트롤이 중복으로 축소되지 않도록 처리합니다.
  - `Menu.Item`: 내용 영역에 Scale Feedback을 추가하고, 누름 배경 Feedback을 보완합니다.
  - `SwipeableMenuSheet.Item`, `SwipeableMenuSheet.CloseButton`: 항목의 내용 영역과 닫기 버튼 전체에 각각 Scale Feedback을 추가하고, 누름 배경 Feedback을 보완합니다.
  - `PageBanner`: 상호작용 가능한 배너의 내용 영역에 Scale Feedback을 추가하고, 내부 `Button`·`CloseButton`의 Feedback이 배너의 Feedback과 독립적으로 동작하도록 보완합니다.
  - `Callout.CloseButton`: 누름 상태의 배경색과 배경색 전환을 추가합니다.

### Patch Changes

- fa699aa: 컴포넌트를 누르는 도중 비활성화하면 눌림 상태를 초기화하여, 다시 활성화했을 때 눌림 스타일이 남지 않도록 수정합니다.
- fa699aa: Lynx 상태·press/tap 훅을 독립 패키지로 분리합니다.

  - 기존 `@seed-design/lynx-react`의 훅 import와 Scale Feedback 연동을 유지합니다.
  - 누르는 도중 `disabled`로 바뀌면 pressed 상태를 해제합니다.

- Updated dependencies [fa699aa]
  - @seed-design/lynx-react-use-controllable-state@0.1.0
  - @seed-design/lynx-react-use-press-tap@0.1.0

## 0.7.1

### Patch Changes

- b956124: CSS 로드 순서에 따라 AppBar·Callout 등 Recipe 아이콘의 크기와 색상이 공통 스타일에 덮어써지는 문제를 수정합니다.

## 0.7.0

### Minor Changes

- 5871638: Checkbox, Chip, Progress Circle, Radio Group, Switch의 네이티브 접근성 지원을 확장합니다.

  - 접근성 이름과 속성을 전달할 수 있습니다.
  - 컴포넌트별 역할과 선택·진행·비활성 상태를 기본으로 제공합니다.

- 6201bcb: Lynx Field Button 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:field-button`로 Registry 컴포넌트를 설치할 수 있습니다.

- 2c3a308: Lynx 컴포넌트에 누르는 동안 요소가 축소되는 Scale Feedback을 추가합니다.

  - Action Button
  - Chip
  - Callout
  - Tabs
  - Accordion
  - Checkbox
  - Radio Group
  - Switch
  - Page Banner의 Button·Close Button
  - Select Box
  - Segmented Control

  `ScaleFeedback` 컴포넌트와 `useScaleFeedback` 훅을 제공합니다.
  요소 전체를 축소하는 Self Scale과 내부 콘텐츠만 축소하는 Content Scale을 구성할 수 있습니다.

  `mergeProps` 유틸을 추가하고 컴포넌트의 props 합성에 적용합니다.
  사용자 이벤트와 ref를 내부 동작과 함께 보존하며, Main Thread와 Background Thread의 실행 경계를 유지합니다.

  최소 지원 버전은 Lynx Engine 3.9입니다.

- 3a66eeb: Lynx에서 Reaction Button과 Count 컴포넌트를 사용할 수 있도록 추가했습니다.
- f8db24a: Lynx 플랫폼에 `Menu` 컴포넌트를 추가합니다.
- 441a22e: Lynx용 `SwipeableMenuSheet` 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:swipeable-menu-sheet`로 Registry 컴포넌트를 설치할 수 있습니다.

- 5871638: Segmented Control과 Tabs 항목에 알림 콘텐츠를 배치할 수 있는 `notification` prop을 추가합니다. Tabs Trigger에는 선택된 항목을 다시 누르는 동작도 처리할 수 있도록 `bindtap` prop을 추가합니다.
- 50c7e53: Lynx 컴포넌트의 pressed 색상 피드백을 개선합니다.

  기존 Background Thread의 상태 갱신에 의존하던 pressed 색상 반응을
  Main Thread의 `:active` 기반으로 개선하고, React와 동일한 색상 transition을 적용합니다.
  짧은 탭에서도 색상 피드백이 빠르게 시작됩니다.

  disabled·loading 상태의 입력 제한과 기존 pressed 상태 처리는 유지합니다.

- ce7fcfe: List 컴포넌트의 Lynx 버전을 추가합니다.

  - 정적, 버튼, Checkbox, Radio, Switch 목록 항목과 `ListHeader`를 제공합니다.
  - `npx @seed-design/cli@latest add ui:list`로 Registry 컴포넌트를 설치할 수 있습니다.

### Patch Changes

- 02c08d0: Lynx Checkbox에서 컨트롤과 라벨의 세로 정렬이 어긋나던 문제를 수정합니다.

## 0.6.3

### Patch Changes

- 8c496bd: Lynx 아이콘이 처음 표시될 때 테마 색상을 안정적으로 반영하도록 수정합니다.

## 0.6.2

### Patch Changes

- a5ced0a: Switch 등 controlled 컴포넌트에서 외부 값 변경 후 변경 콜백이 누락되던 문제를 수정합니다. 부모가 변경 요청을 반영하지 않은 경우에도 다음 사용자 입력에서 변경을 다시 요청할 수 있습니다.

## 0.6.1

### Patch Changes

- be66559: Lynx에서 시스템 테마를 전환한 뒤 semantic 색상과 아이콘 tint가 이전 테마 색상으로 남는 문제를 수정합니다.

## 0.6.0

### Minor Changes

- b618d5c: Lynx에 `PageBanner` 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:page-banner`로 Registry 컴포넌트를 설치할 수 있습니다.

- 9070482: Lynx용 Select Box 컴포넌트를 추가합니다.

  Checkbox와 Radio Group 방식의 선택형 카드, 다열 배치, 선택 상태에 따른 Footer 표시를 지원합니다.

  표준 멀티컬러 아이콘을 자동으로 감지해 원본 색상을 유지합니다. 자동 감지되지 않는 아이콘은 `multicolor` 옵션으로 지정할 수 있습니다.

- 174a5a1: Lynx Notification Badge 컴포넌트를 추가합니다.

  - `@seed-design/lynx-react`에서 `NotificationBadge`와 `NotificationBadgePositioner`를 사용할 수 있습니다.
  - `@seed-design/lynx-css/recipes/notification-badge`와 `notification-badge-positioner`에서 스타일 Recipe를 제공합니다.

- 0939477: Lynx용 Segmented Control 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:segmented-control`로 Registry 컴포넌트를 설치할 수 있습니다.

- dd99afe: Lynx용 `MannerTemp`, `MannerTempEmote`, `MannerTempBadge` 컴포넌트를 추가합니다.

## 0.5.2

### Patch Changes

- 844d91c: `TextField.Input`과 `TextField.Textarea`의 native 값이 blur 시 controlled value와 달라지는 문제를 수정합니다.
- 55103a6: Lynx `Radio Group`에서 라디오 표시와 라벨의 상단 여백이 적용되지 않아 수직 정렬이 어긋나던 문제를 수정합니다.
- f446304: Lynx Tabs가 초기 렌더링 시 선택된 탭으로 이동하면서 Label 색상과 Indicator 위치·크기를 전환하던 문제를 수정합니다.

## 0.5.1

### Patch Changes

- f3755b4: Lynx Tabs의 Indicator 위치를 수정합니다.

  - Android에서 선택한 탭으로 Indicator가 이동하지 않는 문제를 수정합니다.
  - `triggerLayout="hug"`에서 Indicator가 List의 좌측 gutter와 어긋나는 문제를 수정합니다.

## 0.5.0

### Minor Changes

- 6af8a34: Lynx에서 Divider를 사용할 수 있도록 컴포넌트와 공개 API를 추가합니다.
- ff225ee: Lynx에 `Callout` 컴포넌트를 추가합니다.

  - `neutral`, `informative`, `positive`, `warning`, `critical`, `magic` tone을 지원합니다.
  - actionable 및 controlled/uncontrolled dismiss 동작을 지원합니다.
  - `npx @seed-design/cli@latest add ui:callout`로 Registry 컴포넌트를 설치할 수 있습니다.

- bd5cd3b: Lynx용 Accordion 컴포넌트를 추가합니다.

  - controlled 및 uncontrolled 상태와 단일·다중 펼치기를 지원합니다.
  - 콘텐츠 높이를 측정해 펼치고 접을 때 height transition을 적용합니다.
  - `inline`, `separated` variant와 `medium`, `large` size를 제공합니다.
  - Trigger에 펼침 상태와 비활성 상태를 전달하는 Lynx 접근성 속성을 제공합니다.

- 6f6c626: Lynx용 Tabs 컴포넌트를 추가합니다.

  - 탭 선택과 콘텐츠 좌우 스와이프를 지원합니다.
  - 제어형·비제어형 상태, disabled 탭, 균등·콘텐츠 기반 너비, 이동하는 Indicator를 제공합니다.
  - `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`, `Tabs.Carousel` API로 구성할 수 있습니다.

- ca0931b: Lynx Checkbox의 ghost 상태 전환을 안정화합니다.

  - 선택 해제 시 배경이 순간적으로 어두워지는 현상을 수정합니다.
  - 선택 상태가 변경될 때 아이콘 색상이 즉시 반영되도록 개선합니다.
  - `@seed-design/lynx-react`와 `@seed-design/lynx-css`를 함께 업데이트해야 합니다.

- aef119e: Bottom Sheet의 content 최대 너비를 480px로 맞춥니다.

  - 넓은 뷰포트에서 시트가 화면 폭 전체로 늘어나지 않고 480px에서 멈추며 가운데 정렬됩니다. 480px보다 좁은 화면에서는 기존과 동일하게 화면을 채웁니다.
  - `BottomSheetContent`가 시트를 왼쪽에 고정하던 인라인 `left` 값을 풀어, 폭이 제한됐을 때 좌우 여백이 같게 배치됩니다. `style`로 `left`를 직접 지정하면 그 값이 우선합니다.

## 0.4.1

### Patch Changes

- 598cd3a: iOS에서 `TextFieldTextarea`의 첫 입력 시 자동 높이가 세로 여백만큼 불필요하게 늘어나는 문제를 수정합니다.
- fdf4575: Lynx `TagGroup`의 문자열 구분자 앞뒤 공백을 제거해 브라우저 프리뷰와 네이티브 Lynx에서 항목 간격이 다르게 보이는 문제를 수정합니다.
- 5a7ca99: iOS에서 `TextFieldTextarea`의 자동 높이 영역을 눌렀을 때 포커스가 해제되어 키를 입력할 수 없는 문제를 수정합니다.
- 554cca0: iOS에서 `VStack`과 `HStack`의 `gap`에 SEED 간격 토큰을 사용하면 간격이 사라지는 문제를 수정합니다.
- 21aa395: Lynx `ProgressCircle`의 indeterminate 상태가 첫 화면부터 표시되도록 수정합니다.

## 0.4.0

### Minor Changes

- ebb4eae: Lynx 입력 폼 컴포넌트를 추가합니다.

  - `Field`, `TextField`, `KeyboardAvoidingScrollView`를 제공합니다.
  - `TextField.Input`과 `TextField.Textarea`에서 native 입력, controlled value, grapheme 단위 글자 수 제한을 지원합니다.
  - `TextField.Textarea`는 내용에 따른 자동 높이 조절을 지원합니다.
  - `KeyboardAvoidingScrollView`는 focus된 입력과 Field footer가 키보드에 가려지지 않도록 스크롤합니다.
  - `npx @seed-design/cli@latest add ui:text-field`로 조합된 snippet을 설치할 수 있습니다.

  ```tsx
  <KeyboardAvoidingScrollView>
    <TextField label="소개" maxGraphemeCount={80}>
      <TextFieldTextarea accessibility-label="소개" />
    </TextField>
  </KeyboardAvoidingScrollView>
  ```

## 0.3.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 0.3.0

### Minor Changes

- 2ad8e8c: (BREAKING CHANGE: `@lynx-js/react`를 `0.117.0` 이상으로 업그레이드해야 합니다.) 테마 변경에 반응하는 `useSeedClassName` 훅을 추가합니다.

  - root `<page>`에서 `getSeedClassName()` 대신 `useSeedClassName()`을 사용하면, host가 `lynx.__globalProps.theme`을 변경할 때 자동으로 리렌더되어 테마가 즉시 반영됩니다.
  - `getSeedClassName()` 순수 함수는 그대로 유지됩니다. 테마 변경에 반응할 필요가 없는 정적 컨텍스트에서 계속 사용할 수 있습니다.
  - `useGlobalProps()`에 의존하므로 `@lynx-js/react` `0.117.0` 이상이 필요합니다.

  ```tsx
  import { useSeedClassName } from "@seed-design/lynx-react";

  function Root() {
    const seedClassName = useSeedClassName({ colorMode: "system" });
    return (
      <page className={seedClassName}>
        <App />
      </page>
    );
  }
  ```

## 0.2.0

### Minor Changes

- c8d4c26: Lynx AppBar 컴포넌트를 추가합니다.

  - `AppBar.Root`, `AppBar.Left`, `AppBar.Main`, `AppBar.Right`, `AppBar.IconButton` 등 compound API를 제공합니다.
  - `SystemInfo.platform`에 따라 Android에서는 `android`, 그 외 플랫폼에서는 `cupertino` theme을 기본으로 적용합니다.
  - `theme` prop으로 platform 기본값을 수동 override할 수 있습니다.

- f039fb3: native element의 접근성 속성을 표준화한 `LynxAccessibilityProps` 타입을 추가했습니다. 컴포넌트가 이 타입을 확장해 `accessibility-label`/`accessibility-role-description`/`accessibility-value`/`accessibility-elements-hidden` 등을 받아 native element에 전달할 수 있습니다.
- 26d3517: Lynx Badge 컴포넌트를 추가합니다.

  - `@seed-design/lynx-react`에서 `Badge`를 직접 import해 사용할 수 있습니다.
  - `@seed-design/lynx-css/recipes/badge`에서 Badge recipe 스타일을 제공합니다.

  ```tsx
  import { Badge } from "@seed-design/lynx-react";

  <Badge tone="positive" variant="weak">
    거래 가능
  </Badge>;
  ```

### Patch Changes

- 4e2ee69: Lynx BottomSheet가 앱 셸 위에 안정적으로 표시되고, 본문 스크롤 제스처를 내부에서 처리하도록 개선합니다.

  - BottomSheet overlay의 기본 `z-index`를 높여 앱바 같은 상단 영역까지 backdrop이 덮이도록 수정합니다.
  - `BottomSheetBody`가 세로 스크롤 영역으로 렌더링되어 본문을 스크롤할 때 뒤쪽 화면이 함께 스크롤되는 문제를 방지합니다.
  - 스크롤 가능한 BottomSheet에서는 `BottomSheetRoot`의 `handleOnly`를 함께 사용할 수 있습니다.
  - BottomSheet handle의 드래그 target size를 보이는 handle보다 크게 보장합니다.

## 0.1.0

### Minor Changes

- 699af2c: SEED Design Lynx의 첫 stable 버전을 릴리즈합니다.

  - `@seed-design/lynx-css`: Lynx 환경에서 사용할 수 있는 SEED 디자인 토큰, base CSS, component recipe CSS를 제공합니다.
  - `@seed-design/lynx-react`: Lynx용 SEED React 컴포넌트와 hook을 제공합니다.
    - 컴포넌트: `ActionButton`, `BottomSheet`, `Box`, `Checkbox`, `HStack`, `ProgressCircle`, `RadioGroup`, `Switch`, `TagGroup`, `Text`, `VStack`
    - Hook: `useControllableState`, `useIconColor`, `usePressTap`, `useSafeArea`
    - Safe Area: `useSafeArea` API로 `env(safe-area-inset-*)`와 host 앱의 `lynx.__globalProps` fallback을 함께 지원합니다.
  - `@seed-design/cli`: Lynx framework 감지, registry snippet 추가, compatibility check, docs lookup 흐름을 지원합니다.
