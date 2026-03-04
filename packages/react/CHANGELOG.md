# @seed-design/react

## 1.2.6

### Patch Changes

- 77cdc0e: IdentityPlaceholder의 스타일과 글리프를 업데이트하고, `identity="business"` variant를 추가합니다.
- Updated dependencies [fe1cdb3]
- Updated dependencies [751e952]
- Updated dependencies [7e0728a]
  - @seed-design/react-slider@1.0.2
  - @seed-design/react-field-button@1.0.2
  - @seed-design/react-toggle@1.0.1

## 1.2.5

### Patch Changes

- 434de88: PullToRefresh.Root의 ref 타입을 실제 렌더링 요소인 HTMLDivElement로 수정해 잘못된 SVG ref 타입 요구를 해결했습니다.
- 6fb6dc2: AspectRatio 스타일시트의 `position: relative`와 `overflow: hidden` 선언을 React 레이어로 이동하여 CSS specificity 문제를 수정합니다.
- Updated dependencies [c46d593]
- Updated dependencies [0420c89]
  - @seed-design/react-image@0.1.1
  - @seed-design/react-drawer@1.0.9

## 1.2.4

### Patch Changes

- a3e6859: ImageFrame `rounded` 옵션을 제거하고, borderRadius를 받을 수 있게 변경합니다
- 4287600: BottomSheet title 영역에서 닫기 버튼 간격에 따라 조정된 padding 기준으로 정리하고, word-break 추가 및 description 영역 너비를 정리했습니다.

## 1.2.3

### Patch Changes

- Updated dependencies [acae645]
  - @seed-design/react-snackbar@1.0.1

## 1.3.0

### Patch Changes

- 576c2e6: `AlertDialogRoot`, `MenuSheetRoot` 및 `BottomSheetRoot`의 `onOpenChange` 두 번째 인자로 `details`를 제공합니다. `details.reason`과 `details.event`를 사용할 수 있습니다.

  `DialogAction`을 `DialogPrimitive.CloseButton`으로 교체합니다. `AlertDialogAction` `onClick` 핸들러에서 `event.preventDefault()`를 호출하여 닫기 동작을 방지할 수 있습니다. [(예제)](https://seed-design.io/react/components/alert-dialog#prevent-close)

- Updated dependencies [576c2e6]
  - @seed-design/react-dialog@1.0.2
  - @seed-design/react-drawer@1.0.8

## 1.2.1

### Patch Changes

- 8ad9484: ImageFrameReactionButton의 SVG 사이즈와 Rootage 정의를 수정합니다.
- Updated dependencies [8188130]
- Updated dependencies [9cbeba0]
  - @seed-design/react-drawer@1.0.6

## 1.2.0

### Minor Changes

- 0ecb893: [Help Bubble](/react/components/help-bubble) 관련 컴포넌트를 업데이트합니다.

  - **1.1 → 1.2 업그레이드 시 snippet 업데이트 필요**: `HelpBubbleTrigger` 및 `HelpBubbleAnchor`의 내부 구조가 변경되었습니다. snippet을 다시 내려받아 주세요.
    - `npx @seed-design/cli@latest add ui:help-bubble`
    - **인터페이스 변경사항이 없으므로 `HelpBubbleAnchor`와 `HelpBubbleTrigger`를 사용하는 기존 코드를 변경할 필요가 없습니다.**
    - `HelpBubble.Body`를 사용하여 `HelpBubble.Title`과 `HelpBubble.Description`을 감싸도록 변경되었습니다.
    - `zIndexOffset`을 활용하여 `HelpBubble.Positioner`의 z-index를 조정할 수 있습니다. ([예시](/react/components/help-bubble#z-index-offset))

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

- a0e40ca: [Tag Group](/react/components/tag-group) 관련 컴포넌트를 업데이트합니다.

  - `TagGroupItem` 레이블 내부에서 줄바꿈이 발생할 수 있도록 수정합니다. (기존: `TagGroupItem` 또는 separator 전후에서 줄바꿈 발생)
  - 한 줄 레이아웃 및 우선순위 옵션을 추가합니다.
    - `TagGroupRoot`에 `truncate` prop을 사용하여 한 줄로 유지하고 말줄임 처리를 할 수 있습니다. (기본값: `false`)
    - `TagGroupItem`에 `flexShrink` prop을 사용하여 말줄임 우선순위를 조정할 수 있습니다.
  - **1.1 → 1.2 업그레이드 시 변경 필요**: `TagGroupItem` 내부 레이블을 `TagGroupItemLabel`로 감싸거나, 신규로 제공되는 Snippet에서 제공하는 API로 교체해주세요.

    - `npx @seed-design/cli@latest add ui:tag-group` 명령어로 Snippet을 추가할 수 있습니다.

    ```tsx
    // 전
    import { TagGroupRoot, TagGroupItem } from "@seed-design/react";

    {
      /* TagGroup.Root, TagGroup.Item처럼 namespace import하는 코드가 있을 수 있습니다. */
    }
    <TagGroupRoot>
      <TagGroupItem>
        <PrefixIcon svg={<IconLocationpinFill />} />
        서초4동
      </TagGroupItem>
      <TagGroupItem>
        광고
        <Icon svg={<IconMegaphoneFill />} color="fg.brand" />
      </TagGroupItem>
      {/* ... */}
    </TagGroupRoot>;
    ```

    ```tsx
    // 후 (Compound Component 유지)

    import {
      TagGroupRoot,
      TagGroupItem,
      TagGroupItemLabel,
    } from "@seed-design/react";

    <TagGroupRoot>
      <TagGroupItem>
        <PrefixIcon svg={<IconLocationpinFill />} />
        {/* TagGroupItemLabel 사용 */}
        <TagGroupItemLabel>서초4동</TagGroupItemLabel>
      </TagGroupItem>
      <TagGroupItem>
        {/* TagGroupItemLabel 사용 */}
        <TagGroupItemLabel>광고</TagGroupItemLabel>
        <Icon svg={<IconMegaphoneFill />} color="fg.brand" />
      </TagGroupItem>
      {/* ... */}
    </TagGroupRoot>;
    ```

    ```tsx
    // 후 (snippet API로 교체)
    // snippet 없는 경우, `npx @seed-design/cli@latest add ui:tag-group`

    import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";
    import {
      TagGroupRoot as SeedTagGroupRoot,
      TagGroupItem as SeedTagGroupItem,
      TagGroupItemLabel as SeedTagGroupItemLabel,
    } from "@seed-design/react";

    <TagGroupRoot>
      <TagGroupItem label="서초4동" prefixIcon={<IconLocationpinFill />} />
      <SeedTagGroupItem>
        <SeedTagGroupItemLabel>광고</SeedTagGroupItemLabel>
        {/* 아이콘 커스터마이징이 필요한 경우 snippet 대신 Compound Component를 사용합니다. */}
        <Icon svg={<IconMegaphoneFill />} color="fg.brand" />
      </SeedTagGroupItem>
      {/* ... */}
    </TagGroupRoot>;
    ```

- 358a1e4: [Menu Sheet](/react/components/menu-sheet) 관련 컴포넌트를 업데이트합니다.

  - `MenuSheetContent`에 설명을 추가할 수 있는 `description` prop이 추가되었습니다.
  - `MenuSheetItem`에 설명을 추가할 수 있는 `description` prop이 추가되었습니다.
  - **1.1 → 1.2 업그레이드 시 변경 필요**: snippet을 다시 내려받고, `MenuSheetItem`을 사용하는 코드를 아래와 같이 변경하세요.

    - `npx @seed-design/cli@latest add ui:menu-sheet`
    - `children` 대신 `label` prop을 사용합니다.
    - `description`, `prefixIcon` prop이 추가되었습니다.

    ```tsx
    // 전
    <MenuSheetItem>
      <PrefixIcon svg={<IconHouseLine />} />
      메뉴 항목
    </MenuSheetItem>

    // 후
    <MenuSheetItem
      prefixIcon={<IconHouseLine />}
      label="메뉴 항목"
      description="이제 설명도 추가할 수 있어요"
    />
    ```

### Patch Changes

- 477ec8a: [`Grid` 및 `GridItem`](/react/components/layout/grid) 레이아웃 유틸리티 컴포넌트를 추가합니다.
- Updated dependencies [98dbac4]
- Updated dependencies [2643d17]
- Updated dependencies [cfd2df4]
- Updated dependencies [cfd2df4]
  - @seed-design/react-radio-group@1.1.0
  - @seed-design/react-collapsible@0.1.0
  - @seed-design/react-fieldset@0.1.0
  - @seed-design/react-image@0.1.0

## 1.1.17

### Patch Changes

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

- Updated dependencies [db49a84]
- Updated dependencies [6fab0e7]
- Updated dependencies [5faef3a]
- Updated dependencies [50ee0a6]
- Updated dependencies [94bebf8]
- Updated dependencies [8495fae]
  - @seed-design/css@1.1.17

## 1.1.16

### Patch Changes

- 10c0765: 배너 템플릿에 사용되는 `$color.banner.*` 색상 토큰을 추가합니다.
- Updated dependencies [2f29fe8]
- Updated dependencies [9119723]
- Updated dependencies [6d30b72]
- Updated dependencies [10c0765]
- Updated dependencies [5e462db]
  - @seed-design/css@1.1.16

## 1.1.13

### Patch Changes

- cc4a45a: 신규 [Elevation 가이드](https://seed-design.io/docs/foundation/elevation)에 맞는 shadow 토큰을 추가합니다.

  - React: Box, Flex, HStack 등 StyleProps를 사용하는 컴포넌트에서 `boxShadow` prop을 사용하여 shadow 토큰을 쉽게 사용할 수 있습니다.

- 8f54b80: unicode-segmenter 0.14.4 버전을 설치합니다.
- fce8668: Divider 자체적으로 16px의 여백을 가지는 `inset` 옵션을 추가합니다.
- Updated dependencies [9be0581]
- Updated dependencies [cc4a45a]
- Updated dependencies [739937f]
  - @seed-design/css@1.1.13

## 1.1.12

### Patch Changes

- Updated dependencies [8d0ad90]
- Updated dependencies [8f31f93]
- Updated dependencies [69ccc6e]
- Updated dependencies [279001a]
  - @seed-design/css@1.1.12
  - @seed-design/react-dialog@1.0.1
  - @seed-design/react-drawer@1.0.5

## 1.1.10

### Patch Changes

- a2b874b: `TagGroupRoot`의 children이 `null` 또는 `undefined`를 포함하는 경우 불필요한 separator가 표시되는 문제를 수정합니다.
- 12ffece: peerDeps에 `@seed-design/css` 패키지가 추가됩니다.
- db5de74: PageBanner에 tone="magic" 스타일을 추가합니다.
- a12e49b: Field(TextField)의 스타일을 수정합니다.

  - `maxGraphemeCount`를 사용하지만 `description`을 사용하지 않는 경우 `maxGraphemeCount`가 우측이 아닌 좌측에 표시되는 문제를 수정합니다.
  - Tailwind Preflight 사용 시 Character Count 영역이 디자인 의도보다 높이를 더 많이 차지하는 문제를 수정합니다.

- Updated dependencies [db5de74]
- Updated dependencies [70d11b8]
- Updated dependencies [938bf0b]
- Updated dependencies [c03a3dd]
- Updated dependencies [a12e49b]
  - @seed-design/css@1.1.10
  - @seed-design/react-tabs@1.0.2

## 1.1.8

### Patch Changes

- 8752805: List Item에 신규 active(pressed) 스타일을 적용하고, disabled 상태에서 detail 영역의 색상을 수정합니다.
- 8edbf00: @seed-design/react에서 unicode-segmenter가 externalize되지 않는 문제를 수정합니다.
- e3806c1: BottomSheet에 handleOnly 옵션이 정상적으로 동작하지 않는 이슈를 수정합니다
- Updated dependencies [e3806c1]
  - @seed-design/react-drawer@1.0.4

## 1.1.7

### Patch Changes

- f4c62f6: Scroll Fog 컴포넌트가 항상 fog를 표시하게 변경하고 padding 가이드라인을 추가합니다
- 1340675: Slider Value Indicator가 표시되는 조건을 설정하는 `valueIndicatorTrigger` prop을 추가합니다. ("active"|"hover", 기본값: "active")
- 1340675: Slider Value Indicator가 Track 양 끝에 있을 때 Track 바깥 영역을 차지하지 않도록 수정합니다.
- Updated dependencies [1340675]
- Updated dependencies [1340675]
  - @seed-design/react-slider@1.0.1

## 1.1.5

### Patch Changes

- 03ff678: BottomSheetBody에 제공한 style 관련 prop(`paddingX` 등)이 적용되지 않고 DOM으로 bleed되는 문제를 수정합니다.
- ae1b768: :focus-visible selector를 사용하기 전 브라우저에서 selector를 지원하는지 확인합니다.
- Updated dependencies [53290ab]
- Updated dependencies [cc8864d]
- Updated dependencies [ae1b768]
  - @seed-design/react-field-button@1.0.1
  - @seed-design/react-drawer@1.0.3
  - @seed-design/react-segmented-control@1.0.1
  - @seed-design/react-radio-group@1.0.1
  - @seed-design/react-text-field@1.1.1
  - @seed-design/react-checkbox@1.0.1
  - @seed-design/react-switch@1.0.1
  - @seed-design/react-field@1.0.1
  - @seed-design/react-tabs@1.0.1

## 1.1.4

### Patch Changes

- 77d304d: `@radix-ui/react-dialog` 의존성을 추가해 React 패키지를 Portable하게 수정합니다

## 1.1.3

### Patch Changes

- 2c302a5: PopoverPositionerPortal과 HelpBubblePositionerPortal을 추가합니다.
- bc3cd6f: ScrollFog 컴포넌트를 추가합니다
- Updated dependencies [2c302a5]
- Updated dependencies [bc3cd6f]
- Updated dependencies [4102a4b]
- Updated dependencies [e272ef8]
- Updated dependencies [fbc9cb0]
- Updated dependencies [4971dcc]
  - @seed-design/react-popover@1.0.3
  - @seed-design/react-scrollable@1.0.0
  - @seed-design/react-drawer@1.0.2

## 1.1.1

### Patch Changes

- Updated dependencies [68b5eab]
  - @seed-design/react-drawer@1.0.1

## 1.1.0

### Minor Changes

- a55f584: Slider 컴포넌트를 추가합니다.
- 191005f: Action Button 컴포넌트를 `variant=ghost`로 사용하는 경우 `fontWeight`를 사용자화할 수 있도록 업데이트합니다.

  (BREAKING CHANGE: Error State snippet을 다시 설치해야 합니다.) Error State 스니펫에서 Action Button을 활용하도록 업데이트합니다.

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

- Updated dependencies [d6bb84d]
- Updated dependencies [a55f584]
- Updated dependencies [33def2d]
- Updated dependencies [0c1ab6a]
  - @seed-design/react-field-button@1.0.0
  - @seed-design/react-text-field@1.1.0
  - @seed-design/react-slider@1.0.0
  - @seed-design/react-field@1.0.0
  - @seed-design/react-drawer@1.0.0
  - @seed-design/react-popover@1.0.2

## 1.0.7

### Patch Changes

- Updated dependencies [e52d6d1]
- Updated dependencies [97669bc]
- Updated dependencies [15ab93a]
- Updated dependencies [50366c0]
  - @seed-design/css@1.0.7

## 1.0.6

### Patch Changes

- 6aafce0: Tag Group 컴포넌트를 추가합니다. Tag Group은 아이콘 및 텍스트로 이루어진 태그를 구분 기호와 함께 수평 레이아웃으로 표시하는 컴포넌트입니다.
- f2ddf29: Article 유틸리티 컴포넌트를 추가하고 Text 컴포넌트를 업데이트합니다.

  - Article 컴포넌트는 일관된 selection 스타일 및 줄바꿈 정책을 사용할 수 있게 돕습니다.
  - Text 컴포넌트에서 textDecorationLine="underline" 및 whiteSpace, userSelect prop을 지원합니다.

- Updated dependencies [6aafce0]
- Updated dependencies [1902dfa]
- Updated dependencies [f2ddf29]
- Updated dependencies [4c33f07]
- Updated dependencies [3df657f]
  - @seed-design/css@1.0.6

## 1.0.5

### Patch Changes

- 687b261: `PullToRefresh.preventPull`을 활용하여 `PullToRefreshContent` 내부에서 당겨서 새로고침(PTR) 동작을 비활성화할 수 있습니다.
- a839fd2: 실제 기본값을 표시하도록 JSDoc을 업데이트합니다.
- Updated dependencies [f1cf4cd]
- Updated dependencies [687b261]
- Updated dependencies [9b91751]
- Updated dependencies [3898183]
  - @seed-design/css@1.0.5
  - @seed-design/react-pull-to-refresh@1.0.1

## 1.0.4

### Patch Changes

- Updated dependencies [b10ff0b]
  - @seed-design/react-popover@1.0.1

## 1.0.3

### Patch Changes

- Updated dependencies [0b8a02e]
- Updated dependencies [6c6099d]
  - @seed-design/css@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [6d2e13d]
  - @seed-design/css@1.0.2

## 1.0.1

### Patch Changes

- Updated dependencies [1420b68]
  - @seed-design/css@1.0.1

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

- a7d07f0: (**BREAKING CHANGE**: `SwitchMark` 사용을 위해서는 Snippet을 다시 설치해야 합니다.) Switch의 토글 영역만을 정의한 Switch Mark 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:switch` 명령어로 설치하세요.

  (**BREAKING CHANGE**: `ListHeader` 사용을 위해서는 Snippet을 다시 설치해야 합니다.) List Header 컴포넌트를 추가합니다.

  - `npx @seed-design/cli@latest add ui:list` 명령어로 설치하세요.

- Updated dependencies [39a96f1]
- Updated dependencies [34f92f2]
- Updated dependencies [e038490]
- Updated dependencies [4153ca5]
- Updated dependencies [a7d07f0]
  - @seed-design/css@1.0.0
  - @seed-design/react-avatar@1.0.0
  - @seed-design/react-checkbox@1.0.0
  - @seed-design/react-dialog@1.0.0
  - @seed-design/react-popover@1.0.0
  - @seed-design/react-portal@1.0.0
  - @seed-design/react-primitive@1.0.0
  - @seed-design/react-progress@1.0.0
  - @seed-design/react-pull-to-refresh@1.0.0
  - @seed-design/react-radio-group@1.0.0
  - @seed-design/react-segmented-control@1.0.0
  - @seed-design/react-snackbar@1.0.0
  - @seed-design/react-switch@1.0.0
  - @seed-design/react-tabs@1.0.0
  - @seed-design/react-text-field@1.0.0
  - @seed-design/react-toggle@1.0.0
  - @seed-design/dom-utils@1.0.0

## 0.2.5

### Patch Changes

- Updated dependencies [0ca19c0]
- Updated dependencies [11f5e76]
  - @seed-design/css@0.2.5
  - @seed-design/react-snackbar@0.0.7

## 0.2.4

### Patch Changes

- 8ebe8a5: Switch, Checkmark, Radio Mark의 스타일을 업데이트합니다.

  - tone=neutral variant를 추가합니다.
  - Switch의 thumb 크기를 조정합니다.

  Checkbox와 Radio의 weight variant를 default, stronger에서 regular, bold로 수정합니다.

- Updated dependencies [8ebe8a5]
- Updated dependencies [f61b80d]
- Updated dependencies [ce047f5]
  - @seed-design/css@0.2.4
  - @seed-design/react-tabs@0.0.9

## 0.2.3

### Patch Changes

- 12faf5a: List 컴포넌트를 추가하고, Checkbox 및 Radio 컴포넌트를 개선합니다.

  - List 컴포넌트를 제공하여, 정보를 구조화된 목록 형태로 표시할 수 있도록 합니다.
  - Checkbox와 Radio의 컨트롤 영역만을 표시하는 Checkmark와 RadioMark를 제공합니다.
  - Select Box에서 컨트롤 영역을 Checkmark와 RadioMark로 교체합니다.
  - RadioGroup 컴포넌트를 제공합니다.

- Updated dependencies [a22b8b9]
- Updated dependencies [5836976]
- Updated dependencies [12faf5a]
  - @seed-design/css@0.2.3

## 0.2.2

### Patch Changes

- 9d93518: Text 컴포넌트의 fontSize, lineHeight, color 속성에 string도 사용 가능하도록 변경했습니다.

## 0.2.1

### Patch Changes

- 35984d0: Chip 컴포넌트를 업데이트합니다.

  - 아이콘에 트랜지션 효과가 적용되지 않던 현상을 수정합니다.
  - Button, Toggle 등 사용되는 방식에 따라 적절한 data prop을 받도록 수정합니다.

- c5bed96: Divider 컴포넌트가 `$color.stroke.neutral-muted` 색상을 기본값으로 사용하도록 수정합니다.
- Updated dependencies [35984d0]
  - @seed-design/css@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [8448880]
  - @seed-design/css@0.2.0

## 0.1.15

### Patch Changes

- c51a261: font-size, line-height 토큰에 static variant를 추가합니다.

  - `--seed-font-size-t1-static` ~ `--seed-font-size-t10-static`
  - `--seed-line-height-t1-static` ~ `--seed-line-height-t10-static`

- 9a3c76a: Divider 컴포넌트를 업데이트합니다.

  - `orientation`을 지정할 수 있습니다.
  - Divider를 `li`로 렌더링하여 `ol`, `ul` 내부에서 사용할 수 있습니다.
  - Divider를 `div` 또는 `li`로 렌더링하는 경우에도 `role="separator"`를 지정하여 스크린 리더가 Divider를 읽도록 할 수 있습니다.

- Updated dependencies [c51a261]
- Updated dependencies [5f2ee39]
- Updated dependencies [8299ba9]
- Updated dependencies [3de4cec]
  - @seed-design/css@0.1.15
  - @seed-design/react-snackbar@0.0.6

## 0.1.14

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

- Updated dependencies [f806356]
- Updated dependencies [1982494]
  - @seed-design/css@0.1.14

## 0.1.13

### Patch Changes

- Updated dependencies [0be9b00]
  - @seed-design/css@0.1.13

## 0.1.12

### Patch Changes

- 62094b6: Help Bubble의 스타일 문제를 수정합니다.

  - `placement=left-*` / `placement=right-*`에서 arrow가 content와 떨어져 표시되는 문제를 수정합니다.

- Updated dependencies [62094b6]
  - @seed-design/react-popover@0.0.8
  - @seed-design/css@0.1.12

## 0.1.11

### Patch Changes

- 9993e0e: 레이아웃 컴포넌트를 사용할 때 `flexGrow`, `flexShrink`, `flexWrap`에도 `true`를 사용할 수 있도록 수정합니다.

  Figma 레이어가 이미지 Fill을 가지고 있는 경우 `<img />` 요소를 prepend합니다.

## 0.1.10

### Patch Changes

- Updated dependencies [ef91c21]
  - @seed-design/css@0.1.10

## 0.1.9

### Patch Changes

- 5a025b7: Switch 컴포넌트를 업데이트합니다.

  - size: medium → 32, small → 16으로 rename합니다.
    - (React) `size="medium"`으로 `32`, `size="small"`로 `16`을 사용할 수 있습니다. (deprecated)
  - size: 24를 추가합니다.
  - 모든 size에 대해 레이블 스타일을 추가합니다. (기존: small에만 존재)

- f9041e9: `CheckSelectBox`, `RadioSelectBox`의 `label`, `description` 영역을 수정합니다.

  - `span` 대신 `div`를 렌더링합니다.
  - 기본적으로 grow하도록 만들어 Badge 등 추가 요소를 넣기 쉽게 만듭니다.

- Updated dependencies [5a025b7]
- Updated dependencies [ac35731]
- Updated dependencies [f9041e9]
  - @seed-design/css@0.1.9

## 0.1.8

### Patch Changes

- Updated dependencies [609b8f3]
  - @seed-design/css@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies [4afe80b]
  - @seed-design/css@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [235147d]
- Updated dependencies [3c13ad7]
  - @seed-design/css@0.1.6

## 0.1.5

### Patch Changes

- 861ecb4: Menu Sheet 컴포넌트를 추가하는 동시에 Action Sheet과 Extended Action Sheet 컴포넌트를 deprecate합니다.

  - [Menu Sheet React 문서](https://seed-design.io/react/components/menu-sheet)
  - Menu Sheet는 기존 Extended Action Sheet의 모든 기능을 포함하는 동시에, `labelAlign` prop으로 `MenuSheetItem`를 `left` 또는 `center`로 정렬할 수 있습니다.

- Updated dependencies [861ecb4]
- Updated dependencies [3889eb6]
  - @seed-design/css@0.1.5

## 0.1.4

### Patch Changes

- 0ffcd48: Chip 컴포넌트가 추가되고, ActionChip, ControlChip 컴포넌트가 Deprecated 되었습니다.

  - [Chip 컴포넌트](https://seed-design.io/react/components/chip)
  - Chip 컴포넌트는 버튼과 토글 컴포넌트를 모두 포함하고 있습니다.

- 56e03ca: Layout 컴포넌트 `pb`, `pt`, `paddingBottom`, `paddingTop` 속성에 `safeArea` 값을 지정할 수 있도록 지원

  ```tsx
  <Box pt="safeArea" paddingTop="safeArea" />
  <Box pb="safeArea" paddingBottom="safeArea" />
  ```

- Updated dependencies [0ffcd48]
  - @seed-design/css@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [cdc0930]
- Updated dependencies [946faf7]
- Updated dependencies [71c58fd]
  - @seed-design/css@0.1.3

## 0.1.2

### Patch Changes

- 00eafa3: package.json에 `types` 필드를 추가합니다.
- Updated dependencies [7b2c0f3]
  - @seed-design/css@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [e3b782d]
  - @seed-design/css@0.1.1

## 0.1.0

### Minor Changes

- b0f7a4e: AI Gradient 관련 토큰을 추가합니다. (0.0.41)

  - direction 관련 속성을 css property에 맞게 변경합니다. (0.1.0)

- 7cc6087: HelpBubble의 arrow가 상위 요소의 font-size에 영향을 받는 것을 수정합니다
- bdca898: BottomSheet의 description font-size를 t5로 변경합니다

### Patch Changes

- Updated dependencies [7cc6087]
- Updated dependencies [bdca898]
  - @seed-design/css@0.1.0

## 0.0.41

### Patch Changes

- 561f74c: Text 컴포넌트에 `textDecorationLine` 옵션을 추가합니다.
- b43de05: Gradient 컬러를 추가합니다
- Updated dependencies [561f74c]
- Updated dependencies [b43de05]
  - @seed-design/css@0.0.41

## 0.0.39

### Patch Changes

- Updated dependencies [f801300]
  - @seed-design/css@0.0.39

## 0.0.38

### Patch Changes

- 145b718: Float 컴포넌트의 기본 display를 inline-flex로 변경합니다.
- 70fbaaf: Action Button에 type="ghost"를 추가합니다.
- Updated dependencies [70fbaaf]
  - @seed-design/css@0.0.38

## 0.0.35

### Patch Changes

- Updated dependencies [0789dc8]
  - @seed-design/css@0.0.35

## 0.0.34

### Patch Changes

- 2fc411d: Icon 컴포넌트의 size, color style prop 타입을 다른 컴포넌트와 동일하게 수정합니다.
- Updated dependencies [92801a2]
  - @seed-design/css@0.0.34

## 0.0.33

### Patch Changes

- fbdb091: Style prop에 `_active`를 추가합니다. background 속성만을 지원합니다.
- Updated dependencies [fbdb091]
  - @seed-design/css@0.0.33

## 0.0.32

### Patch Changes

- e9db89f: 레이아웃 컴포넌트에 `asChild` 속성을 추가합니다.
- abfda51: Text 컴포넌트에 ref forwarding을 추가합니다.

## 0.0.31

### Patch Changes

- 408d7ef: Icon 컴포넌트의 size의 IDE 자동완성을 개선합니다.
- fd7c569: - Tabs.Carousel을 사용하는 경우 Hydration 이후 스크롤 애니매이션이 발생하는 문제를 수정합니다.
  - Tabs.Carousel의 드래그 제스처를 방지하는 영역을 선언할 수 있는 `Tabs.carouselPreventDrag` api를 추가합니다.
  - layout=hug일 때 Indicator에서 발생하는 Layout Shift를 수정합니다.
  - lazyMount 옵션이 의도와 다르게 모든 탭이 한꺼번에 마운트되는 문제를 수정합니다.
- Updated dependencies [fd7c569]
  - @seed-design/react-tabs@0.0.8
  - @seed-design/css@0.0.31

## 0.0.30

### Patch Changes

- 4610b5b: PullToRefresh에 disabled prop을 추가합니다.
- 739b6bf: Tabs.Indicator의 width가 첫 렌더링 시 0으로 설정되는 문제를 수정합니다.

  Tabs의 불필요한 리렌더링을 줄입니다.

- 285cb9b: - `ContextualFloatingButton`과 `FloatingActionButton` 컴포넌트를 제공합니다.
  - 기존의 `Fab` 및 `ExtendedFab`를 deprecate합니다.
  - Floating 요소들의 위치를 편리하게 제어하도록 `Float` 유틸리티 컴포넌트를 제공합니다.
- Updated dependencies [4610b5b]
- Updated dependencies [739b6bf]
- Updated dependencies [285cb9b]
  - @seed-design/react-pull-to-refresh@0.0.6
  - @seed-design/react-tabs@0.0.7
  - @seed-design/css@0.0.30

## 0.0.29

### Patch Changes

- 29ec9f0: `reactSlot.createSlot is not a function` 오류가 발생하지 않도록, radix-ui/react-slot 버전을 1.2.3으로 수정합니다.
- Updated dependencies [116ee2c]
- Updated dependencies [29ec9f0]
  - @seed-design/css@0.0.29
  - @seed-design/react-primitive@0.0.3
  - @seed-design/react-avatar@0.0.4
  - @seed-design/react-checkbox@0.0.4
  - @seed-design/react-dialog@0.0.5
  - @seed-design/react-popover@0.0.7
  - @seed-design/react-progress@0.0.4
  - @seed-design/react-pull-to-refresh@0.0.5
  - @seed-design/react-radio-group@0.0.4
  - @seed-design/react-segmented-control@0.0.5
  - @seed-design/react-snackbar@0.0.5
  - @seed-design/react-switch@0.0.4
  - @seed-design/react-tabs@0.0.6
  - @seed-design/react-text-field@0.0.4
  - @seed-design/react-toggle@0.0.4

## 0.0.28

### Patch Changes

- Updated dependencies [5337e14]
  - @seed-design/css@0.0.28

## 0.0.27

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.
- Updated dependencies [9d85c16]
- Updated dependencies [d951317]
- Updated dependencies [7851a31]
- Updated dependencies [b3f964d]
  - @seed-design/css@0.0.27
  - @seed-design/react-segmented-control@0.0.4
  - @seed-design/react-pull-to-refresh@0.0.4
  - @seed-design/react-radio-group@0.0.3
  - @seed-design/react-text-field@0.0.3
  - @seed-design/react-checkbox@0.0.3
  - @seed-design/react-progress@0.0.3
  - @seed-design/react-snackbar@0.0.4
  - @seed-design/react-popover@0.0.6
  - @seed-design/react-avatar@0.0.3
  - @seed-design/react-dialog@0.0.4
  - @seed-design/react-portal@0.0.2
  - @seed-design/react-switch@0.0.3
  - @seed-design/react-toggle@0.0.3
  - @seed-design/react-tabs@0.0.5

## 0.0.25

### Patch Changes

- c87ede9: Avatar Stack의 디자인을 업데이트합니다.
- Updated dependencies [c87ede9]
  - @seed-design/css@0.0.25

## 0.0.24

### Patch Changes

- 4da536f: ActionSheet의 header가 렌더링되지 않을 때 상단 radius가 누락되는 버그를 수정합니다.
- 3efe201: `<Portal>` 컴포넌트를 제공합니다.
- Updated dependencies [4da536f]
- Updated dependencies [3efe201]
  - @seed-design/css@0.0.24
  - @seed-design/react-portal@0.0.1

## 0.0.23

### Patch Changes

- Updated dependencies [63e1541]
  - @seed-design/css@0.0.23

## 0.0.21

### Patch Changes

- 7ae87f8: 2개의 컨텐츠를 동일한 비율로 나누어 배치하되, 너무 긴 경우 세로로 접는 `<ResponsivePair>` 컴포넌트를 추가합니다.
- f144d28: BottomSheet, Dialog의 배경 색상을 layer-floating으로 변경합니다.
- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [5d69d1d]
- Updated dependencies [4d34760]
- Updated dependencies [7ae87f8]
- Updated dependencies [f144d28]
- Updated dependencies [e368c69]
  - @seed-design/css@0.0.21
  - @seed-design/react-segmented-control@0.0.3
  - @seed-design/react-pull-to-refresh@0.0.3
  - @seed-design/react-radio-group@0.0.2
  - @seed-design/react-text-field@0.0.2
  - @seed-design/react-primitive@0.0.2
  - @seed-design/react-checkbox@0.0.2
  - @seed-design/react-progress@0.0.2
  - @seed-design/react-snackbar@0.0.3
  - @seed-design/react-popover@0.0.5
  - @seed-design/react-avatar@0.0.2
  - @seed-design/react-dialog@0.0.3
  - @seed-design/react-switch@0.0.2
  - @seed-design/react-toggle@0.0.2
  - @seed-design/react-tabs@0.0.4
  - @seed-design/dom-utils@0.0.2

## 0.0.19

### Patch Changes

- Updated dependencies [3c9ec66]
- Updated dependencies [b3bb6e7]
  - @seed-design/css@0.0.19

## 0.0.17

### Patch Changes

- c042f90: recipe에서 직접 스타일시트 의존성을 표현하도록 변경합니다.
- Updated dependencies [c042f90]
  - @seed-design/css@0.0.17

## 0.0.15

### Patch Changes

- 1bb9f7b: - vite dev에서 컴포넌트 스타일시트가 로드되지 않는 버그를 수정합니다.
  - 플러그인이 컴포넌트 스타일시트를 로드하는 방식을 변경합니다.
- 4511814: - 레이아웃 및 flex 관련 shorthand prop을 추가합니다. (px, py, wrap, align, justify, direction)
  - ActionButton에 flexGrow prop을 추가합니다.
  - VStack, HStack 컴포넌트를 추가합니다.
    - Stack, Inline, Columns 컴포넌트를 deprecated 처리합니다.
  - 디자인 토큰이 아닌 css prop의 value가 유효한 css value가 되도록 변경합니다.
    - flexStart, spaceBetween 등 camelCase로 제공되는 값을 deprecated 처리합니다.
- d49e697: - Divider의 굵기가 의도보다 굵게 렌더링되는 버그 수정
  - borderColor, borderWidth 대신 color, thickness로 인터페이스 변경
- f4b0723: HelpBubble 디자인 스펙 업데이트 (shadow)
- f4b0723: HelpBubble의 enter, exit 모션을 추가합니다.
- Updated dependencies [1bb9f7b]
- Updated dependencies [4511814]
- Updated dependencies [f4b0723]
- Updated dependencies [f4b0723]
  - @seed-design/css@0.0.15
  - @seed-design/react-popover@0.0.4

## 0.0.14

### Patch Changes

- 87599b0: Divider 컴포넌트를 추가합니다.
- 92c0b80: HelpBubble 디자인 스펙 업데이트 (shadow)
- c1d94d0: HelpBubble의 enter, exit 모션을 추가합니다.
- Updated dependencies [92c0b80]
- Updated dependencies [c1d94d0]
  - @seed-design/css@0.0.14
  - @seed-design/react-popover@0.0.3

## 0.0.13

### Patch Changes

- 7fca755: Avatar의 Badge 스펙을 최신화합니다.
- Updated dependencies [7fca755]
- Updated dependencies [c0c0b7e]
  - @seed-design/css@0.0.13
  - @seed-design/react-pull-to-refresh@0.0.2

## 0.0.12

### Patch Changes

- 6426379: 유틸리티 컴포넌트에 사용되는 ScopedColorFg, ScopedColorBg, ScopedColorPalette, ScopedColorStroke 타입을 제공합니다.
- f5858ad: feat: icon scope를 `@daangn`에서 `@karrotmarket` 으로 변경해요
- Updated dependencies [fee050d]
- Updated dependencies [6426379]
- Updated dependencies [ee41f37]
  - @seed-design/react-tabs@0.0.3
  - @seed-design/css@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [e70f340]
- Updated dependencies [72f344f]
  - @seed-design/css@0.0.11

## 0.0.10

### Patch Changes

- e4b704c: Avatar size=42를 추가합니다.
- de5901d: Icon 컴포넌트에 color, size prop을 추가합니다.
- Updated dependencies [e4b704c]
- Updated dependencies [09fecb9]
  - @seed-design/css@0.0.10
  - @seed-design/react-segmented-control@0.0.2
  - @seed-design/react-snackbar@0.0.2
  - @seed-design/react-popover@0.0.2
  - @seed-design/react-dialog@0.0.2
  - @seed-design/react-tabs@0.0.2

## 0.0.9

### Patch Changes

- 63f8651: MannerTemp 컴포넌트를 추가합니다.
- Updated dependencies [63f8651]
- Updated dependencies [d9b01a9]
  - @seed-design/css@0.0.9

## 0.0.8

### Patch Changes

- 1424700: Notification Badge를 추가합니다.

  - Tabs의 Notification 슬롯을 Notification Badge로 변경합니다.

- Updated dependencies [1424700]
- Updated dependencies [0efeea1]
  - @seed-design/css@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies [8aca3de]
  - @seed-design/css@0.0.7

## 0.0.6

### Patch Changes

- 3d66c5b: visuallyHidden을 recipe에서 제거합니다.
- Updated dependencies [bf198e8]
- Updated dependencies [3d66c5b]
- Updated dependencies [a8d5242]
- Updated dependencies [ccf3989]
  - @seed-design/css@0.0.6

## 0.0.5

### Patch Changes

- e3234e7: single-slot recipe를 위한 간소화된 인터페이스를 추가합니다.
- Updated dependencies [e3234e7]
- Updated dependencies [5502bed]
  - @seed-design/css@0.0.5

## 0.0.4

### Patch Changes

- 6df5d19: Badge 디자인 업데이트
  - neutral tone 색상 변경
  - pill shape 삭제
- Updated dependencies [6df5d19]
- Updated dependencies [5cb50e7]
  - @seed-design/css@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [a33af94]
- Updated dependencies [b180822]
  - @seed-design/css@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [d04e344]
  - @seed-design/css@0.0.2

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.
- Updated dependencies [b64023c]
  - @seed-design/css@0.0.1
  - @seed-design/react-avatar@0.0.1
  - @seed-design/react-checkbox@0.0.1
  - @seed-design/react-dialog@0.0.1
  - @seed-design/react-popover@0.0.1
  - @seed-design/react-primitive@0.0.1
  - @seed-design/react-progress@0.0.1
  - @seed-design/react-pull-to-refresh@0.0.1
  - @seed-design/react-radio-group@0.0.1
  - @seed-design/react-segmented-control@0.0.1
  - @seed-design/react-snackbar@0.0.1
  - @seed-design/react-switch@0.0.1
  - @seed-design/react-tabs@0.0.1
  - @seed-design/react-text-field@0.0.1
  - @seed-design/react-toggle@0.0.1
  - @seed-design/dom-utils@0.0.1

## 0.0.1-rc.4

### Patch Changes

- Updated dependencies [93cfc30]
  - @seed-design/css@0.0.1-rc.4

## 0.0.1-rc.3

### Patch Changes

- cc4b2c5: fix: externalize subpath imports from `@seed-design/css`
  refactor: streamline package configurations
  refactor(qvism): generate recipe-shared module from cli
- Updated dependencies [cc4b2c5]
  - @seed-design/css@0.0.1-rc.3

## 0.0.1-rc.2

### Patch Changes

- Updated dependencies [14c9983]
  - @seed-design/css@0.0.1-rc.1

## 0.0.1-rc.1

### Patch Changes

- 6ee6544: re-export stylesheet from @seed-design/css package.

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
- Updated dependencies
  - @seed-design/css@0.0.1-rc.0
  - @seed-design/react-avatar@0.0.1-rc.0
  - @seed-design/react-checkbox@0.0.1-rc.0
  - @seed-design/react-dialog@0.0.1-rc.0
  - @seed-design/react-popover@0.0.1-rc.0
  - @seed-design/react-primitive@0.0.1-rc.0
  - @seed-design/react-progress@0.0.1-rc.0
  - @seed-design/react-pull-to-refresh@0.0.1-rc.0
  - @seed-design/react-radio-group@0.0.1-rc.0
  - @seed-design/react-segmented-control@0.0.1-rc.0
  - @seed-design/react-snackbar@0.0.1-rc.0
  - @seed-design/react-switch@0.0.1-rc.0
  - @seed-design/react-tabs@0.0.1-rc.0
  - @seed-design/react-text-field@0.0.1-rc.0
  - @seed-design/react-toggle@0.0.1-rc.0
  - @seed-design/dom-utils@0.0.1-rc.0
