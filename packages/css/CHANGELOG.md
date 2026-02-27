# @seed-design/css

## 1.2.3

### Patch Changes

- eb390cf: BottomSheet의 title padding을 수정합니다.

  - left 헤더 정렬 시 오른쪽 padding을 `50px` -> `56px`로 수정합니다.
  - center 헤더 정렬 시 양쪽 padding을 `60px` -> `56px`로 수정합니다.

- 7c3bbe7: Slider의 Value Indicator 가시성 및 트랜지션을 개선합니다.
- 6db2515: AppBar의 `bg` 또는 `background` 프로퍼티로 배경 색상을 조절할 수 있는 옵션을 추가합니다. (`tone="layer"`인 경우 적용)
- 12789e6: Segmented Control pressed, selected-pressed 상태에서 stroke border 가 나타나도록 합니다.
- 6fb6dc2: AspectRatio 스타일시트의 `position: relative`와 `overflow: hidden` 선언을 React 레이어로 이동하여 CSS specificity 문제를 수정합니다.

## 1.2.2

### Patch Changes

- 15010c3: ImageFrame 내부 요소에 width, height 100%를 추가합니다
- a3e6859: ImageFrame `rounded` 옵션을 제거하고, borderRadius를 받을 수 있게 변경합니다
- 4287600: BottomSheet title 영역에서 닫기 버튼 간격에 따라 조정된 padding 기준으로 정리하고, word-break 추가 및 description 영역 너비를 정리했습니다.

## 1.2.1

### Patch Changes

- 9446f2c: ImageFrameReactionButton에 fillIcon, lineIcon spec을 추가합니다
- 8ad9484: ImageFrameReactionButton의 SVG 사이즈와 Rootage 정의를 수정합니다.
- 9cbeba0: BottomSheet `showCloseButton` variant 변경 및 animation 버그 수정

  - `showCloseButton` variant 변경: CloseButton 미사용 시 header padding 조정 가능
  - `hasEntered` 상태 추가: modal prop 변경 시 enter animation 재실행 방지

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
- 8fb7038: [BottomSheetContent](/react/components/bottom-sheet)와 [MenuSheetContent](/react/components/menu-sheet)가 기본적으로 bottom safe area만큼 하단 padding을 갖도록 수정합니다.

  - 별도로 safe area padding을 지정하는 경우 제거할 수 있습니다. BottomSheetContent 내부에서의 `<VStack paddingBottom="safeArea">` 등

- 17c0ebd: Text Field (text-input)과 Field Button (input-button)의 포커스 및 에러 상태 border 트랜지션을 수정합니다.

## 1.1.19

### Patch Changes

- 6697fbe: BottomSheetRoot `headerAlign="center"` variant에서 텍스트 정렬 문제를 수정합니다 ([예제](/react/components/bottom-sheet#header-align)). MenuSheetTitle의 내용이 길어질 때 MenuSheetHeader가 가운데 정렬되지 않는 문제를 수정합니다.

## 1.1.17

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

- 8495fae: 잘못된 pseudo selector를 수정합니다

## 1.1.16

### Patch Changes

- 2f29fe8: 정적 텍스트 스타일 추가 (t1Static* ~ t10Static*)
- 9119723: Checkmark `variant=ghost` `tone=neutral`에서 icon의 색상을 $color.fg.neutral로 변경하고 색상 트랜지션을 추가합니다.
- 6d30b72: Stackflow와 함께 AppScreen 사용 시 최상위 AppScreen이 push/pop될 때, 이외의 AppScreen이 고유한 `transitionStyle`을 재생하는 문제를 수정합니다. 같은 스택 내에 여러 `transitionStyle`이 공존할 때 자연스러운 트랜지션을 제공하기 위해 최상위 AppScreen의 `transitionStyle`을 재생합니다. ([데모](https://seed-design.io/react/stackflow/app-screen#transition-styles))

  - 예를 들면, `transitionStyle="fadeFromBottomAndroid"`인 0번 AppScreen 위에 `transitionStyle="slideFromLeftIOS"`인 1번 AppScreen이 push되는 경우, 0번 AppScreen이 `slideFromLeftIOS` 트랜지션을 재생하도록 수정합니다.
    - 0번 AppScreen이 자연스럽게 좌측으로 조금 밀려나며 어두워지고(`slideFromLeftIOS`) 1번 AppScreen이 우측에서 슬라이드 인(`slideFromLeftIOS`)

- 10c0765: 배너 템플릿에 사용되는 `$color.banner.*` 색상 토큰을 추가합니다.
- 5e462db: `AppScreen`에 신규 `transitionStyle` `fadeIn`을 추가합니다.

## 1.1.15

### Patch Changes

- 76acd7e: iOS 15 이하 기기에서 MenuSheetItem이 의도하지 않은 margin을 갖는 문제를 수정합니다.
- 7a428ec: `theme=“android”`인 AppScreen 또는 AppBar에 속한 AppBarMain의 title과 subtitle 말줄임(truncation)이 적용되지 않는 문제를 수정합니다.
- 498a9e7: iOS 17 이하 기기에서 SegmentedControlItem의 높이가 잘못 설정될 수 있는 문제를 수정합니다.

## 1.1.13

### Patch Changes

- 9be0581: `radiomark` Rootage 정의를 명확화합니다. (스타일 변경사항 없음)
- cc4a45a: 신규 [Elevation 가이드](https://seed-design.io/docs/foundation/elevation)에 맞는 shadow 토큰을 추가합니다.

  - React: Box, Flex, HStack 등 StyleProps를 사용하는 컴포넌트에서 `boxShadow` prop을 사용하여 shadow 토큰을 쉽게 사용할 수 있습니다.

- 739937f: Button들의 xsmall variant의 텍스트 사이즈를 t4에서 t3로 변경해요.

## 1.1.12

### Patch Changes

- 8d0ad90: seedFontMultiplier, seedFontScaling attribute를 추가합니다
  - seedFontMultiplier: 폰트 크기 스케일링 계수 (e.g. 0.8, 1.35, 1.5, 1)
  - seedFontScaling: 폰트 크기 스케일링 활성화 여부 (e.g. "enabled")
- 8f31f93: cssnano 등 CSS 최적화 도구를 사용할 때, `bleedX`와 `bleedY` 중 한 가지 속성만 정의하는 경우 bleed가 적용되지 않던 문제를 수정합니다.
- 69ccc6e: Overlay 컴포넌트에 skipAnimation 옵션을 추가합니다
- 279001a: Badge의 크기와 Field의 indicator 크기 및 여백이 폰트 스케일링 제한의 영향을 받도록 업데이트합니다.

## 1.1.10

### Patch Changes

- db5de74: PageBanner에 tone="magic" 스타일을 추가합니다.
- 70d11b8: Segmented Control의 스타일을 업데이트합니다: Indicator에서 shadow 정의를 제거합니다.
- c03a3dd: TextFieldInput 및 TextFieldTextarea (text-input 스타일시트)에서 브라우저 기본 자동 완성 스타일이 표시되지 않도록 수정합니다.
- a12e49b: Field(TextField)의 스타일을 수정합니다.

  - `maxGraphemeCount`를 사용하지만 `description`을 사용하지 않는 경우 `maxGraphemeCount`가 우측이 아닌 좌측에 표시되는 문제를 수정합니다.
  - Tailwind Preflight 사용 시 Character Count 영역이 디자인 의도보다 높이를 더 많이 차지하는 문제를 수정합니다.

## 1.1.9

### Patch Changes

- 37d332d: `AppBar`에 적용되는 그라디언트를 `AppScreen`으로 이동합니다.

  - `<AppBar tone="transparent">`를 사용하는 경우 `tone="transparent"`를 `AppScreen`으로 옮겨 그라디언트를 표시할 수 있습니다.
  - `AppScreen`에 `gradient={false}`를 설정하여 그라디언트를 숨길 수 있습니다.

- 77517f1: iOS 웹뷰 환경에서 Avatar가 정상적으로 렌더링되지 않는 문제를 수정합니다.

## 1.1.8

### Patch Changes

- 8752805: List Item에 신규 active(pressed) 스타일을 적용하고, disabled 상태에서 detail 영역의 색상을 수정합니다.
- ee98674: Help Bubble이 기본적으로 z-index 99를 가지도록 수정합니다. (HelpBubblePositioner 또는 HelpBubblePositionerPortal에 직접 인라인 스타일을 적용한 경우 인라인 스타일이 우선 적용됩니다.)

## 1.1.7

### Patch Changes

- bee919c: 스타일시트에서 logical property(padding-block 등)를 physical property(padding-left 및 padding-right 등)로 교체합니다. (브라우저 지원)
- 1340675: Slider Value Indicator가 표시되는 조건을 설정하는 `valueIndicatorTrigger` prop을 추가합니다. ("active"|"hover", 기본값: "active")
- 1340675: Slider Value Indicator가 Track 양 끝에 있을 때 Track 바깥 영역을 차지하지 않도록 수정합니다.

## 1.1.6

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

## 1.1.5

### Patch Changes

- 53290ab: FieldButton에 Read Only 상태를 추가합니다. Disabled 상태인 FieldButton은 내부 `<input />`도 `disabled` 속성을 갖도록 수정합니다.

## 1.1.4

### Patch Changes

- 795668c: Stackflow의 AppScreen에 있던 gradient 스타일을 AppBar로 이동합니다

## 1.1.3

### Patch Changes

- 15c658b: 일반적인 CSS Reset을 사용하지 않는 환경에서도 스타일이 의도한 대로 표시될 수 있도록 수정합니다.

  - `list-header`에 `box-sizing: border-box;` 추가
  - `button`으로 렌더링되는 컴포넌트 스타일 수정

- f4e07bb: 1.1 이전 버전과 호환 가능하도록 임시적으로 사용할 text-input size=medium variant를 추가합니다.

  - 영향 받는 React 컴포넌트: TextFieldInput, TextFieldTextarea

- 114dafd: text-input의 readonly 스타일을 업데이트합니다.

  - 영향 받는 React 컴포넌트: TextFieldInput, TextFieldTextarea

- bc3cd6f: ScrollFog 컴포넌트를 추가합니다

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

- b131282: AppScreen에 `tone` 속성을 조절해 그라데이션이 들어간 투명한 배경을 사용할 수 있습니다.

  - AppBar에 있던 `tone` 속성을 AppScreen에서도 사용할 수 있도록 이동합니다.
  - AppScreen, AppBar 둘 다 `tone` 속성을 사용할 수 있도록 합니다.

- 6af6501: (BREAKING CHANGE: PageBanner snippet을 다시 설치해야 합니다.) Page Banner 스니펫을 업데이트합니다.

  - Box를 사용하여 스타일링하던 부분을 `PageBanner.Body`로 교체합니다.
  - `PageBanner.TextContent`를 `PageBanner.Content`로 이름 변경합니다.

## 1.0.7

### Patch Changes

- e52d6d1: Article에서 selection 색상에 대한 정의를 제거합니다.
- 97669bc: Tailwind Preflight 사용 시 Page Banner가 디자인 의도와 다르게 표시되는 문제를 수정합니다.
- 15ab93a: List Item 컴포넌트의 상하 여백을 `$dimension.x2_5`에서 `$dimension.x3`로 늘립니다.
- 50366c0: Tailwind Preflight 사용 시 Text Field의 Header/Footer와 Callout이 디자인 의도와 다르게 표시되는 문제를 수정합니다.

## 1.0.6

### Patch Changes

- 6aafce0: Tag Group 컴포넌트를 추가합니다. Tag Group은 아이콘 및 텍스트로 이루어진 태그를 구분 기호와 함께 수평 레이아웃으로 표시하는 컴포넌트입니다.
- 1902dfa: AppBar의 스타일을 업데이트합니다.

  - Top Navigation의 title 및 description에 `lineHeight` 값을 정의합니다. (React AppBar 컴포넌트에 반영됩니다.)
  - `<Icon />` 컴포넌트를 활용하여 `<AppBarIconButton />` 내부 아이콘을 커스터마이징할 수 있도록 수정합니다.

- f2ddf29: Article 유틸리티 컴포넌트를 추가하고 Text 컴포넌트를 업데이트합니다.

  - Article 컴포넌트는 일관된 selection 스타일 및 줄바꿈 정책을 사용할 수 있게 돕습니다.
  - Text 컴포넌트에서 textDecorationLine="underline" 및 whiteSpace, userSelect prop을 지원합니다.

- 4c33f07: Switch가 checked 상태가 아닐 때 thumb 크기를 줄여 상태를 인지하기 쉽도록 합니다. enabled-disabled 상태 간 트랜지션을 추가합니다.
- 3df657f: Switch와 Switch Mark의 disabled 상태를 더 잘 구별할 수 있도록 스타일을 수정합니다.

## 1.0.5

### Patch Changes

- f1cf4cd: Text Field와 Multiline Text Field가 기본적으로 배경 색을 갖지 않도록 수정합니다.
- 9b91751: AppScreen에서 스와이프로 pop할 때 AppScreen이 한번 깜빡거리고 닫히는 버그를 수정합니다.
- 3898183: 매너온도 L9 전경 및 배경 색상의 채도를 낮춥니다.

## 1.0.3

### Patch Changes

- 0b8a02e: HelpBubble의 스타일을 업데이트하고, 신규 기능을 지원합니다.

  - arrowTip이 content에서 떨어져 보이던 문제를 수정합니다.
  - title과 description에서 `\n`을 줄바꿈으로 렌더링하도록 수정합니다.
  - `closeOnInteractOutside`를 `false`로 설정하여 Help Bubble 외부와 상호작용 시에도 닫히지 않도록 설정할 수 있습니다. (기본값: `true`)

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

## 0.2.5

### Patch Changes

- 0ca19c0: Segmented Control 컴포넌트를 업데이트합니다.

  - Notification Badge를 표시하는 notification prop을 추가합니다.
  - `SegmentedControlItem`의 `children`을 `string`에서 `ReactNode`로 확대합니다.
  - 스타일을 업데이트합니다.

## 0.2.4

### Patch Changes

- 8ebe8a5: Switch, Checkmark, Radio Mark의 스타일을 업데이트합니다.

  - tone=neutral variant를 추가합니다.
  - Switch의 thumb 크기를 조정합니다.

  Checkbox와 Radio의 weight variant를 default, stronger에서 regular, bold로 수정합니다.

- f61b80d: 다크 모드에서의 색상 대비 보장을 위해 시맨틱 색상을 수정하고 컴포넌트에서의 색상을 변경합니다.

  - **$color.bg.warning-solid**: theme-dark에서 $color.palette.yellow-600 → $color.palette.yellow-800
  - **$color.bg.warning-solid-pressed**: theme-dark에서 $color.palette.yellow-700 → $color.palette.yellow-900
  - Badge, Page Banner의 tone=warning, variant=solid variant에서 전경 항목 색상 변경: $color.fg.neutral → $color.palette.static-black-alpha-900

## 0.2.3

### Patch Changes

- a22b8b9: ChipTabs 컴포넌트 Variant, Size 변경 및 디자인 수정

  - variant `neutralOutline` 추가
  - variant `brandSolid` deprecated
  - size(`medium(default)` | `large`) 추가

- 5836976: text-field의 value slot이 input의 size attribute로 인해 기본적으로 width를 가지는 문제를 해결합니다.
- 12faf5a: List 컴포넌트를 추가하고, Checkbox 및 Radio 컴포넌트를 개선합니다.

  - List 컴포넌트를 제공하여, 정보를 구조화된 목록 형태로 표시할 수 있도록 합니다.
  - Checkbox와 Radio의 컨트롤 영역만을 표시하는 Checkmark와 RadioMark를 제공합니다.
  - Select Box에서 컨트롤 영역을 Checkmark와 RadioMark로 교체합니다.
  - RadioGroup 컴포넌트를 제공합니다.

## 0.2.1

### Patch Changes

- 35984d0: Chip 컴포넌트를 업데이트합니다.

  - 아이콘에 트랜지션 효과가 적용되지 않던 현상을 수정합니다.
  - Button, Toggle 등 사용되는 방식에 따라 적절한 data prop을 받도록 수정합니다.

## 0.2.0

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

## 0.1.15

### Patch Changes

- c51a261: font-size, line-height 토큰에 static variant를 추가합니다.

  - `--seed-font-size-t1-static` ~ `--seed-font-size-t10-static`
  - `--seed-line-height-t1-static` ~ `--seed-line-height-t10-static`

- 5f2ee39: CSS 최적화 도구(e.g. cssnano)가 CSS variable로 정의된 longhand declaration을 병합하지 않도록 합니다. (workaround, [관련 issue](https://github.com/cssnano/cssnano/issues/1472))
- 8299ba9: Snackbar 컴포넌트를 업데이트합니다.

  - root 영역에 maxWidth 스펙을 추가합니다.
  - `pauseOnInteraction`의 기본값을 `false`에서 `true`로 변경합니다.

- 3de4cec: 플랫폼별 조건부 폰트 스케일링 제한 (iOS: 135%, Android: 150%) 적용

  - CSS 변수 `--seed-{font-size|line-height}-limit-{min|max}` 도입
  - 빌드 타임 basePx 계산을 런타임 static 토큰 참조로 대체
  - global.ts에 폰트 스케일링 변수 통합

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

## 0.1.13

### Patch Changes

- 0be9b00: Avatar, Avatar Stack 컴포넌트에 `size=108` variant를 추가합니다.

## 0.1.12

### Patch Changes

- 62094b6: Help Bubble의 스타일 문제를 수정합니다.

  - `placement=left-*` / `placement=right-*`에서 arrow가 content와 떨어져 표시되는 문제를 수정합니다.

## 0.1.10

### Patch Changes

- ef91c21: Bottom Sheet의 스타일 문제를 수정해요.

  - Close Button에 브라우저 기본 스타일이 표시되는 문제를 수정해요.

## 0.1.9

### Patch Changes

- 5a025b7: Switch 컴포넌트를 업데이트합니다.

  - size: medium → 32, small → 16으로 rename합니다.
    - (React) `size="medium"`으로 `32`, `size="small"`로 `16`을 사용할 수 있습니다. (deprecated)
  - size: 24를 추가합니다.
  - 모든 size에 대해 레이블 스타일을 추가합니다. (기존: small에만 존재)

- ac35731: Chip.Root `position: relative` 속성 추가

  - 이제 Chip.Toggle을 사용해도 예상치 못한 스크롤이 발생하지 않습니다.

- f9041e9: `CheckSelectBox`, `RadioSelectBox`의 `label`, `description` 영역을 수정합니다.

  - `span` 대신 `div`를 렌더링합니다.
  - 기본적으로 grow하도록 만들어 Badge 등 추가 요소를 넣기 쉽게 만듭니다.

## 0.1.8

### Patch Changes

- 609b8f3: iOS의 `더 큰 텍스트` 기능에 제한을 둡니다.

  - iOS는 7단계(XS ~ XXXL)의 텍스트 크기 조절 이외에도, 보다 더 큰 텍스트를 위한 `더 큰 텍스트` 기능을 제공합니다.
  - iOS 네이티브에서는 `더 큰 텍스트`의 UI 레이아웃 대응이 어렵다고 결정하여, XXXL(135%) 이상의 텍스트 크기 조절을 지원하지 않습니다.
  - 웹뷰도 iOS와 동일한 제한을 위한 기능이 추가되었습니다.

## 0.1.7

### Patch Changes

- 4afe80b: MultilineTextField의 스타일 문제를 수정합니다.

  - 스크롤바가 요소 끝에 표시되도록 수정합니다.

## 0.1.6

### Patch Changes

- 235147d: action-button: `size=medium, layout=withText` variant에서 gap을 1 → 1.5로 수정합니다.
- 3c13ad7: `highlight-magic-pressed` 그라디언트 토큰을 추가합니다.

## 0.1.5

### Patch Changes

- 861ecb4: Menu Sheet 컴포넌트를 추가하는 동시에 Action Sheet과 Extended Action Sheet 컴포넌트를 deprecate합니다.

  - [Menu Sheet React 문서](https://seed-design.io/react/components/menu-sheet)
  - Menu Sheet는 기존 Extended Action Sheet의 모든 기능을 포함하는 동시에, `labelAlign` prop으로 `MenuSheetItem`를 `left` 또는 `center`로 정렬할 수 있습니다.

- 3889eb6: Inline Banner의 스타일 문제를 수정합니다.

  - `title`과 `description`이 `inline-flex`로 레이아웃되던 문제를 해결합니다.
  - `title`과 `description` 간의 간격을 조정합니다.
  - 닫기 버튼(Dismissible)과 `suffix icon`, `link label`이 상단으로 레이아웃되던 문제를 해결합니다.

  Callout의 스타일 문제를 수정합니다.

  - `title`과 `description` 간의 간격을 조정합니다.

  Chip의 스타일 문제를 수정합니다.

  - `Chip.Button`의 `label`이 의도한 글꼴로 표시되도록 수정합니다.

## 0.1.4

### Patch Changes

- 0ffcd48: Chip 컴포넌트가 추가되고, ActionChip, ControlChip 컴포넌트가 Deprecated 되었습니다.

  - [Chip 컴포넌트](https://seed-design.io/react/components/chip)
  - Chip 컴포넌트는 버튼과 토글 컴포넌트를 모두 포함하고 있습니다.

## 0.1.3

### Patch Changes

- cdc0930: `@seed-design/stackflow` 백스와이프 애니메이션 개선

  - iOS 스타일 화면 전환 애니메이션의 지속 시간과 타이밍 함수가 `300ms`에서 `350ms`로 조정되어 더 부드러운 전환 효과를 제공합니다.
  - 스와이프 백 제스처 시 애니메이션이 보다 자연스럽고 일관되게 표현됩니다.
  - 스와이프 백 종료 시 CSS 변수를 활용해 전환 상태를 명확히 하여 사용자 경험이 개선되었습니다.

- 946faf7: 그라디언트 토큰 추가 및 변경

  - `fade-layer-floating`, `fade-layer-default` 토큰이 추가되었습니다.
  - `$gradient.shimmer-magic` 토큰 stop color가 변경되었습니다.

- 71c58fd: iOS Font Scaling

  - iOS 기기에서 시스템 폰트 크기 설정에 따라 동적으로 폰트 크기와 줄 높이를 조정하는 폰트 스케일링 옵션이 추가되었습니다.
  - 플러그인(webpack, vite, rsbuild)에서 `fontScaling` 옵션을 통해 폰트 스케일링 기능을 활성화할 수 있습니다.
  - `data-seed-font-scaling='enabled'` 일 때, 폰트 크기를 조정합니다.

## 0.1.2

### Patch Changes

- 7b2c0f3: Updated dependencies
  - @seed-design/react@0.1.1

## 0.1.1

### Patch Changes

- e3b782d: `stroke.neutral`, `stroke.neutral-muted`, `stroke.on-image`의 컬러를 alpha 값으로 변경합니다.

## 0.1.0

### Minor Changes

- 7cc6087: HelpBubble의 arrow가 상위 요소의 font-size에 영향을 받는 것을 수정합니다
- bdca898: BottomSheet의 description font-size를 t5로 변경합니다

## 0.0.41

### Patch Changes

- 561f74c: Text 컴포넌트에 `textDecorationLine` 옵션을 추가합니다.
- b43de05: Gradient 컬러를 추가합니다

## 0.0.39

### Patch Changes

- f801300: 새로운 black, white alpha 값을 추가합니다

  `$color.palette.static-black-alpha-50` (예전 값)

  - 예전 값: #0000000d (투명도 약 5.1%)
  - 변경 값: `$color.palette.static-black-alpha-200` (투명도 4.7%)

  `$color.palette.static-black-alpha-200` (예전 값)

  - 예전 값: #00000033 (투명도 20%)
  - 변경 값: `$color.palette.static-black-alpha-500` (투명도 17.3%)

  `$color.palette.static-black-alpha-500` (예전 값)

  - 예전 값: #00000080 (투명도 약 50.2%)
  - 변경 값: `$color.palette.static-black-alpha-700` (투명도 45.5%)

  `$color.palette.static-white-alpha-200` (예전 값)

  - 예전 값: #ffffff33 (투명도 20%)
  - 변경 값: `$color.palette.static-white-alpha-300` (투명도 18%)

  `$color.palette.static-white-alpha-800` (예전 값)

  - 예전 값: #ffffffcc (투명도 약 80%)
  - 변경 값: `$color.palette.static-white-alpha-800` (투명도 87.1%)
  - (참고: 이 값은 이름은 같지만 실제 투명도 값은 80%에서 87.1%로 변경되었습니다.)

## 0.0.38

### Patch Changes

- 70fbaaf: Action Button에 type="ghost"를 추가합니다.

## 0.0.35

### Patch Changes

- 0789dc8: `_active` style prop이 값이 없는 경우에 기존 style prop을 제거하는 버그를 수정합니다.

## 0.0.34

### Patch Changes

- 92801a2: `_active` style prop이 상태가 없는 값보다 우선순위가 낮게 적용되는 문제를 수정합니다.

## 0.0.33

### Patch Changes

- fbdb091: Style prop에 `_active`를 추가합니다. background 속성만을 지원합니다.

## 0.0.31

### Patch Changes

- fd7c569: - Tabs.Carousel을 사용하는 경우 Hydration 이후 스크롤 애니매이션이 발생하는 문제를 수정합니다.
  - Tabs.Carousel의 드래그 제스처를 방지하는 영역을 선언할 수 있는 `Tabs.carouselPreventDrag` api를 추가합니다.
  - layout=hug일 때 Indicator에서 발생하는 Layout Shift를 수정합니다.
  - lazyMount 옵션이 의도와 다르게 모든 탭이 한꺼번에 마운트되는 문제를 수정합니다.

## 0.0.30

### Patch Changes

- 285cb9b: - `ContextualFloatingButton`과 `FloatingActionButton` 컴포넌트를 제공합니다.
  - 기존의 `Fab` 및 `ExtendedFab`를 deprecate합니다.
  - Floating 요소들의 위치를 편리하게 제어하도록 `Float` 유틸리티 컴포넌트를 제공합니다.

## 0.0.29

### Patch Changes

- 116ee2c: ActionButton의 min-width variable 기본값을 수정합니다.

## 0.0.28

### Patch Changes

- 5337e14: Callout의 wrapping 동작을 수정합니다.

## 0.0.27

### Patch Changes

- 9d85c16: InlineBanner의 title 영역에 flex-shrink: 0을 추가해요
- d951317: Color 토큰을 업데이트합니다.
- b3f964d: Avatar의 디자인 업데이트를 반영합니다. (stroke 추가)

## 0.0.25

### Patch Changes

- c87ede9: Avatar Stack의 디자인을 업데이트합니다.

## 0.0.24

### Patch Changes

- 4da536f: ActionSheet의 header가 렌더링되지 않을 때 상단 radius가 누락되는 버그를 수정합니다.

## 0.0.23

### Patch Changes

- 63e1541: AppBar의 배경이 상단 safe-area를 덮도록 수정합니다.

## 0.0.21

### Patch Changes

- 5d69d1d: Button, Chip 컴포넌트들의 누락된 line-height를 추가합니다.
  Button, Chip 컴포넌트들의 white-space를 nowrap으로 설정합니다.
- 4d34760: 상단 내비게이션의 아이콘 버튼 터치영역을 44px로 변경합니다.
- 7ae87f8: 2개의 컨텐츠를 동일한 비율로 나누어 배치하되, 너무 긴 경우 세로로 접는 `<ResponsivePair>` 컴포넌트를 추가합니다.
- f144d28: BottomSheet, Dialog의 배경 색상을 layer-floating으로 변경합니다.
- e368c69: 패키지 의존성을 최신화합니다.

## 0.0.19

### Patch Changes

- 3c9ec66: feat: 와일드카드 지원하지 않는 곳을 위해 CSS 파일 명시적 export
- b3bb6e7: LoadingIndicator를 사용하는 컴포넌트에 position: relative를 추가합니다.

## 0.0.17

### Patch Changes

- c042f90: recipe에서 직접 스타일시트 의존성을 표현하도록 변경합니다.

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
- f4b0723: HelpBubble 디자인 스펙 업데이트 (shadow)
- f4b0723: HelpBubble의 enter, exit 모션을 추가합니다.

## 0.0.14

### Patch Changes

- 92c0b80: HelpBubble 디자인 스펙 업데이트 (shadow)
- c1d94d0: HelpBubble의 enter, exit 모션을 추가합니다.

## 0.0.13

### Patch Changes

- 7fca755: Avatar의 Badge 스펙을 최신화합니다.

## 0.0.12

### Patch Changes

- 6426379: 유틸리티 컴포넌트에 사용되는 ScopedColorFg, ScopedColorBg, ScopedColorPalette, ScopedColorStroke 타입을 제공합니다.
- ee41f37: close button의 위치가 의도와 다르게 설정된 것을 수정합니다.

## 0.0.11

### Patch Changes

- e70f340: Dialog 및 Sheet 컴포넌트 레이아웃 스펙 업데이트
- 72f344f: `$dimension.spacing-y.screen-bottom` 토큰을 추가합니다.
  `$dimension.spacing-y.between-text` 토큰을 추가합니다.

## 0.0.10

### Patch Changes

- e4b704c: Avatar size=42를 추가합니다.

## 0.0.9

### Patch Changes

- 63f8651: MannerTemp 컴포넌트를 추가합니다.
- d9b01a9: feat: 다크모드에서의 gray200, gray300 색상, 라이트모드 carrot700 색상을 변경해요

  - (light) carrot700: #e84500 -> #e04f00
  - (dark) gray300: #2c2f35 -> #2b2e35
  - (dark) gray200: #1b1c22 -> #22252b

## 0.0.8

### Patch Changes

- 1424700: Notification Badge를 추가합니다.

  - Tabs의 Notification 슬롯을 Notification Badge로 변경합니다.

- 0efeea1: change help-bubble paddingY, lineHeight

## 0.0.7

### Patch Changes

- 8aca3de: remove text maxLines none display unset

## 0.0.6

### Patch Changes

- bf198e8: Skeleton의 width, height가 동작하지 않는 버그를 수정합니다.
- 3d66c5b: visuallyHidden을 recipe에서 제거합니다.
- a8d5242: callout, inline banner 디자인 스펙 수정
- ccf3989: fix: add --seed-safe-area-top in app-bar

## 0.0.5

### Patch Changes

- e3234e7: single-slot recipe를 위한 간소화된 인터페이스를 추가합니다.
- 5502bed: add textStyles (t6, t7 regular, medium)

## 0.0.4

### Patch Changes

- 6df5d19: Badge 디자인 업데이트
  - neutral tone 색상 변경
  - pill shape 삭제
- 5cb50e7: recipe 스타일시트의 exports map을 수정합니다.

## 0.0.3

### Patch Changes

- a33af94: Fixes an issue where the theming script was injecting the wrong color mode data-attr.
- b180822: Inject data-seed in theming script instead of plugin

## 0.0.2

### Patch Changes

- d04e344: theming script의 color mode data attribute 수정

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.

## 0.0.1-rc.4

### Patch Changes

- 93cfc30: feat: change theming data attribute names

  - theming에 사용되는 data attribute 이름을 변경합니다.
  - 유저가 선호하는 color scheme과 사전에 지정된 color mode를 구분하기 쉽도록 이름을 부여합니다.
  - 파편화된 platform 관련 네이밍을 통일합니다.
  - 테마 관련 data attribute가 지정되지 않은 경우 light theme로 fallback하는 동작을 추가합니다.

## 0.0.1-rc.3

### Patch Changes

- cc4b2c5: fix: externalize subpath imports from `@seed-design/css`
  refactor: streamline package configurations
  refactor(qvism): generate recipe-shared module from cli

## 0.0.1-rc.1

### Patch Changes

- 14c9983: change package.json exports map

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
