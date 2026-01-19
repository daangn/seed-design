---
"@seed-design/rootage-artifacts": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

`@seed-design/css@1.3` 및 `@seed-design/react@1.3`에서 제거되는 토큰 및 옵션에 관한 경고를 추가합니다.

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
