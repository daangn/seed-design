# @seed-design/css

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
