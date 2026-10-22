# @seed-design/lynx-css

## 1.0.1

### Patch Changes

- bf95a13: `Chip`, `ChipTabs`, `ReactionButton`, `Badge`의 outline 테두리가 번져 보이는 문제를 수정합니다. 테두리를 실제 border로 그리고 padding을 보정해 기존 크기를 유지합니다.
- 4879cff: Android에서 indeterminate `ProgressCircle`의 원호가 항상 반 바퀴 이상으로 그려지고 양 끝의 둥근 cap이 보이지 않던 문제를 수정합니다.

## 1.0.0

### Major Changes

- 524ad2f: (BREAKING CHANGE: `ProgressCircle.Root`와 `ProgressCircle.Range`를 직접 조합한다면 그 사이에 `<ProgressCircle.Track />`을 추가해야 트랙이 보입니다. `seed-progress-circle__root--tone_*` CSS 선택자는 `seed-progress-circle__track--tone_*`로 옮겨야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:progress-circle`과 `npx @seed-design/cli@latest add ui:quantity-picker`로 다시 설치해야 합니다.)
  
  `ProgressCircle`의 배경 트랙을 React와 같이 별도 `ProgressCircle.Track` 파트로 그립니다.
  
  - 이전에는 `Root`가 tone에 맞는 배경색으로 트랙을 직접 그렸습니다. 이제 `Root`는 트랙을 그리지 않고, `Track`이 진행률과 관계없이 전체 링을 tone의 트랙 색으로 그립니다.
  - tone별 트랙 색은 `Track` 요소에 적용되므로 tone class가 `seed-progress-circle__root--tone_*`에서 `seed-progress-circle__track--tone_*`로 바뀝니다.
  - `Track`에 `className`·`style`을 지정해 트랙만 따로 꾸밀 수 있습니다.
- 20d639c: (BREAKING CHANGE: `MenuSheet.List`나 `.seed-menu-sheet__list`로 그룹 배치(flex·gap)를 바꾸고 있었다면 `.seed-menu-sheet__listContent`를 덮어쓰거나 그룹을 직접 감싼 view로 옮겨야 합니다. `AlertDialog.Content`의 `className`·`style`로 자식 배치를 바꾸고 있었다면 자식을 직접 감싼 view로 옮겨야 합니다. `BottomSheet.Body` 안에 `scroll-view`를 두어 긴 내용을 스크롤하고 있었다면 그 `scroll-view`를 빼고 내용을 `Body`에 바로 넣고, 높이 제한은 `Body`의 `maxHeight`로 옮기고, `Body`에 준 `flex: "none"`은 지워야 합니다. `Body`의 `className`·`style`로 자식 배치를 바꾸고 있었다면 `.seed-bottom-sheet__scrollContent`를 덮어쓰거나 자식을 직접 감싼 view로 옮겨야 하고, `Body` 안의 `ScrollFog`에 `height: "100%"`를 주고 있었다면 고정 높이로 바꿔야 합니다.) 화면 끝을 기준으로 위치를 잡는 Lynx 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop은 그대로 화면 전체를 덮습니다.
  
  - `Dialog`·`AlertDialog`·`BottomSheet`·`MenuSheet`는 좌우 inset을 뺀 영역의 가운데에 놓입니다. `Dialog`의 기본 너비(90%)는 그 영역을 기준으로 계산합니다.
  - `Dialog`·`AlertDialog`는 위아래 inset도 피합니다. `Dialog`의 최대 높이는 화면 높이의 80%와 위아래 inset 사이 높이 중 작은 쪽입니다.
  - `AlertDialog.Content`는 자식을 세로 `scroll-view` 안에 렌더해서, 내용이 최대 높이를 넘으면 안에서 스크롤합니다. `Content`에 준 `className`·`style`은 이 `scroll-view`를 감싼 바깥 view에 적용됩니다.
  - 내용에 맞춰 높이가 정해지는 `BottomSheet`·`MenuSheet`는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 제한에 닿으면 `BottomSheet.Body`가 스크롤됩니다.
  - `BottomSheet.Body`는 자식을 세로 `scroll-view` 안에 렌더해서, 내용이 넘치면 `Body`만 스크롤합니다. `Body`에 준 `className`·`style`은 이 `scroll-view`를 감싼 바깥 view에 적용되고, 자식 배치는 새 `scrollContent` 슬롯이 맡습니다. `Body`가 스크롤된 상태에서 시작한 제스처는 `Body`만 움직이고, `Body`가 맨 위일 때 아래로 끌어야 시트가 움직입니다.
  - `MenuSheet.List`는 `scroll-view`로 렌더해서, 항목이 넘치면 목록만 스크롤하고 헤더와 닫기 버튼은 줄이지 않습니다. `List`의 `className`·`style`·`ref`는 이 `scroll-view`에 적용되고, 그룹 배치는 새 `listContent` 슬롯이 맡습니다. 목록이 스크롤된 상태에서 시작한 제스처는 목록만 움직이고, 목록이 맨 위일 때 아래로 끌어야 시트가 움직입니다.
- 4f1c681: (BREAKING CHANGE: `MenuSheet.Item`을 직접 조합한다면 `menuSheetItem().divider` 요소를 `menuSheetItem().root` 요소의 다음 형제에서 마지막 자식으로 옮겨야 합니다.)
  
  `MenuSheet` 구분선을 각 Item 바깥에서 안쪽 하단에 겹쳐 표시하도록 변경해, Item 배경과 올바른 대비를 유지합니다.
- f417a4f: (BREAKING CHANGE: `--z-index-app-bar`를 제거하고 `.seed-app-bar__root` 또는 `AppBar.Root`에 `z-index`를 직접 지정해야 합니다.)
  
  `AppBar`가 scroll container 안에서 배경과 좌우 버튼을 함께 스크롤하도록 자체 stacking context를 만듭니다.
  
  - 이전에는 `--z-index-app-bar`로 쌓임 순서를 조정했지만, 이제 이 변수는 사용하지 않고 Root의 `z-index`를 직접 적용합니다.
- f164f8b: (BREAKING CHANGE: `badge({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `Badge`에 눌림 효과가 필요하면 `ScaleFeedback`을 별도로 적용해야 합니다.)
  
  `Badge.Action`의 눌림 축소 효과를 recipe의 `pressed` variant 대신 실제 눌림 동작에 맞춰 적용합니다.
  
  - 이전에는 `pressed` variant와 그 class로 축소를 지정했지만, 이제 recipe에서 이 variant와 class를 제거합니다.
  - `Badge.Action` 컴포넌트는 눌렀을 때 자동으로 축소되며, `GlobalProps.motion="reduced"`이면 축소되지 않습니다.
- d4a20aa: (BREAKING CHANGE: `InputButton.*`와 `InputButtonRoot`·`InputButtonRootProps` 등 `InputButton*` export를 `FieldButton*`으로 변경해야 합니다. 직접 사용한 `input-button` Recipe와 `seed-input-button__*` class도 `field-button` 이름으로 변경해야 합니다. Registry `ui:field-button`은 `npx @seed-design/cli@latest add ui:field-button`으로 다시 설치하고 `inputButtonRef`를 `controlRef`로 변경해야 합니다.)
  
  Lynx 선택값 필드의 이름을 `InputButton`에서 `FieldButton`으로 변경하며, 기존 스타일 값은 유지합니다.
  
  - 컴포넌트와 Props 타입의 `InputButton*` export를 제거하고 `FieldButton*` export를 제공합니다.
  - Recipe 경로는 `@seed-design/lynx-css/recipes/input-button`에서 `@seed-design/lynx-css/recipes/field-button`으로 바뀝니다.
  - Recipe의 `inputButton`·`inputButtonVariantMap`·`inputButtonVariantKeys`와 `InputButtonVariantProps`·`InputButtonSlotName`도 각각 `fieldButton*`·`FieldButton*` 이름으로 바뀌며, class는 `seed-field-button__*`로 생성됩니다.
  - Registry wrapper가 버튼 ref를 받는 prop은 `inputButtonRef`에서 `controlRef`로 바뀝니다.
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
- 46ecb70: (BREAKING CHANGE: `ScrollFog` 안의 콘텐츠를 직접 `<scroll-view scroll-orientation="vertical">` 또는 `<scroll-view scroll-orientation="horizontal">`로 감싸야 합니다. 자식이 이미 스크롤을 처리하면 추가로 감싸지 않습니다. `hideScrollBar` 대신 자식 `<scroll-view>`에 `scroll-bar-enable={false}`를 지정하고, `placement`에는 세로 또는 가로 한 축의 방향만 지정해야 합니다. `@seed-design/lynx-css/recipes/scroll-fog`를 직접 사용한다면 제거된 `verticalScroll`·`horizontalScroll` slot에 의존하는 코드를 삭제해야 합니다.)
  
  `ScrollFog`를 스크롤 영역과 가장자리 mask를 함께 제공하던 컴포넌트에서 mask만 제공하는 컴포넌트로 변경합니다.
  
  - 내부 `<scroll-view>`와 `hideScrollBar` prop을 제거합니다. 스크롤 ref·이벤트·스크롤바는 자식 스크롤 영역에서 제어합니다.
  - `placement`는 세로 또는 가로 한 축만 지원합니다.
  - `scroll-fog` Recipe의 `verticalScroll`·`horizontalScroll` slot을 제거합니다.
- a1881c3: (BREAKING CHANGE: `select-trigger`·`select-item` Recipe를 직접 조합했다면 콘텐츠를 `scaleContent` slot으로 감싸고, `root`에 지정한 콘텐츠 간격과 직접 자식 selector를 새 slot에 맞게 수정해야 합니다.)
  
  `Select.Trigger`와 `Select.Item`에 배경과 분리된 콘텐츠 눌림 효과를 추가합니다.
  
  - 이전에는 콘텐츠가 `root`의 직접 자식이었습니다. 이제 새 `scaleContent` slot 안에 배치되며, 누르면 배경을 유지한 채 콘텐츠만 축소합니다.
  - 크기별 `gap`은 `root`에서 `scaleContent`로 이동합니다.
  - `@seed-design/lynx-react`의 styled 컴포넌트는 기존 children 조합을 그대로 사용할 수 있습니다.
- e5ebfb1: (BREAKING CHANGE: `Select.Content`를 `Select.Positioner > Select.Content > Select.ScrollArea`로 감싸고, 기존 native overlay 동작이 필요하면 `Select.Positioner`에 실제 native container 이름을 `container`로 지정해야 합니다. `select` Recipe의 `backdrop` slot을 직접 사용했다면 바깥 탭 영역을 `Select.Positioner`로 옮겨야 합니다. Registry 사용자는 `npx @seed-design/cli@latest add ui:select`로 재설치해야 합니다.)
  
  `Select`의 선택 목록을 기본 native overlay에서 Lynx view 안의 고정 레이어로 변경하고, 레이어와 스크롤 영역을 별도 파트로 분리합니다.
  
  - 이전에는 `Content`가 레이어와 스크롤 영역을 함께 제공했습니다. 이제 `Positioner`가 레이어와 바깥 탭 영역을, `ScrollArea`가 스크롤 영역을 담당합니다.
  - `container`를 지정하지 않으면 Android 뒤로 가기로 목록이 아닌 host 화면을 닫으며, `onOpenChange`에 `dismiss` reason을 전달하지 않습니다. native container를 지정하면 기존 동작을 사용할 수 있습니다.
  - `select` Recipe의 `backdrop` slot을 제거합니다.
- 524ad2f: (BREAKING CHANGE: thumb·tick·marker의 위치를 직접 지정했다면 `--slider-thumb-offset`·`--slider-tick-offset`·`--slider-marker-offset`을 각각 `--slider-thumb-offset-ratio`·`--slider-tick-offset-ratio`·`--slider-marker-offset-ratio`로 변경하고, 픽셀 값 대신 thumb 크기에 곱할 비율을 사용해야 합니다. `--slider-marker-color`는 marker의 `color` 스타일로 변경해야 합니다. Track을 Root보다 좁게 배치했다면 Root와 Track의 가로 범위를 맞추거나 변경된 드래그 범위를 확인해야 합니다.)
  
  슬라이더의 위치 보정을 측정한 픽셀 값에서 thumb 크기에 곱하는 비율로 바꿔, 첫 표시 뒤 thumb 위치가 움직이던 문제를 해결합니다.
  
  - thumb·tick·marker는 각각 `--slider-*-offset-ratio`를 제공합니다. 직접 작성한 스타일에서는 `left: calc(var(--slider-thumb-left) + <thumb 크기> * var(--slider-thumb-offset-ratio))`처럼 크기와 비율을 곱합니다. Value Indicator의 픽셀 위치 보정 변수는 유지합니다.
  - marker 색은 더 이상 `--slider-marker-color`를 읽지 않고 Recipe의 상태별 색을 사용합니다.
  - 드래그 좌표는 이전의 `Slider.Track` 대신 `Slider.Root`의 가로 범위를 기준으로 계산합니다.
- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.
- ee36625: (BREAKING CHANGE: `Checkbox.Root`의 `pressed`, `checkmark({ pressed })`의 `pressed`, `checkmarkVariantMap.pressed` 사용을 제거해야 합니다. `checkmark` Recipe로 ghost mark를 직접 조합한다면 기존 `background`와 함께 `selectedBackground` slot도 렌더링해야 합니다.)
  
  Checkbox의 눌림 색상을 `pressed` prop과 Recipe variant 대신 Root의 `:active` 상태로 적용합니다.
  
  - ghost mark는 이전에 하나의 `background`로 선택 여부에 따른 눌림 배경을 그렸지만, 이제 미선택용 `background`와 선택·indeterminate용 `selectedBackground`를 따로 사용합니다.
- 5769ae6: (BREAKING CHANGE: `reactionButton({ pressed })`의 `pressed`와 `reactionButtonVariantMap.pressed` 사용을 제거해야 합니다.)
  
  `reaction-button` Recipe의 눌림 색상을 `pressed` variant 대신 `:active` 상태로 적용합니다.
  
  - 선택 여부에 따른 눌림 색은 그대로 제공하며, `ReactionButton` 컴포넌트의 선택 상태를 제어하는 `pressed` prop도 유지합니다.
- ac07387: (BREAKING CHANGE: `segmentedControl({ pressed })`에서 `pressed`를 제거하고, 직접 조합한 `SegmentedControl`에는 `itemSelectedBackground` slot을 추가해야 합니다.)
  
  Lynx `SegmentedControl`의 눌림 배경을 선택 상태별로 분리해, 선택이 바뀌는 순간 사라지는 배경의 색도 바뀌던 문제를 수정합니다.
  
  - 이전에는 하나의 `itemBackground`에서 선택 상태에 따라 눌림 색을 바꿨지만, 이제 미선택용 `itemBackground`와 선택용 `itemSelectedBackground`에 각각 색을 고정합니다.
  - `pressed` Recipe variant를 제거하고, Item의 `:active` 상태에서 선택 여부에 맞는 배경을 표시합니다.

### Minor Changes

- 7f51d06: Lynx `ContentPlaceholder`와 React에 대응하는 12개 프리셋을 추가합니다.
  
  - `Root`·`Asset`과 Registry snippet으로 비어 있는 콘텐츠 영역을 구성합니다.
  - 필요한 프리셋만 개별 경로에서 import해 `preset`으로 전달하며, 사용하지 않는 프리셋은 번들에 포함하지 않습니다.
  - 프리셋은 React SVG와 SEED 토큰에서 생성한 테마별 WebP로 표시하며, 표시 후 색을 덮어쓰지 않습니다.
  - 커스텀 아이콘·이미지는 크기와 정렬만 적용합니다. 모노크롬 아이콘의 색은 `tint-color`로 직접 지정합니다.
- 39d5917: 세로로 드래그하여 항목을 선택하는 Lynx `WheelPicker`를 추가합니다.
  
  - `WheelPicker.Root`·`WheelPicker.Column`·`WheelPicker.ItemLabel`로 여러 열을 조합하고, 각 `Column`의 `options`·`value`·`defaultValue`·`onValueChange`로 선택값을 관리합니다.
  - `loop`로 항목을 반복하고, `onIndexChange`로 조작 중 지나가는 항목을 확인할 수 있습니다.
  - `valueChangeBehavior`로 외부 선택값 변경 시 이동 방식을, `renderLabel`로 항목 표시를 지정합니다. `@seed-design/lynx-css/recipes/wheel-picker` Recipe를 제공합니다.
  - 접근성 이름은 각 `Column`의 `accessibility-label`로 지정합니다. 키보드·포커스 탐색은 지원하지 않습니다.
- 34e7691: Lynx `AppBar.IconButton`에 눌림 배경색과 배경색 전환을 추가해 버튼을 누르는 상태를 구분할 수 있도록 합니다. 이전에는 눌러도 배경이 투명했고 모서리 반경은 `r1`이었습니다. 이제 누르는 동안 눌림 배경색을 표시하고 모서리 반경은 `r2`로 적용합니다.
- b7cad68: Lynx `PullToRefresh` 컴포넌트를 추가합니다.
  
  - `PullToRefresh.Root`·`Indicator`·`Content`와 `onPtrRefresh`로 콘텐츠를 당겨 새로고침하고 당긴 정도를 표시할 수 있습니다.
  - 앱의 `pluginReactLynx` 설정에 `enableNewGesture: true`를 추가해야 합니다.
  - `npx @seed-design/cli@latest add ui:pull-to-refresh`로 Registry 컴포넌트를 설치할 수 있습니다.
  - 스타일 없이 조합하려면 `@seed-design/lynx-react-pull-to-refresh`를 사용합니다.
- 524ad2f: Lynx `SegmentedControl.Indicator`가 처음 표시될 때 서서히 나타나던 문제를 수정해, 초기 선택 위치에 바로 표시하고 이후 선택 변경에만 전환 효과를 적용합니다.
  
  - 직접 조합한 `Indicator`는 새 `transitionEnabled` variant로 전환 효과를 켜고 끌 수 있습니다. 초기 배치에는 `false`를 사용하고 이후 선택 변경부터 `true`로 전환할 수 있습니다.
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

- 7dae990: Lynx `SegmentedControl`의 폭이 항목 최소 폭보다 좁을 때 선택 Indicator가 선택 항목과 어긋나던 문제를 수정합니다.
  
  - 항목을 더 좁게 써야 하면 Root `style`에서 `--segment-min-width`를 지정합니다. Item과 Indicator에 같은 최소 폭이 적용됩니다.
- 7dae990: Lynx `Tabs`를 스와이프할 때 Android logcat에 `illegal css key` 오류가 반복되던 문제를 수정합니다.
  
  - Headless `Tabs.Indicator`는 `--tabs-indicator-x`·`--tabs-indicator-width` 변수 대신 inline `transform`·`width`(px)로 위치와 폭을 지정합니다.
- 7dae990: Lynx `AttachmentField` 항목이 다시 배치될 때 폭이 줄어들어 썸네일이 보이지 않던 문제를 수정합니다.
- 3b4d190: Lynx `FloatingActionButton.Label`의 축소·확장 전환에서 Label이 사라지거나 줄바꿈·잘림이 발생하던 문제를 수정합니다.
  
  - 이전에는 `extended={false}`일 때 Label을 제거했습니다. 이제 Label을 유지하고 opacity로 숨기거나 표시합니다.
  - Label은 전환 중에도 한 줄을 유지하며, 기존처럼 접근성 트리에서 숨깁니다.
- 26bf8c3: `List`와 `SelectBox`의 체크박스·라디오 마크가 세로 가운데에 놓이지 않던 문제를 수정해 콘텐츠와 중앙 정렬합니다.
- eb01c01: Lynx `Tabs.Indicator`가 하단 stroke 위에 떠 있던 문제를 수정하여 stroke와 겹치도록 1px 아래에 배치합니다. 이를 보정하려고 지정한 `bottom: -1px`은 제거해야 합니다.
- 524ad2f: `Slider.ValueIndicatorLabel`에 `\n`으로 나눈 여러 줄 텍스트를 지정했을 때 내용이 잘리던 문제를 수정해 모든 줄이 표시되도록 합니다.
- e056828: Lynx `AttachmentField`와 `AttachmentDisplayField`의 `readOnly` 상태에서 삭제 아이콘에 비활성 색상이 적용되지 않던 문제를 수정합니다.
- e056828: `ProgressCircle`의 indeterminate 상태와 `QuantityPicker`의 loading 상태가 매 프레임 JavaScript에서 스타일을 갱신해 CPU 사용과 DevTool 로그가 늘어나던 문제를 수정합니다.
- 524ad2f: `BottomSheet.Body`가 남는 높이를 모두 차지하던 문제를 수정해 콘텐츠 높이만큼 배치합니다.
- 524ad2f: `AttachmentInput`과 `AttachmentDisplay`의 삭제 버튼을 눌렀을 때 scale 피드백이 표시되지 않던 문제를 수정해, 누르는 동안 버튼이 축소되도록 합니다.
- 7dae990: Lynx `SelectBox` 항목이 좁은 폭에서 라벨과 설명이 겹치거나 잘리던 문제를 수정합니다.
- 7dae990: Lynx `BottomSheet`의 snap point 레이아웃을 수정합니다.
  
  - host가 화면 높이를 전달하지 않아도 기기 화면 높이로 퍼센트 snap point를 계산합니다. 이전에는 500px을 기준으로 계산했습니다.
  - 공간이 부족할 때 Header·Footer는 줄어들지 않고 Body만 줄어들어 제목·설명이 겹치지 않습니다.
- 7dae990: Android에서 Lynx `Tabs.Indicator`가 하단 stroke 영역에서 잘려 iOS보다 얇게 보이던 문제를 수정합니다.
- 7dae990: Lynx `Callout`의 인라인 링크에 밑줄이 표시되지 않던 문제를 수정합니다.
- 26fa233: Lynx `AttachmentInput`·`AttachmentDisplay`의 마지막 항목에서 삭제 버튼이 잘리던 문제를 수정해, 항목 영역 밖으로 나온 버튼도 온전히 표시합니다.

## 0.14.2

### Patch Changes

- 0201acc: (사용자 변경사항 없음) Bottom Sheet와 Menu Sheet의 `maxHeightFraction` 컴포넌트 변수를 생성 산출물에 추가합니다.
- 594a7e1: Page Banner 닫기 버튼의 solid 톤 아이콘이 팔레트 색상을 직접 참조하던 문제를 수정합니다. 이제 Page Banner 본문과 같은 `$color.fg.on-*-solid` 토큰을 참조하며, 렌더링되는 색상은 바뀌지 않습니다.

## 0.14.1

### Patch Changes

- 6ecd04e: `$color.bg.neutral-solid-muted`와 `$color.bg.neutral-solid-muted-pressed`를 deprecated로 표시합니다.
  
  - 기존 사용처의 하위 호환성을 위해 두 토큰과 이에 대응하는 CSS 변수를 유지하며, 각 패키지의 다음 major 버전에서 제거할 예정입니다.

## 0.14.0

### Minor Changes

- 19ecbd6: (BREAKING CHANGE: Badge의 기본 최대 너비로 긴 라벨을 말줄임하고 있었다면 최대 너비를 직접 지정해야 합니다.) Badge 스타일에 Prefix와 Action을 추가하고 기본 최대 너비를 제거합니다.
  
  - Badge 스타일에 `prefix`, `action` slot(`.seed-badge__prefix`, `.seed-badge__action`)을 추가합니다.
  - Badge에 기본으로 적용되던 최대 너비(`size="medium"` 7.5rem, `size="large"` 6.75rem)를 제거합니다.
- d3edadf: Solid 배경 위에 쓰는 전경색 토큰을 추가하고, SEED 컴포넌트가 이 토큰을 사용하도록 변경합니다.
  
  - `$color.fg.on-brand-solid`, `$color.fg.on-critical-solid`, `$color.fg.on-informative-solid`, `$color.fg.on-neutral-solid`, `$color.fg.on-positive-solid`, `$color.fg.on-warning-solid`를 추가합니다.
  - Solid 배경을 사용하는 컴포넌트가 팔레트 색상이나 `$color.fg.neutral-inverted` 대신 새 전경색 토큰을 참조하도록 변경합니다. 기존과 값이 같아 화면은 그대로이며, Action Button `variant="neutralSolid"`의 로딩 인디케이터 색만 다크 모드에서 달라집니다.
  - `$color.fg.neutral-inverted`는 기존 사용처의 하위 호환성을 위해 deprecated 상태로 유지하며, 각 패키지의 다음 major 버전에서 제거할 예정입니다.
- 5e34f78: SEED 컴포넌트가 `$color.bg.neutral-inverted` 대신 같은 값의 `$color.bg.neutral-solid`를 사용하도록 변경하고, `$color.bg.neutral-inverted`와 `$color.bg.neutral-inverted-pressed`를 deprecated로 표시합니다.
  
  - `@seed-design/react`의 Date Picker를 포함한 기존 사용처는 같은 색상 값을 가진 `$color.bg.neutral-solid`를 사용합니다.
  - 기존 사용처의 하위 호환성을 위해 `$color.bg.neutral-inverted`, `$color.bg.neutral-inverted-pressed`와 이에 대응하는 CSS 변수를 유지하며, 각 패키지의 다음 major 버전에서 제거할 예정입니다.
- 66c3bd9: (BREAKING CHANGE: `$color.bg.layer-fill`을 같은 값의 `$color.bg.neutral-muted`로 교체해야 합니다.) deprecated 상태였던 `$color.bg.layer-fill`을 제거하고 같은 값의 `$color.bg.neutral-muted`를 추가합니다.
  
  - `$color.bg.neutral-muted`는 라이트 모드에서 `gray-100`, 다크 모드에서 `gray-200`으로, 기존 `$color.bg.layer-fill`과 값이 같습니다.
  - `--seed-color-bg-layer-fill`을 `--seed-color-bg-neutral-muted`로, `vars.$color.bg.layerFill`을 `vars.$color.bg.neutralMuted`로 교체하세요.
  - CSS 변수를 직접 쓴 코드나 `bg="bg.layerFill"` 같은 style prop 값은 에러 없이 배경색만 사라지므로 문자열로 검색해 확인하세요.
- ebdc295: (BREAKING CHANGE: `$color.bg.neutral-solid`를 직접 사용하는 화면에서 라이트·다크 모드의 배경색과 전경색 대비를 확인해야 합니다.) Neutral Solid 배경 색상과 이를 사용하는 컴포넌트 스타일을 변경합니다.
  
  - `$color.bg.neutral-solid`를 라이트 모드에서는 `gray-1000`에서 `gray-900`으로, 다크 모드에서는 `gray-300`에서 `gray-1000`으로 변경합니다.
  - 눌린 상태에 사용할 `$color.bg.neutral-solid-pressed`를 추가합니다.
  - Neutral Solid 스타일을 사용하는 컴포넌트가 `$color.bg.neutral-solid`와 `$color.bg.neutral-solid-pressed`를 참조하도록 변경합니다.
- 66c3bd9: 표면과 같은 색상의 `$color.bg.neutral-subtle` 토큰을 추가합니다.
  
  - 라이트 모드에서 `gray-00`, 다크 모드에서 `gray-100`을 사용하며, 회색 표면 위에서 주변과 구분되는 영역에 사용합니다.
  - Tailwind에서는 `bg-neutral-subtle` 색상으로 사용할 수 있습니다(예: `bg-bg-neutral-subtle`).
- 19ecbd6: (사용자 변경사항 없음) deprecated 컴포넌트인 Control Chip과 Inline Banner의 내부 컴포넌트 변수를 제거합니다.

### Patch Changes

- 78f0bc1: (사용자 변경사항 없음) 내부에서 사용하는 Popover 컴포넌트 변수를 추가합니다.

## 0.13.0

### Minor Changes

- cb4c4a1: Top Navigation 높이를 iOS·Android 모두 56px로 통일합니다. `theme=cupertino` App Bar와 App Screen의 높이가 44px에서 56px로 바뀝니다.

## 0.12.1

### Patch Changes

- 6288304: Lynx의 기본 rem 기준 차이로 간격과 글자 크기가 웹보다 작게 표시되던 문제를 수정합니다. 공통 base 스타일의 root `font-size`를 16px로 설정합니다.

## 0.12.0

### Minor Changes

- fa699aa: Lynx에 Attachment Field와 Attachment Display Field를 추가합니다. 호스트 네이티브 파일 선택 연동, 파일 검증, 업로드 상태 표시와 첨부 항목 관리를 지원합니다.
- fa699aa: Dialog와 Alert Dialog 컴포넌트를 추가합니다.

  - Dialog와 Alert Dialog 콘텐츠는 열릴 때 opacity와 scale 애니메이션을 제공하고, 닫힐 때 opacity로 사라집니다.
  - Alert Dialog는 중요한 작업에 대한 사용자 확인 흐름을 제공하며 기본적으로 backdrop 탭으로 닫히지 않습니다.

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

## 0.11.1

### Patch Changes

- b956124: CSS 로드 순서에 따라 AppBar·Callout 등 Recipe 아이콘의 크기와 색상이 공통 스타일에 덮어써지는 문제를 수정합니다.

## 0.11.0

### Minor Changes

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

## 0.10.2

### Patch Changes

- 7b6479f: Lynx `TextField`의 placeholder가 활성 및 비활성 상태에 맞는 색상 토큰을 사용하도록 수정합니다.

## 0.10.1

### Patch Changes

- be66559: Lynx에서 시스템 테마를 전환한 뒤 semantic 색상과 아이콘 tint가 이전 테마 색상으로 남는 문제를 수정합니다.

## 0.10.0

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

- 45b827b: `$gradient.fade-mask` 토큰을 추가하고, ScrollFog의 fog 마스크를 easing 그라데이션으로 개선합니다.

  - `$gradient.fade-mask`(`--seed-gradient-fade-mask`)를 추가합니다. 콘텐츠를 부드럽게 가리는 마스크용 불투명도(alpha) easing 곡선이며, 라이트/다크 테마에서 동일합니다.
  - ScrollFog의 가장자리 페이드가 기존 선형 2단계에서 16단계 easing 곡선으로 바뀌어 더 부드럽게 표현됩니다.
  - ScrollFog spec의 `fromColor`/`toColor` 프로퍼티가 `gradient` 하나로 대체됩니다.

- dd99afe: Lynx용 `MannerTemp`, `MannerTempEmote`, `MannerTempBadge` 컴포넌트를 추가합니다.

### Patch Changes

- 8a8ab80: 컴포넌트 vars의 gradient가 문자열 대신 `{ serialized, stops? }` 객체로 제공됩니다.

  - `serialized`: 기존과 동일한 CSS gradient 문자열입니다. `linear-gradient(88deg, ${vars.toneMagic.enabled.root.gradient.serialized})`처럼 사용합니다.
  - `stops`: `{ color, position }` 배열로, position이 0~1 원본 값이라 stop마다 `calc()`로 위치를 계산하는 등 동적으로 다룰 수 있습니다. 테마별로 값이 다른 gradient에는 제공되지 않습니다.
  - 생성되는 CSS는 이전과 동일합니다.

## 0.9.3

### Patch Changes

- 55103a6: Lynx `Radio Group`에서 라디오 표시와 라벨의 상단 여백이 적용되지 않아 수직 정렬이 어긋나던 문제를 수정합니다.

## 0.9.2

### Patch Changes

- 059f299: Lynx Callout 닫기 버튼의 크기와 여백이 적용되지 않는 문제를 수정합니다.
- 88fd4be: Android Lynx에서 Chip의 한글 라벨이 세로 중앙에서 위로 치우쳐 보이는 문제를 수정합니다.

## 0.9.1

### Patch Changes

- f3755b4: Lynx Tabs의 Indicator 위치를 수정합니다.

  - Android에서 선택한 탭으로 Indicator가 이동하지 않는 문제를 수정합니다.
  - `triggerLayout="hug"`에서 Indicator가 List의 좌측 gutter와 어긋나는 문제를 수정합니다.

## 0.9.0

### Minor Changes

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

- 5088420: Snackbar의 최대 너비를 464px로 맞춥니다.

  - 넓은 뷰포트에서 스낵바가 560px까지 늘어나지 않고 464px에서 멈춥니다. 464px보다 좁은 화면에서는 기존과 동일하게 화면을 채웁니다.
  - Sheet 계열의 최대 너비 480px에서 좌우 8px씩을 뺀 값이라, 스낵바가 시트 위에 떴을 때 시트 가장자리와의 여백이 생깁니다.

- aef119e: Bottom Sheet의 content 최대 너비를 480px로 맞춥니다.

  - 넓은 뷰포트에서 시트가 화면 폭 전체로 늘어나지 않고 480px에서 멈추며 가운데 정렬됩니다. 480px보다 좁은 화면에서는 기존과 동일하게 화면을 채웁니다.
  - `BottomSheetContent`가 시트를 왼쪽에 고정하던 인라인 `left` 값을 풀어, 폭이 제한됐을 때 좌우 여백이 같게 배치됩니다. `style`로 `left`를 직접 지정하면 그 값이 우선합니다.

### Patch Changes

- 07076a3: Select Box와 `variant="separated"` Accordion Item의 border 색을 `$color.stroke.neutral-muted`에서 `$color.stroke.neutral-weak`로 변경합니다.

  - Select Box는 enabled와 disabled 상태의 border 색이 함께 바뀝니다. selected 상태의 `$color.stroke.neutral-contrast`는 그대로입니다.
  - Accordion은 border를 가진 `variant="separated"`만 영향을 받습니다. `variant="inline"`의 divider 색은 그대로입니다.
  - border 색이 light 테마에서 `#00000010`(알파 6%) → `#dcdee3`, dark 테마에서 `#ffffff17`(알파 9%) → `#393d46`으로 바뀌어 또렷해집니다. 두 테마 모두 색이 있는 배경 위에 올려 쓰던 화면은 대비를 확인해 주세요.

- f73ee94: Pagination과 Table Pagination을 추가합니다.

  - `usePagination`은 controlled·uncontrolled 상태, 페이지 범위 계산과 이전·다음 이동을 제공합니다.
  - `useTablePagination`은 전체 개수를 아는 경우와 모르는 경우를 모두 지원합니다.
  - Pagination은 전체 페이지가 0개 또는 1개이면 표시하지 않습니다.
  - `ui:pagination`, `ui:table-pagination` snippet으로 설치할 수 있습니다.
  - 표시 문구와 접근성 이름을 앱 언어에 맞게 수정할 수 있습니다.

  ```sh
  npx @seed-design/cli@latest add ui:pagination
  npx @seed-design/cli@latest add ui:table-pagination
  ```

- f12cf1d: Help Bubble 및 Help Bubble Tooltip에 기본 최대 너비 `280px`을 추가합니다.

  - 좌우 padding을 포함한 말풍선 전체 폭이 `280px`가 되도록 `content`에 `box-sizing: border-box`를 추가합니다.
  - 최대 너비 제한을 제거하려는 경우 `contentProps`를 통해 `maxWidth="none"`을 지정할 수 있습니다.

## 0.8.1

### Patch Changes

- 21aa395: iOS Lynx에서 `ProgressCircle`의 색상이 표시되지 않는 문제를 수정합니다.

## 0.8.0

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

### Patch Changes

- ebb4eae: Date Picker에서 시작일을 유지하고 종료일만 변경할 수 있는 기능을 추가합니다.

  - `selectionMode="range"`에서 `rangeStartReadOnly` prop을 사용할 수 있습니다.
  - 시작일보다 늦은 날짜만 새 종료일로 선택할 수 있습니다.
  - 읽기 전용 시작일의 시각적 상태와 접근성 이름을 제공합니다.

  ```tsx
  <DatePicker
    selectionMode="range"
    rangeStartReadOnly
    value={{
      start: { year: 2026, month: 8, day: 7 },
      end: { year: 2026, month: 8, day: 9 },
    }}
  />
  ```

## 0.7.0

### Minor Changes

- c9acaa6: `DatePicker` 컴포넌트를 추가합니다.

  - Single, Range, Multiple 선택 모드를 지원합니다.
  - Month, Two Months, Week, Continuous 레이아웃을 각각 `DatePicker`, `TwoMonthDatePicker`, `WeekDatePicker`, `ContinuousDatePicker`로 제공합니다.
  - 날짜 constraints와 예약·가격 표시를 위한 `renderDateCellSupplement`, 내부 콘텐츠 전체를 교체하는 `renderDateCellContent`를 제공합니다.
  - `actionsRef`를 통해 특정 날짜로 이동하거나 날짜 셀에 포커스할 수 있습니다.
  - locale 기반 달력, 키보드·스크린 리더 접근성, Wheel Picker를 이용한 월·연도 이동을 지원합니다.

- c9acaa6: `TimePicker` 컴포넌트를 추가합니다.

  - 12시간제 시간 선택 UI와 locale에 따른 컬럼 순서를 지원합니다.
  - `minuteStep`으로 선택 가능한 분 간격을 설정할 수 있습니다.

## 0.6.0

### Minor Changes

- 4dad2e9: 트리거를 눌러 열리는 목록에서 값을 선택하는 Select 컴포넌트를 추가합니다.

  - `multiple`로 다중 선택을, `SelectGroup`으로 옵션 그룹과 그룹 라벨을 지원합니다.
  - 키보드 탐색을 지원하며, `size`·`disabled`·`readOnly`·`invalid` 상태를 제공합니다.
  - `label`, `description`, `errorMessage`로 Field와 연동되고, `name`으로 폼 제출 값의 키를 지정합니다.

  ```tsx
  <SelectRoot label="과일" defaultValue={["apple"]} name="fruit">
    <SelectTrigger placeholder="과일을 선택하세요" />
    <SelectContent>
      <SelectGroup>
        <SelectItem value="apple" label="사과" />
        <SelectItem value="banana" label="바나나" />
      </SelectGroup>
    </SelectContent>
  </SelectRoot>
  ```

- 6ba7292: 기존 Alert Dialog와 별개로, 범용 Dialog와 ResponsiveDialog를 추가합니다.

  - `Dialog`: `medium`, `large` size를 지원하며, 본문이 길면 Body가 스크롤되고 상단에 divider와 하단 fade가 나타납니다.
  - `ResponsiveDialog`: `md` 이상에서는 Dialog로, 그 아래에서는 Bottom Sheet로 렌더링합니다.
  - `ui:dialog`, `ui:responsive-dialog` snippet으로 설치할 수 있습니다.

  ```tsx
  <DialogRoot size="medium">
    <DialogTrigger asChild>
      <ActionButton>열기</ActionButton>
    </DialogTrigger>
    <DialogContent title="제목" description="설명">
      <DialogBody>{/* ... */}</DialogBody>
      <DialogFooter>
        <HStack gap="x2" justify="flex-end">
          <DialogAction variant="neutralWeak">취소</DialogAction>
          <DialogAction variant="neutralSolid">확인</DialogAction>
        </HStack>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
  ```

- 19f07f5: QuantityPicker 컴포넌트를 추가합니다.

  - 지정한 최소·최대 수량 범위에서 값을 증감할 수 있으며, 최소 수량에서 제거 동작을 지원합니다.
  - `size`, `disabled`, `readOnly`, `invalid`, 증감 중 loading 상태를 지원합니다.
  - 폼 제출에 사용할 수 있는 `QuantityPicker.HiddenInput`을 제공합니다.
  - `ui:quantity-picker` snippet으로 설치할 수 있으며, `@seed-design/css@^2.3.0`을 사용합니다.

  ```tsx
  <QuantityPicker.Root min={0} max={99} defaultValue={1}>
    <QuantityPicker.DecrementButton icon={<IconMinusLine />} />
    <QuantityPicker.ValueDisplay />
    <QuantityPicker.IncrementButton icon={<IconPlusLine />} />
    <QuantityPicker.HiddenInput name="quantity" />
  </QuantityPicker.Root>
  ```

## 0.5.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- 09e28ef: (사용자 변경사항 없음) Side Panel 닫기 버튼 spec에서 사용되지 않던 pressed 상태의 icon 색상 정의를 제거합니다.
- 6963994: Slider `disabled` 상태에서 track(비활성 구간) 색상을 `bg.disabled`로 지정해, range(활성 구간)와의 색상 대비가 명확히 보이도록 수정합니다.

## 0.5.0

### Minor Changes

- f523979: Action Button의 pressed 상태에 scale 모션을 추가합니다.

  pressed 상태에 적절한 모션 피드백을 제공하기 위해 사용하는 `$scale.s95`, `$scale.s97`, `$scale.s98` 토큰을 추가합니다.

  - `scale` 토큰은 플랫폼 별 동작 줄이기 설정에 따라 값이 `1`로 동작합니다.
  - 웹 CSS 환경에서는 `(prefers-reduced-motion: reduce)` 미디어 쿼리가 매치되는 환경에서 `1`로 동작합니다.
  - Tailwind 유틸리티 클래스 `scale-s*`를 통해 scale 토큰을 사용할 수 있습니다. 신규 토큰을 사용할 수 있도록 Tailwind 패키지의 `@seed-design/css` peerDependency 범위를 `^2.1.0`에서 `^2.2.0`으로 올립니다.

## 0.4.1

### Patch Changes

- 7224b94: ImageFrameReactionButton root에 반투명 배경색과 그림자를 추가하여 밝은 이미지 위에서의 가시성을 개선합니다.
- c4ce431: Side Panel Close Button 및 Side Panel Header의 스타일을 디자인 스펙에 맞게 수정하고, Side Panel body에 `box-sizing: border-box`를 적용하여, body에 지정한 `height`/`minHeight`/`maxHeight`가 padding을 포함해 계산되도록 수정합니다.

## 0.4.0

### Minor Changes

- f2b198d: `$color.bg.layer-fill` 토큰을 다시 추가합니다.

  `2.0.0`에서 제거했으나 마땅한 대체 토큰이 없어 deprecated 상태로 되살립니다. 값은 제거 이전과 동일합니다. 추후 동일한 값의 새 이름 토큰으로 대체된 뒤 `3.0.0`에서 제거될 예정입니다.

  `@seed-design/tailwind3-plugin`과 `@seed-design/tailwind4-theme`의 `@seed-design/css` peer dependency 버전 범위를 `^2.1.0`으로 올립니다.

## 0.3.0

### Minor Changes

- 555525a: Attachment Field 관련 컴포넌트를 추가합니다.

  - Attachment Field: 파일을 선택하거나 드래그 앤 드롭으로 직접 업로드할 때 사용합니다.
  - Attachment Display Field: 외부 소스에서 URL로 제공된 미디어를 표시·관리할 때 사용합니다.

- d1a8d7c: 신규 타이포그래피 토큰을 추가합니다.

  - **폰트 크기 토큰 (`$font-size`)**
    - `t11`, `t11-static`
    - `t12`, `t12-static`
    - `t13`, `t13-static`
    - `t14`, `t14-static`
  - **줄 간격 토큰 (`$line-height`)**
    - `t11`, `t11-static`
    - `t12`, `t12-static`
    - `t13`, `t13-static`
    - `t14`, `t14-static`
  - **텍스트 스타일 (`textStyle`)**
    - `t8Regular`, `t8Medium`, `t8StaticRegular`, `t8StaticMedium`
    - `t9Regular`, `t9Medium`, `t9StaticRegular`, `t9StaticMedium`
    - `t10Regular`, `t10Medium`, `t10StaticRegular`, `t10StaticMedium`
    - `t11Regular`, `t11Medium`, `t11Bold`, `t11StaticRegular`, `t11StaticMedium`, `t11StaticBold`
    - `t12Regular`, `t12Medium`, `t12Bold`, `t12StaticRegular`, `t12StaticMedium`, `t12StaticBold`
    - `t13Regular`, `t13Medium`, `t13Bold`, `t13StaticRegular`, `t13StaticMedium`, `t13StaticBold`
    - `t14Regular`, `t14Medium`, `t14Bold`, `t14StaticRegular`, `t14StaticMedium`, `t14StaticBold`

- 69e3b97: Menu 컴포넌트를 추가합니다.

  Drawer를 연 뒤 Drawer 뒤 요소에 포커스가 남아 있는 문제를 수정합니다. Drawer가 열리는 경우 `Drawer.Content`에 자동으로 포커스가 이동합니다.

  - `Drawer.RootProps`의 `autoFocus` 기본값을 `false`에서 `true`로 변경합니다.
  - 스크린 리더가 `modal=true` (기본값)인 Dialog 및 Drawer 뒤 요소를 읽을 수 있는 문제를 수정합니다.

  Dialog(AlertDialog, MenuSheet)와 Drawer(BottomSheet)를 `@radix-ui/react-dismissable-layer`에서 자체 `useDismissibleLayer` 훅 기반으로 리팩터링하고 불필요하게 외부로 노출되던 내부 옵션들을 제거합니다.

  - `DialogRoot` 및 `DrawerRoot`의 `onOpenChange` 두 번째 인자 `details.reason`이 `interactOutside`인 경우 `details.event`의 타입을 `PointerEvent | FocusEvent`에서 `PointerEvent | TouchEvent | FocusEvent`로 변경합니다.
  - `DialogRoot` 및 `DrawerRoot` 두 번째 인자 `details`의 `reason`으로 `cascadeDismiss`를 추가합니다. 두 개 이상의 오버레이 컴포넌트를 표시한 상황에서 하위 컴포넌트가 dismiss되는 경우 상위 컴포넌트는 `cascadeDismiss`와 함께 `onOpenChange`가 호출됩니다.
  - `@seed-design/react` 패키지에서 `@radix-ui/react-dialog` 의존성을 제거합니다.

- 57e4f1a: Chip Tabs Trigger가 disabled 상태일 때 opacity를 사용하여 스타일을 조절하도록 수정합니다.
- 270b277: 컴포넌트 및 파운데이션 전반에 JSDoc 주석을 강화합니다.

## 0.2.1

### Patch Changes

- 234e8c7: deprecated 항목의 제거 예정 버전 안내를 1.3.0에서 2.0.0으로 변경합니다.

  - `ImageFrame`의 `rounded` 옵션, `Switch`/`Checkbox`/`ChipTabs`의 deprecated 옵션, 유틸리티 스타일 prop(`display`, `flexDirection`, `justifyContent`, `alignItems`)의 deprecated 값의 제거 예정 버전을 2.0.0으로 안내합니다.
  - `$color.bg.layer-fill`, `$gradient.fade-layer-floating`, `$gradient.fade-layer-default` 토큰의 제거 예정 버전을 2.0.0으로 안내합니다.
  - 2.0.0부터 deprecated 항목 제거를 포함한 breaking change는 메이저 릴리스에서만 수행됩니다.

## 0.2.0

### Minor Changes

- c8d4c26: Lynx AppBar 컴포넌트를 추가합니다.

  - `AppBar.Root`, `AppBar.Left`, `AppBar.Main`, `AppBar.Right`, `AppBar.IconButton` 등 compound API를 제공합니다.
  - `SystemInfo.platform`에 따라 Android에서는 `android`, 그 외 플랫폼에서는 `cupertino` theme을 기본으로 적용합니다.
  - `theme` prop으로 platform 기본값을 수동 override할 수 있습니다.

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

- 8dc8f4f: Menu Sheet의 디자인 스펙에서 핸들 여백 확보를 위해 `content` 상단 패딩을 `x4` → `x6`으로 늘리고 `header.paddingTop`을 제거합니다 (핸들 여백 확보). React/CSS `MenuSheet`의 경우 핸들이 존재하지 않으므로 변경사항이 없습니다.
- 0fa9a1f: Lynx에서 테마(라이트/다크) 전환 시 텍스트 색상이 갱신되지 않던 문제를 수정합니다.

## 0.1.0

### Minor Changes

- 699af2c: SEED Design Lynx의 첫 stable 버전을 릴리즈합니다.

  - `@seed-design/lynx-css`: Lynx 환경에서 사용할 수 있는 SEED 디자인 토큰, base CSS, component recipe CSS를 제공합니다.
  - `@seed-design/lynx-react`: Lynx용 SEED React 컴포넌트와 hook을 제공합니다.
    - 컴포넌트: `ActionButton`, `BottomSheet`, `Box`, `Checkbox`, `HStack`, `ProgressCircle`, `RadioGroup`, `Switch`, `TagGroup`, `Text`, `VStack`
    - Hook: `useControllableState`, `useIconColor`, `usePressTap`, `useSafeArea`
    - Safe Area: `useSafeArea` API로 `env(safe-area-inset-*)`와 host 앱의 `lynx.__globalProps` fallback을 함께 지원합니다.
  - `@seed-design/cli`: Lynx framework 감지, registry snippet 추가, compatibility check, docs lookup 흐름을 지원합니다.
