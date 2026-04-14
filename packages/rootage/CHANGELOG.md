# @seed-design/rootage-artifacts

## 0.0.0-alpha-20260414104312

### Patch Changes

- Side Navigation, Footer, Menu 컴포넌트를 추가합니다.

## 1.3.0

### Minor Changes

- 819110b: 1.2에서 Deprecate된 옵션을 제거합니다.

  - 색상 토큰
    - `$color.bg.layer-fill`: 라이트 및 다크 모드에서 모두 테스트 후 `$color.bg.neutral-weak`으로 대체할 수 있습니다.
  - 그라디언트 토큰
    - `$gradient.fade-layer-floating`
    - `$gradient.fade-layer-default`
  - Chip Tabs의 `brandSolid` variant
  - Image Frame의 `rounded` variant
  - Switch의 `small` 및 `medium` size: 각각 `16`과 `32`를 사용해주세요.
  - Checkbox의 `default` 및 `stronger` weight: 각각 `regular`와 `bold`를 사용해주세요.
  - `<Box display="inlineFlex" />` 등 유틸리티 컴포넌트 레이아웃 프로퍼티의 camelCase 옵션: kebab-case 옵션을 사용해주세요.
    - `display`, `justifyContent`, `justify`, `alignItems`, `align`, `alignContent`, `alignSelf`, `flexDirection`, `direction`

### Patch Changes

- 9b36676: menu-sheet 스펙에 핸들 여백을 위한 header.paddingTop 추가, menu-sheet-close-button deprecated 처리
- eadb7e8: Chip Tabs Trigger가 disabled 상태일 때 opacity를 사용하여 스타일을 조절하도록 수정합니다.

## 1.2.6

### Patch Changes

- e78d460: Avatar 및 Avatar Stack의 `size=56` variant를 추가합니다.

## 1.2.5

### Patch Changes

- 4f56e76: (사용자 변경사항 없음) Rootage `text-input`에 `type=singleLine` variant 정의를 추가합니다.
- 67a7780: Content Placeholder 컴포넌트를 추가합니다.

## 1.2.4

### Patch Changes

- 103830e: List Item의 title fontWeight를 `$font-weight.medium`에서 `$font-weight.regular`로 변경합니다.
- 751e952: `$color.stroke.focus-ring` 색상 토큰을 추가합니다.
- 77cdc0e: IdentityPlaceholder의 스타일과 글리프를 업데이트하고, `identity="business"` variant를 추가합니다.

## 1.2.3

### Patch Changes

- eb390cf: BottomSheet의 title padding을 수정합니다.

  - left 헤더 정렬 시 오른쪽 padding을 `50px` -> `56px`로 수정합니다.
  - center 헤더 정렬 시 양쪽 padding을 `60px` -> `56px`로 수정합니다.

- 7c3bbe7: Slider의 Value Indicator 가시성 및 트랜지션을 개선합니다.

## 1.2.2

### Patch Changes

- a3e6859: ImageFrame `rounded` 옵션을 제거하고, borderRadius를 받을 수 있게 변경합니다
- 4287600: BottomSheet title 영역에서 닫기 버튼 간격에 따라 조정된 padding 기준으로 정리하고, word-break 추가 및 description 영역 너비를 정리했습니다.

## 1.2.1

### Patch Changes

- 9446f2c: ImageFrameReactionButton에 fillIcon, lineIcon spec을 추가합니다
- 8ad9484: ImageFrameReactionButton의 SVG 사이즈와 Rootage 정의를 수정합니다.

## 1.2.0

### Minor Changes

- 0ecb893: [Help Bubble](/react/components/help-bubble) 관련 컴포넌트를 업데이트합니다.

  - **1.1 → 1.2 업그레이드 시 snippet 업데이트 필요**: `HelpBubbleTrigger` 및 `HelpBubbleAnchor`의 내부 구조가 변경되었습니다. snippet을 다시 내려받아 주세요.
    - `npx @seed-design/cli@latest add ui:help-bubble`
    - **인터페이스 변경사항이 없으므로 `HelpBubbleAnchor`와 `HelpBubbleTrigger`를 사용하는 기존 코드를 변경할 필요가 없습니다.**
    - `HelpBubble.Body`를 사용하여 `HelpBubble.Title`과 `HelpBubble.Description`을 감싸도록 변경되었습니다.
    - `zIndexOffset`을 활용하여 `HelpBubble.Positioner`의 z-index를 조정할 수 있습니다. ([예시](/react/components/help-bubble#z-index-offset))

- a58022d: `SwitchMark`를 `Switchmark`로, `RadioMark`를 `Radiomark`로 Snippet 컴포넌트 이름을 변경합니다.

  - **1.1 → 1.2 업그레이드 시 변경 권장**: snippet을 다시 내려받고, `SwitchMark`, `RadioMark`를 사용하는 코드를 아래와 같이 변경하세요.

    - `npx @seed-design/cli@latest add ui:switch ui:radio-group`
    - snippet에 `SwitchMark`, `RadioMark` 정의가 존재하지만, 1.3 릴리즈 시 snippet에서 해당 맵핑이 제거될 예정이므로 미리 변경해두시길 권장드립니다.

    ```tsx
    // 전
    import { ListSwitchItem, ListRadioItem } from "seed-design/ui/list";
    import { SwitchMark } from "seed-design/ui/switch";
    import { RadioMark } from "seed-design/ui/radio-group";

    <ListSwitchItem
      title="리스트 아이템 스위치"
      detail="설명 텍스트"
      suffix={<SwitchMark tone="neutral" />}
    />;

    <ListRadioItem
      prefix={<RadioMark tone="neutral" size="large" />}
      value="option"
      title="옵션"
    />;
    ```

    ```tsx
    // 후
    import { ListSwitchItem, ListRadioItem } from "seed-design/ui/list";
    import { Switchmark } from "seed-design/ui/switch";
    import { Radiomark } from "seed-design/ui/radio-group";

    <ListSwitchItem
      title="리스트 아이템 스위치"
      detail="설명 텍스트"
      suffix={<Switchmark tone="neutral" />}
    />;

    <ListRadioItem
      prefix={<Radiomark tone="neutral" size="large" />}
      value="option"
      title="옵션"
    />;
    ```

### Patch Changes

- 98dbac4: [Checkbox](/react/components/checkbox) 관련 컴포넌트를 추가합니다.

  - `CheckboxGroup` snippet 컴포넌트가 추가되었습니다. 사용하려면 snippet을 다시 내려받아 주세요.
    - `npx @seed-design/cli@latest add ui:checkbox`
    - `CheckboxGroup`은 자체적으로 gap과 100% width를 갖습니다. `VStack`을 사용하여 `Checkbox`를 묶지 않아도 됩니다.
      - 기존 `Checkbox`를 `CheckboxGroup`으로 감쌀 필요는 없습니다. `CheckboxGroup`은 선택적으로 사용할 수 있습니다.
    - `label`, `description`, `errorMessage`, `indicator`, `showRequiredIndicator`, `labelWeight` prop을 사용할 수 있습니다.

  [Radio Group](/react/components/radio-group) 관련 컴포넌트를 업데이트합니다.

  - **1.1 → 1.2 업그레이드 시 snippet 업데이트 필요**: `RadioGroup` snippet의 내부 구조가 변경되었습니다. snippet을 다시 내려받아 주세요.

    - `npx @seed-design/cli@latest add ui:radio-group`
    - `RadioGroup`이 자체적으로 gap과 100% width를 갖습니다. `VStack`을 사용하여 `RadioGroupItem`을 묶는 코드를 제거합니다.
      - **1.1 → 1.2 업그레이드 시 변경 필요**: `RadioGroupItem`을 묶어서 사용하던 `VStack`을 제거하여 `RadioGroupItem`이 `RadioGroup`의 direct child가 되도록 변경하세요.
    - `label`, `description`, `errorMessage`, `indicator`, `showRequiredIndicator`, `labelWeight` prop을 사용할 수 있습니다.
    - `@seed-design/react`의 `RadioGroup.Root`를 레이아웃 컴포넌트로 변경합니다.
      - `@seed-design/react`에서 직접 import해서 사용하는 코드가 있다면 `RadioGroup.Root`를 `@seed-design/react/primitive`의 `RadioGroup.Root`로 변경해주세요.

    ```tsx
    // 전
    import { VStack } from "@seed-design/react";
    import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

    <RadioGroup defaultValue="apple" aria-label="Fruit selection">
      <VStack>
        <RadioGroupItem value="apple" label="Apple" />
        <RadioGroupItem value="banana" label="Banana" />
      </VStack>
    </RadioGroup>;
    ```

    ```tsx
    // 후
    import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

    {
      /* aria-label 대신 label을 사용하여 시각적으로 레이블을 표시할 수도 있습니다. */
    }
    <RadioGroup defaultValue="apple" aria-label="Fruit selection">
      <RadioGroupItem value="apple" label="Apple" />
      <RadioGroupItem value="banana" label="Banana" />
    </RadioGroup>;
    ```

    ```tsx
    // 전
    import { RadioGroup } from "@seed-design/react";
    import { ListRadioItem } from "seed-design/ui/list";

    <RadioGroup.Root
      value={value}
      onValueChange={onValueChange}
      aria-label="옵션 선택"
    >
      <ListRadioItem
        value="option1"
        title="옵션 1"
        detail="첫 번째 선택지"
        suffix={<Radiomark tone="neutral" size="large" />}
      />
    </RadioGroup.Root>;
    ```

    ```tsx
    // 후
    import { RadioGroup } from "@seed-design/react/primitive";
    import { ListRadioItem } from "seed-design/ui/list";

    <RadioGroup.Root
      value={value}
      onValueChange={onValueChange}
      aria-label="옵션 선택"
    >
      <ListRadioItem
        value="option1"
        title="옵션 1"
        detail="첫 번째 선택지"
        suffix={<Radiomark tone="neutral" size="large" />}
      />
    </RadioGroup.Root>;
    ```

  RadioGroupItem, RadioChipItem, RadioSelectBoxItem, ListRadioItem에서 `invalid` prop이 제거되었습니다.

  - **1.1 → 1.2 업그레이드 시 확인 필요**: `invalid` 상태는 group/field 레벨에서 설정해주세요. 각 항목을 `data-invalid` 속성으로 스타일링하는 경우 확인이 필요합니다.

- 2643d17: [Select Box](/react/components/select-box) 관련 컴포넌트를 업데이트합니다.

  - **1.1 → 1.2 업그레이드 시 snippet을 다시 내려받아 주세요.**
    - `npx @seed-design/cli@latest add ui:select-box`
  - `CheckSelectBoxGroup`, `RadioSelectBoxRoot`의 children이 기본적으로 gap이 포함된 그리드 레이아웃으로 정렬됩니다.
    - **1.1 → 1.2 업그레이드 시 변경 필요**: `CheckSelectBox`, `RadioSelectBoxItem`을 묶어서 사용하던 `VStack`을 제거하여 `CheckSelectBox`와 `RadioSelectBoxItem`이 `CheckSelectBoxGroup` 또는 `RadioSelectBoxRoot`의 direct child가 되도록 변경하세요. `VStack`에 `gap` 이외의 스타일이 적용된 경우 `<VStack paddingX="x4"><CheckSelectBoxGroup>...</CheckSelectBoxGroup></VStack>`와 같이 `VStack`을 외부에 남겨두세요.
    - **기능 추가**: `CheckSelectBoxGroup`와 `RadioSelectBoxRoot`에 `columns`를 지정할 수 있습니다. `columns`가 `2` 이상인 경우 하위 항목에 기본적으로 `layout="vertical"`이 적용됩니다. 기본 `layout`은 하위 항목에서 오버라이드할 수 있습니다.
    - **기능 추가**: `CheckSelectBoxGroup`과 `RadioSelectBoxRoot`에 `label`, `description`, `errorMessage`, `indicator` 등 Fieldset 관련 prop을 사용할 수 있습니다.
  - **1.1 → 1.2 업그레이드 시 변경 필요**: `CheckSelectBox`, `RadioSelectBoxItem`에 기본적으로 표시되던 `Checkmark`와 `RadioMark`가 이제 표시되지 않습니다. `suffix` prop을 통해 선택적으로 추가할 수 있습니다.
    - 단순 마이그레이션 시 `suffix={<CheckSelectBoxCheckmark />}`와 `suffix={<RadioSelectBoxRadiomark />}`를 추가하세요.
  - **기능 추가**: `prefixIcon`, `footer`, `footerVisibility` prop 추가
    - `footer`에 넣는 요소는 기본적으로 해당 `CheckSelectBox` 또는 `RadioSelectBoxItem`가 선택된 상태일 때 표시됩니다. `footerVisibility="always"`를 설정하여 footer 요소를 항상 표시할 수 있습니다.
  - `label`이 기본적으로 가로 나열되며 `$dimension.x2` gap을 갖는 flex container로 변경되었습니다.
    - **1.1 → 1.2 업그레이드 시 확인 권장**: `label={<HStack gap="x2">{/* ... */}</HStack>}`와 같은 코드는 `HStack`을 `Fragment` 등으로 대체할 수 있습니다.
  - **문제 수정**: `CheckSelectBox`와 `RadioSelectBoxItem`에서 사용되지 않는 `children`을 타입 정의에서 제거합니다.
  - `CheckSelectBoxGroup`에 `label`, `aria-label`, `aria-labelledby` 중 아무것도 설정하지 않은 경우 경고를 표시합니다. (`RadioSelectBoxRoot`는 기존에도 표시)

- 17c0ebd: Text Field (text-input)과 Field Button (input-button)의 포커스 및 에러 상태 border 트랜지션을 수정합니다.

## 1.1.8

### Patch Changes

- db49a84: Chip 컴포넌트 스펙에 `layout=withText` variant를 명시합니다. (스타일 변경사항 없음)
- 6fab0e7: Skeleton 가시성 향상을 위해 `$gradient.shimmer-magic` 및 `$gradient.shimmer-neutral` 토큰의 색상을 업데이트합니다.
- 5faef3a: 주석, 참고 사항 및 상세 리스트 등 부가 정보에 사용할 수 있는 시맨틱 텍스트 스타일 `articleNote`를 추가합니다.
- 50ee0a6: `@seed-design/css@1.3` 및 `@seed-design/react@1.3`에서 제거되는 토큰 및 옵션에 관한 경고를 추가합니다.

  - 1.3에서 제거 예정인 색상 토큰
    - [`$color.bg.layer-fill`](/docs/foundation/design-token/%24color.bg.layer-fill)
    - [`$gradient.fade-layer-floating`](/docs/foundation/design-token/%24gradient.fade-layer-floating)
    - [`$gradient.fade-layer-default`](/docs/foundation/design-token/%24gradient.fade-layer-default)
  - 1.3에서 제거 예정인 컴포넌트 variant
    - [ChipTabs](/react/components/chip-tabs)
      - `variant="brandSolid"`
        - 1.2까지 사용 가능, 1.3부터 디자인 변경 필요
    - [Checkbox](/react/components/checkbox)
      - `weight="default"`
        - 0.2.4부터 `weight="regular"` 사용 가능
        - `weight="default"`는 1.2까지 사용 가능, 1.3부터 `weight="regular"`만 허용
      - `weight="stronger"`
        - 0.2.4부터 `weight="bold"` 사용 가능
        - `weight="stronger"`는 1.2까지 사용 가능, 1.3부터 `weight="bold"`만 허용
    - [Switch](/react/components/switch)
      - `size="small"`
        - 0.1.9부터 `size="16"` 사용 가능
        - `size="small"`은 1.2까지 사용 가능, 1.3부터 `size="16"`만 허용
      - `size="medium"`
        - 0.1.9부터 `size="32"` 사용 가능
        - `size="medium"`은 1.2까지 사용 가능, 1.3부터 `size="32"`만 허용
    - `StyleProps`를 상속하는 컴포넌트
      - `display`, `justifyContent/justify`, `alignItems/align`, `alignContent`, `alignSelf`, `flexDirection/direction` 프로퍼티에서의 `camelCase` 값 제거 예정
        - 0.0.15부터 `kebab-case` 값 사용 가능
        - `camelCase` 값은 1.2까지 사용 가능, 1.3부터 `kebab-case` 값만 허용
        - 예: `justifyContent="spaceBetween"` → `justifyContent="space-between"`
      - 영향 범위인 컴포넌트: [Box](/react/components/layout/box), [Flex](/react/components/layout/flex), [HStack](/react/components/layout/h-stack), [VStack](/react/components/layout/v-stack), [Article](/react/components/article), [List (List.Root) 및 ListItem, ListButtonItem, ListLinkItem, ListSwitchItem, ListCheckItem, ListRadioItem (List.Item)](/react/components/list), [BottomSheetBody (BottomSheet.Body)](/react/components/bottom-sheet), ResponsivePair, [Inline (deprecated)](/react/components/inline), [Columns, Column (deprecated)](/react/components/columns), [Stack (deprecated)](/react/components/stack)

- 94bebf8: `$color.bg.layer-basement` 위에서 컴포넌트의 가시성을 보장하기 위해 `$color.bg.neutral-weak-alpha` 토큰을 추가합니다.

  - Chip `variant=solid`에 적용
  - ChipTab `variant=neutralSolid`에 적용
  - SegmentedControl root에 적용

## 1.1.7

### Patch Changes

- 2f29fe8: 정적 텍스트 스타일 추가 (t1Static* ~ t10Static*)
- 9119723: Checkmark `variant=ghost` `tone=neutral`에서 icon의 색상을 $color.fg.neutral로 변경하고 색상 트랜지션을 추가합니다.
- 10c0765: 배너 템플릿에 사용되는 `$color.banner.*` 색상 토큰을 추가합니다.
- b46264a: Rootage에 누락된 Slot Schema 정의 추가 (스타일 변경사항 없음)

## 1.1.6

### Patch Changes

- 9be0581: `radiomark` Rootage 정의를 명확화합니다. (스타일 변경사항 없음)
- cc4a45a: 신규 [Elevation 가이드](https://seed-design.io/docs/foundation/elevation)에 맞는 shadow 토큰을 추가합니다.

  - React: Box, Flex, HStack 등 StyleProps를 사용하는 컴포넌트에서 `boxShadow` prop을 사용하여 shadow 토큰을 쉽게 사용할 수 있습니다.

- 739937f: Button들의 xsmall variant의 텍스트 사이즈를 t4에서 t3로 변경해요.

## 1.1.5

### Patch Changes

- db5de74: PageBanner에 tone="magic" 스타일을 추가합니다.
- 70d11b8: Segmented Control의 스타일을 업데이트합니다: Indicator에서 shadow 정의를 제거합니다.

## 1.1.4

### Patch Changes

- 8752805: List Item에 신규 active(pressed) 스타일을 적용하고, disabled 상태에서 detail 영역의 색상을 수정합니다.

## 1.1.3

### Patch Changes

- dfe6c1e: transparent 상태 컬러 추가, 컴포넌트 상태 컬러 변경, transition 추가

  - `$color.bg.transparent-pressed` 컬러와 `$color.bg.transparent` 컬러가 추가되었습니다.
  - 다음 컴포넌트들의 색상이 transparent 관련 토큰으로 변경되었습니다.
    - `Chip` (outlineStrong, outlineWeak)
    - `Action Button` (neutralOutline, brandOutline, ghost)
    - `Checkmark`
    - `Tabs` (outline)
    - `List Item`
    - `Radiomark`
    - `Reaction Button`
    - `Select Box`
  - 다음 컴포넌트들의 color transition이 추가되었습니다. (duration: $duration.d3, timing-function: $timing-function.easing)
    - `Checkmark`
    - `Radiomark`
    - `Reaction Button`
    - `Select Box`

- a09e6b4: 다음 컴포넌트들의 color transition을 `$duration.color-transition` (d3) 토큰으로 변경합니다

  - `Action Button`
  - `Bottom Sheet Handle`
  - `Checkmark`
  - `Tabs` (outline)
  - `Chip`
  - `Contextual Floating Button`
  - `Floating Action Button`
  - `Input Button`
  - `List Item`
  - `Radiomark`
  - `Reaction Button`
  - `Segmented Control Item`
  - `Select Box`
  - `Text Input`
  - `Toggle Button`

## 1.1.2

### Patch Changes

- 53290ab: FieldButton에 Read Only 상태를 추가합니다. Disabled 상태인 FieldButton은 내부 `<input />`도 `disabled` 속성을 갖도록 수정합니다.

## 1.1.1

### Patch Changes

- f4e07bb: 1.1 이전 버전과 호환 가능하도록 임시적으로 사용할 text-input size=medium variant를 추가합니다.

  - 영향 받는 React 컴포넌트: TextFieldInput, TextFieldTextarea

- 114dafd: text-input의 readonly 스타일을 업데이트합니다.

  - 영향 받는 React 컴포넌트: TextFieldInput, TextFieldTextarea

- bc3cd6f: ScrollFog 컴포넌트를 추가합니다

## 1.1.0

### Minor Changes

- a55f584: Slider 컴포넌트를 추가합니다.
- 33def2d: (BREAKING CHANGE: BottomSheet snippet을 다시 설치해야 합니다.) BottomSheet에 드래그를 통해 닫는 기능을 추가합니다.

  - vaul headless 코드 기반으로 seed에 맞게 커스텀하여 구현했습니다.
  - vaul과 동일한 인터페이스를 가지고 있습니다. (snap-points, fade-from-index, etc.)
  - `npx @seed-design/cli@latest add ui:bottom-sheet`로 snippet을 최신화하세요.

### Patch Changes

- d6bb84d: (BREAKING CHANGE: TextField snippet을 다시 설치해야 합니다.) Text Field 관련 컴포넌트를 업데이트합니다.

  - 스타일 업데이트
  - size 통일 및 variant (underline) 추가
  - 내부적으로 Field 컴포넌트를 사용하도록 변경하여 스타일 일관성 향상

  Field Button 컴포넌트를 추가합니다.

- 6af6501: (BREAKING CHANGE: PageBanner snippet을 다시 설치해야 합니다.) Page Banner 스니펫을 업데이트합니다.

  - Box를 사용하여 스타일링하던 부분을 `PageBanner.Body`로 교체합니다.
  - `PageBanner.TextContent`를 `PageBanner.Content`로 이름 변경합니다.

## 1.0.6

### Patch Changes

- 15ab93a: List Item 컴포넌트의 상하 여백을 `$dimension.x2_5`에서 `$dimension.x3`로 늘립니다.

## 1.0.5

### Patch Changes

- 6aafce0: Tag Group 컴포넌트를 추가합니다. Tag Group은 아이콘 및 텍스트로 이루어진 태그를 구분 기호와 함께 수평 레이아웃으로 표시하는 컴포넌트입니다.
- 1902dfa: AppBar의 스타일을 업데이트합니다.

  - Top Navigation의 title 및 description에 `lineHeight` 값을 정의합니다. (React AppBar 컴포넌트에 반영됩니다.)
  - `<Icon />` 컴포넌트를 활용하여 `<AppBarIconButton />` 내부 아이콘을 커스터마이징할 수 있도록 수정합니다.

- 4c33f07: Switch가 checked 상태가 아닐 때 thumb 크기를 줄여 상태를 인지하기 쉽도록 합니다. enabled-disabled 상태 간 트랜지션을 추가합니다.
- 3df657f: Switch와 Switch Mark의 disabled 상태를 더 잘 구별할 수 있도록 스타일을 수정합니다.

## 1.0.4

### Patch Changes

- f1cf4cd: Text Field와 Multiline Text Field가 기본적으로 배경 색을 갖지 않도록 수정합니다.
- 3898183: 매너온도 L9 전경 및 배경 색상의 채도를 낮춥니다.

## 1.0.3

### Patch Changes

- 6c6099d: Callout에 tone=positive variant를 추가합니다.

## 1.0.2

### Patch Changes

- 6d2e13d: MannerTemp 컴포넌트가 레이아웃에서 너비를 덜 차지하도록 업데이트합니다.

## 1.0.1

### Patch Changes

- 1420b68: MannerTemp 컴포넌트가 레이아웃에서 높이를 덜 차지하도록 업데이트합니다.

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Minor Changes

- 39a96f1: (**BREAKING CHANGE**: Snackbar Snippet을 다시 설치해야합니다) Snackbar 컴포넌트 변경
  - Snackbar의 배경색이 다크모드에서 흰색으로 변경됩니다.
  - Prefix 요소유무에 따라 여백이 변경됩니다.
  - `npx @seed-design/cli@latest add ui:snackbar` 명령어로 설치하세요.

### Patch Changes

- e038490: (**BREAKING CHANGE**: Snippet을 다시 설치해야 합니다.) Manner Temp, Manner Temp Badge 컴포넌트를 업데이트합니다.

  - snippet 내 오타 수정
  - 신규 10단계 반영
  - 업데이트 가이드
    1. `@seed-design/css@latest @seed-design/react@latest` 설치
    2. `npx @seed-design/cli@latest add ui:manner-temp ui:manner-temp-badge`로 snippet 최신화
    3. 온도 범위가 변경되었으므로, `<MannerTemp level="l1" />` 혹은 `<MannerTempBadge level="l1" />`과 같이 `level`을 직접 지정하여 사용하고 있는 경우가 있는지 확인

- 4153ca5: HelpBubble 컴포넌트의 배경색이 다크모드에서 흰색으로 변경됩니다.
- a7d07f0: (**BREAKING CHANGE**: `SwitchMark` 사용을 위해서는 Snippet을 다시 설치해야 합니다.) Switch의 토글 영역만을 정의한 Switch Mark 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:switch` 명령어로 설치하세요.

  (**BREAKING CHANGE**: `ListHeader` 사용을 위해서는 Snippet을 다시 설치해야 합니다.) List Header 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:list` 명령어로 설치하세요.

## 0.1.4

### Patch Changes

- 0ca19c0: Segmented Control 컴포넌트를 업데이트합니다.

  - Notification Badge를 표시하는 notification prop을 추가합니다.
  - `SegmentedControlItem`의 `children`을 `string`에서 `ReactNode`로 확대합니다.
  - 스타일을 업데이트합니다.

## 0.1.3

### Patch Changes

- 8ebe8a5: Switch, Checkmark, Radio Mark의 스타일을 업데이트합니다.

  - tone=neutral variant를 추가합니다.
  - Switch의 thumb 크기를 조정합니다.

  Checkbox와 Radio의 weight variant를 default, stronger에서 regular, bold로 수정합니다.

- f61b80d: 다크 모드에서의 색상 대비 보장을 위해 시맨틱 색상을 수정하고 컴포넌트에서의 색상을 변경합니다.

  - **$color.bg.warning-solid**: theme-dark에서 $color.palette.yellow-600 → $color.palette.yellow-800
  - **$color.bg.warning-solid-pressed**: theme-dark에서 $color.palette.yellow-700 → $color.palette.yellow-900
  - Badge, Page Banner의 tone=warning, variant=solid variant에서 전경 항목 색상 변경: $color.fg.neutral → $color.palette.static-black-alpha-900

## 0.1.2

### Patch Changes

- a22b8b9: ChipTabs 컴포넌트 Variant, Size 변경 및 디자인 수정

  - variant `neutralOutline` 추가
  - variant `brandSolid` deprecated
  - size(`medium(default)` | `large`) 추가

- 12faf5a: List 컴포넌트를 추가하고, Checkbox 및 Radio 컴포넌트를 개선합니다.

  - List 컴포넌트를 제공하여, 정보를 구조화된 목록 형태로 표시할 수 있도록 합니다.
  - Checkbox와 Radio의 컨트롤 영역만을 표시하는 Checkmark와 RadioMark를 제공합니다.
  - Select Box에서 컨트롤 영역을 Checkmark와 RadioMark로 교체합니다.
  - RadioGroup 컴포넌트를 제공합니다.

## 0.1.1

### Patch Changes

- 35984d0: Chip 컴포넌트를 업데이트합니다.

  - 아이콘에 트랜지션 효과가 적용되지 않던 현상을 수정합니다.
  - Button, Toggle 등 사용되는 방식에 따라 적절한 data prop을 받도록 수정합니다.

## 0.1.0

### Minor Changes

- 8448880: 시맨틱 stroke 컬러 토큰을 업데이트합니다.

  **이름이 변경되는 stroke 토큰**

  - [Color Role 규칙](https://seed-design.io/docs/foundation/color/color-role)에 맞춰 일관적인 토큰 이름을 유지할 수 있도록 업데이트합니다.
  - 이름이 변경되는 stroke 토큰을 사용하고 있는 경우, 간단한 Find & Replace 마이그레이션이 필요합니다.

  | 기존                            | 신규                            | 비고                               |
  | ------------------------------- | ------------------------------- | ---------------------------------- |
  | **$color.stroke.neutral-muted** | $color.stroke.neutral-subtle    | 가장 먼저 마이그레이션해야 합니다. |
  | $color.stroke.on-image          | $color.stroke.neutral-subtle    |
  | $color.stroke.neutral           | **$color.stroke.neutral-muted** |
  | $color.stroke.field-focused     | $color.stroke.neutral-contrast  |
  | $color.stroke.control           | $color.stroke.neutral-weak      |
  | $color.stroke.field             | $color.stroke.neutral-weak      |
  | $color.stroke.brand             | $color.stroke.brand-weak        |
  | $color.stroke.positive          | $color.stroke.positive-weak     |
  | $color.stroke.informative       | $color.stroke.informative-weak  |
  | $color.stroke.warning           | $color.stroke.warning-weak      |
  | $color.stroke.critical          | $color.stroke.critical-weak     |

  **색상이 변경되는 stroke 토큰 (마이그레이션 불필요)**

  `$color.stroke.neutral-contrast` (이름 변경 전 `$color.stroke.field-focused`)

  모든 theme mode에서 `$color.palette.gray-800` → `$color.palette.gray-1000`로 변경되었습니다.

  **신규 stroke 토큰 (마이그레이션 불필요)**

  | 신규                            |
  | ------------------------------- |
  | $color.stroke.neutral-solid     |
  | $color.stroke.brand-solid       |
  | $color.stroke.positive-solid    |
  | $color.stroke.informative-solid |
  | $color.stroke.warning-solid     |
  | $color.stroke.critical-solid    |

## 0.0.6

### Patch Changes

- 8299ba9: Snackbar 컴포넌트를 업데이트합니다.

  - root 영역에 maxWidth 스펙을 추가합니다.
  - `pauseOnInteraction`의 기본값을 `false`에서 `true`로 변경합니다.

## 0.0.5

### Patch Changes

- f806356: Page Banner 컴포넌트를 추가합니다. Inline Banner 컴포넌트를 deprecate합니다.

  - Inline Banner 컴포넌트 대비 모든 `tone`에서 모든 `variant`를 지원하며, 내부 Button의 충분한 터치 영역을 보장합니다.

  ```tsx
  <PageBanner
    tone="informative"
    variant="weak"
    description="사업자 정보를 등록해주세요."
    suffix={
      <PageBannerButton asChild>
        <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
          새 탭에서 열기
        </a>
      </PageBannerButton>
    }
  />
  ```

  시맨틱 색상 토큰을 추가하고 수정합니다.

  - `$color.bg.positive-solid-pressed`: theme-dark에서 `$color.palette.green-500` → `$color.palette.green-600`
  - `$color.bg.warning-solid-pressed` 추가

- 1982494: Badge 컴포넌트를 업데이트합니다.

  - `tone=warning` variant를 추가합니다.
  - `maxWidth` 스펙을 추가합니다.

  신규 시맨틱 색상 토큰을 추가합니다.

  - `$color.fg.warning`
  - `$color.stroke.warning`
  - `$color.fg.brand-contrast`
  - `$color.bg.brand-weak`
  - `$color.bg.brand-weak-pressed`

## 0.0.4

### Patch Changes

- 0be9b00: Avatar, Avatar Stack 컴포넌트에 `size=108` variant를 추가합니다.

## 0.0.3

### Patch Changes

- 5a025b7: Switch 컴포넌트를 업데이트합니다.

  - size: medium → 32, small → 16으로 rename합니다.
    - (React) `size="medium"`으로 `32`, `size="small"`로 `16`을 사용할 수 있습니다. (deprecated)
  - size: 24를 추가합니다.
  - 모든 size에 대해 레이블 스타일을 추가합니다. (기존: small에만 존재)

## 0.0.2

### Patch Changes

- 235147d: action-button: `size=medium, layout=withText` variant에서 gap을 1 → 1.5로 수정합니다.
- 3c13ad7: `highlight-magic-pressed` 그라디언트 토큰을 추가합니다.

## 0.0.1

### Patch Changes

- 861ecb4: Menu Sheet 컴포넌트를 추가하는 동시에 Action Sheet과 Extended Action Sheet 컴포넌트를 deprecate합니다.

  - [Menu Sheet React 문서](https://seed-design.io/react/components/menu-sheet)
  - Menu Sheet는 기존 Extended Action Sheet의 모든 기능을 포함하는 동시에, `labelAlign` prop으로 `MenuSheetItem`를 `left` 또는 `center`로 정렬할 수 있습니다.
