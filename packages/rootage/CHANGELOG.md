# @seed-design/rootage-artifacts

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
