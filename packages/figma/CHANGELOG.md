# @seed-design/figma

## 1.2.0

### Minor Changes

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

- Updated dependencies [0ecb893]
- Updated dependencies [98dbac4]
- Updated dependencies [a58022d]
- Updated dependencies [477ec8a]
- Updated dependencies [2643d17]
- Updated dependencies [8fb7038]
- Updated dependencies [a0e40ca]
- Updated dependencies [17c0ebd]
- Updated dependencies [358a1e4]
  - @seed-design/css@1.2.0

## 1.1.19

### Patch Changes

- Updated dependencies [6697fbe]
  - @seed-design/css@1.1.19

## 1.1.18

### Patch Changes

- e92892a: 아이콘 정보를 업데이트합니다.

## 1.1.17

### Patch Changes

- Updated dependencies [db49a84]
- Updated dependencies [6fab0e7]
- Updated dependencies [5faef3a]
- Updated dependencies [50ee0a6]
- Updated dependencies [94bebf8]
- Updated dependencies [8495fae]
  - @seed-design/css@1.1.17

## 1.1.16

### Patch Changes

- Updated dependencies [2f29fe8]
- Updated dependencies [9119723]
- Updated dependencies [6d30b72]
- Updated dependencies [10c0765]
- Updated dependencies [5e462db]
  - @seed-design/css@1.1.16

## 1.1.15

### Patch Changes

- Updated dependencies [76acd7e]
- Updated dependencies [7a428ec]
- Updated dependencies [498a9e7]
  - @seed-design/css@1.1.15

## 1.1.14

### Patch Changes

- c1f818f: Figma Codegen & MCP에서 `boxShadow` 코드 생성을 지원하고 엔티티 정보를 최신화합니다.

## 1.1.13

### Patch Changes

- Updated dependencies [9be0581]
- Updated dependencies [cc4a45a]
- Updated dependencies [739937f]
  - @seed-design/css@1.1.13

## 1.1.12

### Patch Changes

- 6d680ba: Figma Codegen 정보를 최신화합니다.
- Updated dependencies [8d0ad90]
- Updated dependencies [8f31f93]
- Updated dependencies [69ccc6e]
- Updated dependencies [279001a]
  - @seed-design/css@1.1.12

## 1.1.10

### Patch Changes

- 23e9246: Figma 엔티티 및 Codegen을 업데이트합니다. (신규 아이콘 및 `ResultSection` Codegen 지원)
- Updated dependencies [db5de74]
- Updated dependencies [70d11b8]
- Updated dependencies [c03a3dd]
- Updated dependencies [a12e49b]
  - @seed-design/css@1.1.10

## 1.1.9

### Patch Changes

- Updated dependencies [37d332d]
- Updated dependencies [77517f1]
  - @seed-design/css@1.1.9

## 1.1.8

### Patch Changes

- Updated dependencies [8752805]
- Updated dependencies [ee98674]
  - @seed-design/css@1.1.8

## 1.1.7

### Patch Changes

- Updated dependencies [bee919c]
- Updated dependencies [1340675]
- Updated dependencies [1340675]
  - @seed-design/css@1.1.7

## 1.1.6

### Patch Changes

- Updated dependencies [dfe6c1e]
- Updated dependencies [a09e6b4]
  - @seed-design/css@1.1.6

## 1.1.5

### Patch Changes

- Updated dependencies [53290ab]
  - @seed-design/css@1.1.5

## 1.1.4

### Patch Changes

- Updated dependencies [795668c]
  - @seed-design/css@1.1.4

## 1.1.3

### Patch Changes

- d986fd5: Figma Codegen 컴포넌트 핸들러를 업데이트합니다. 레거시 Text Field에 대한 Codegen을 한시적으로 지원합니다.
- Updated dependencies [15c658b]
- Updated dependencies [f4e07bb]
- Updated dependencies [114dafd]
- Updated dependencies [bc3cd6f]
  - @seed-design/css@1.1.3

## 1.1.2

### Patch Changes

- 4c5d7c4: Figma 토큰 정보 및 Codegen 핸들러를 최신화합니다.

## 1.1.0

### Patch Changes

- 191005f: Action Button 컴포넌트를 `variant=ghost`로 사용하는 경우 `fontWeight`를 사용자화할 수 있도록 업데이트합니다.

  (BREAKING CHANGE: Error State snippet을 다시 설치해야 합니다.) Error State 스니펫에서 Action Button을 활용하도록 업데이트합니다.

- Updated dependencies [d6bb84d]
- Updated dependencies [a55f584]
- Updated dependencies [191005f]
- Updated dependencies [b131282]
- Updated dependencies [6af6501]
- Updated dependencies [33def2d]
  - @seed-design/css@1.1.0

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
- Updated dependencies [6aafce0]
- Updated dependencies [1902dfa]
- Updated dependencies [f2ddf29]
- Updated dependencies [4c33f07]
- Updated dependencies [3df657f]
  - @seed-design/css@1.0.6

## 1.0.5

### Patch Changes

- Updated dependencies [f1cf4cd]
- Updated dependencies [9b91751]
- Updated dependencies [3898183]
  - @seed-design/css@1.0.5

## 1.0.3

### Patch Changes

- ac1fd00: Figma Codegen이 Bottom Sheet의 `hideCloseButton` prop을 사용하는 코드를 반환하도록 수정합니다.
- 8b07555: Figma 아이콘 및 스타일 정보를 최신화합니다.
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

### Patch Changes

- Updated dependencies [39a96f1]
- Updated dependencies [34f92f2]
- Updated dependencies [e038490]
- Updated dependencies [4153ca5]
- Updated dependencies [a7d07f0]
  - @seed-design/css@1.0.0

## 0.2.5

### Patch Changes

- bef65a6: Figma Variable & Variable Collection 정보를 최신화합니다.
- Updated dependencies [0ca19c0]
  - @seed-design/css@0.2.5

## 0.2.4

### Patch Changes

- afdd1ee: Figma Codegen을 위한 컴포넌트 핸들러를 업데이트합니다.

  - List, Checkmark, RadioMark, Radio, Tabs, ChipTabs 지원
  - Chip, Divider, HelpBubble, Switch, Checkbox 업데이트

- Updated dependencies [8ebe8a5]
- Updated dependencies [f61b80d]
  - @seed-design/css@0.2.4

## 0.2.3

### Patch Changes

- Updated dependencies [a22b8b9]
- Updated dependencies [5836976]
- Updated dependencies [12faf5a]
  - @seed-design/css@0.2.3

## 0.2.1

### Patch Changes

- Updated dependencies [35984d0]
  - @seed-design/css@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [8448880]
  - @seed-design/css@0.2.0

## 0.1.15

### Patch Changes

- Updated dependencies [c51a261]
- Updated dependencies [5f2ee39]
- Updated dependencies [8299ba9]
- Updated dependencies [3de4cec]
  - @seed-design/css@0.1.15

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

- Updated dependencies [62094b6]
  - @seed-design/css@0.1.12

## 0.1.11

### Patch Changes

- 9993e0e: 레이아웃 컴포넌트를 사용할 때 `flexGrow`, `flexShrink`, `flexWrap`에도 `true`를 사용할 수 있도록 수정합니다.

  Figma 레이어가 이미지 Fill을 가지고 있는 경우 `<img />` 요소를 prepend합니다.

## 0.1.10

### Patch Changes

- aa40f66: Figma 컴포넌트 정보 및 핸들러를 최신화하고 codegen을 업데이트합니다.

  - Instance에 오버라이드한 내용이 있는 경우 주석으로 알립니다.

- Updated dependencies [ef91c21]
  - @seed-design/css@0.1.10

## 0.1.9

### Patch Changes

- 5a025b7: Switch 컴포넌트를 업데이트합니다.

  - size: medium → 32, small → 16으로 rename합니다.
    - (React) `size="medium"`으로 `32`, `size="small"`로 `16`을 사용할 수 있습니다. (deprecated)
  - size: 24를 추가합니다.
  - 모든 size에 대해 레이블 스타일을 추가합니다. (기존: small에만 존재)

- f9379e0: Figma 컴포넌트 핸들러 정보를 최신화하고 정확한 prop을 생성하도록 수정합니다.

  - Chip, Progress Circle, Switch 컴포넌트 핸들러를 업데이트합니다.
  - `grow` 대신 `flexGrow`가 생성되도록, `borderWidth`가 `string`으로 생성되도록 수정합니다.

- Updated dependencies [5a025b7]
- Updated dependencies [ac35731]
- Updated dependencies [f9041e9]
  - @seed-design/css@0.1.9

## 0.1.8

### Patch Changes

- 2e2cc53: - Figma 컴포넌트 핸들러 및 스타일 정보를 최신화합니다.
  - normalize 과정에서 그라디언트 정보를 포함하도록 수정합니다.
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

- Updated dependencies [861ecb4]
- Updated dependencies [3889eb6]
  - @seed-design/css@0.1.5

## 0.1.4

### Patch Changes

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

- 7b2c0f3: Updated dependencies
  - @seed-design/react@0.1.1
- Updated dependencies [7b2c0f3]
  - @seed-design/css@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [e3b782d]
  - @seed-design/css@0.1.1

## 0.1.0

### Patch Changes

- Updated dependencies [7cc6087]
- Updated dependencies [bdca898]
  - @seed-design/css@0.1.0

## 0.0.41

### Patch Changes

- Updated dependencies [561f74c]
- Updated dependencies [b43de05]
  - @seed-design/css@0.0.41

## 0.0.40

### Patch Changes

- 5a55fb3: Instance Swap의 대상 노드가 visible: false일 때 REST API에서 원본 컴포넌트 정보를 제공하지 않아 발생하는 참조 오류를 수정합니다.

## 0.0.39

### Patch Changes

- Updated dependencies [f801300]
  - @seed-design/css@0.0.39

## 0.0.38

### Patch Changes

- Updated dependencies [70fbaaf]
  - @seed-design/css@0.0.38

## 0.0.35

### Patch Changes

- Updated dependencies [0789dc8]
  - @seed-design/css@0.0.35

## 0.0.34

### Patch Changes

- Updated dependencies [92801a2]
  - @seed-design/css@0.0.34

## 0.0.33

### Patch Changes

- Updated dependencies [fbdb091]
  - @seed-design/css@0.0.33

## 0.0.31

### Patch Changes

- Updated dependencies [fd7c569]
  - @seed-design/css@0.0.31

## 0.0.30

### Patch Changes

- Updated dependencies [285cb9b]
  - @seed-design/css@0.0.30

## 0.0.29

### Patch Changes

- Updated dependencies [116ee2c]
  - @seed-design/css@0.0.29

## 0.0.28

### Patch Changes

- b3da758: Figma XML 타겟에서 instance 노드의 컴포넌트 정보를 제공합니다.
- Updated dependencies [5337e14]
  - @seed-design/css@0.0.28

## 0.0.27

### Patch Changes

- 4133c5e: 레이아웃 컴포넌트의 codegen이 default value를 정상적으로 제외하도록 수정합니다.
- Updated dependencies [9d85c16]
- Updated dependencies [d951317]
- Updated dependencies [b3f964d]
  - @seed-design/css@0.0.27

## 0.0.25

### Patch Changes

- c8a6d41: codegen 결과물이 import 문을 함께 반환하는 기능을 추가합니다.
- Updated dependencies [c87ede9]
  - @seed-design/css@0.0.25

## 0.0.24

### Patch Changes

- Updated dependencies [4da536f]
  - @seed-design/css@0.0.24

## 0.0.23

### Patch Changes

- Updated dependencies [63e1541]
  - @seed-design/css@0.0.23

## 0.0.22

### Patch Changes

- 6c0133a: 커스텀 컴포넌트를 등록할 수 있도록 extend.componentHandlers 설정을 제공합니다.

## 0.0.21

### Patch Changes

- b167e95: NormalizedInstanceNode의 componentProperties에 componentSetKey를 추가합니다.
- 2f2f9b3: TextField codegen이 아이콘을 인식하지 못하는 문제를 수정합니다.
- 4d34760: 상단 내비게이션의 아이콘 버튼 터치영역을 44px로 변경합니다.
- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [5d69d1d]
- Updated dependencies [4d34760]
- Updated dependencies [7ae87f8]
- Updated dependencies [f144d28]
- Updated dependencies [e368c69]
  - @seed-design/css@0.0.21

## 0.0.20

### Patch Changes

- 38ece6a: Text style, 아이콘을 찾지 못했을 때 fallback을 추가합니다.

## 0.0.19

### Patch Changes

- Updated dependencies [3c9ec66]
- Updated dependencies [b3bb6e7]
  - @seed-design/css@0.0.19

## 0.0.18

### Patch Changes

- b28303c: borderRadius codegen에 radius prefix가 붙지 않도록 수정합니다.

## 0.0.17

### Patch Changes

- Updated dependencies [c042f90]
  - @seed-design/css@0.0.17

## 0.0.15

### Patch Changes

- 4511814: - 레이아웃 및 flex 관련 shorthand prop을 추가합니다. (px, py, wrap, align, justify, direction)
  - ActionButton에 flexGrow prop을 추가합니다.
  - VStack, HStack 컴포넌트를 추가합니다.
    - Stack, Inline, Columns 컴포넌트를 deprecated 처리합니다.
  - 디자인 토큰이 아닌 css prop의 value가 유효한 css value가 되도록 변경합니다.
    - flexStart, spaceBetween 등 camelCase로 제공되는 값을 deprecated 처리합니다.
- Updated dependencies [1bb9f7b]
- Updated dependencies [4511814]
- Updated dependencies [f4b0723]
- Updated dependencies [f4b0723]
  - @seed-design/css@0.0.15

## 0.0.6

### Patch Changes

- Updated dependencies [92c0b80]
- Updated dependencies [c1d94d0]
  - @seed-design/css@0.0.14

## 0.0.5

### Patch Changes

- Updated dependencies [7fca755]
  - @seed-design/css@0.0.13

## 0.0.4

### Patch Changes

- Updated dependencies [6426379]
- Updated dependencies [ee41f37]
  - @seed-design/css@0.0.12

## 0.0.3

### Patch Changes

- 9ff6487: - 숨겨진 노드 및 Fill을 무시하도록 수정합니다.
  - BOOLEAN_OPERATION 노드를 지원합니다.
- Updated dependencies [e70f340]
- Updated dependencies [72f344f]
  - @seed-design/css@0.0.11

## 0.0.2

### Patch Changes

- 1d9e06a: SEED Design의 Figma 통합을 위한 패키지를 제공합니다.

  - REST API와 Plugin API를 normalize 합니다. 플러그인 및 서버 환경 모두 동일한 방식으로 사용할 수 있도록 합니다.
  - Figma Plugin으로 제공되었던 Codegen 기능을 패키지로 제공합니다.

- Updated dependencies [e4b704c]
  - @seed-design/css@0.0.10
