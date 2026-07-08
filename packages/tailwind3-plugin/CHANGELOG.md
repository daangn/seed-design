# @seed-design/tailwind3-plugin

## 2.2.0

### Minor Changes

- f523979: Action Button의 pressed 상태에 scale 모션을 추가합니다.

  pressed 상태에 적절한 모션 피드백을 제공하기 위해 사용하는 `$scale.s95`, `$scale.s97`, `$scale.s98` 토큰을 추가합니다.

  - `scale` 토큰은 플랫폼 별 동작 줄이기 설정에 따라 값이 `1`로 동작합니다.
  - 웹 CSS 환경에서는 `(prefers-reduced-motion: reduce)` 미디어 쿼리가 매치되는 환경에서 `1`로 동작합니다.
  - Tailwind 유틸리티 클래스 `scale-s*`를 통해 scale 토큰을 사용할 수 있습니다. 신규 토큰을 사용할 수 있도록 Tailwind 패키지의 `@seed-design/css` peerDependency 범위를 `^2.1.0`에서 `^2.2.0`으로 올립니다.

## 2.1.0

### Minor Changes

- f2b198d: `$color.bg.layer-fill` 토큰을 다시 추가합니다.

  `2.0.0`에서 제거했으나 마땅한 대체 토큰이 없어 deprecated 상태로 되살립니다. 값은 제거 이전과 동일합니다. 추후 동일한 값의 새 이름 토큰으로 대체된 뒤 `3.0.0`에서 제거될 예정입니다.

  `@seed-design/tailwind3-plugin`과 `@seed-design/tailwind4-theme`의 `@seed-design/css` peer dependency 버전 범위를 `^2.1.0`으로 올립니다.

## 2.0.0

### Major Changes

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

- 60d1a82: 1.2에서 deprecate된 옵션을 제거합니다.

  - 색상 토큰
    - `$color.bg.layer-fill`: 라이트 및 다크 모드에서 모두 테스트 후 `$color.bg.neutral-weak`으로 대체할 수 있습니다.
  - 그라디언트 토큰
    - `$gradient.fade-layer-floating`
    - `$gradient.fade-layer-default`
  - Chip Tabs의 `brandSolid` variant
  - AppBar의 `divider` 옵션
  - Image Frame의 `rounded` variant: `borderRadius` 옵션을 사용해주세요.
  - Switch의 `small` 및 `medium` size: 각각 `16`과 `32`를 사용해주세요.
  - Checkbox의 `default` 및 `stronger` weight: 각각 `regular`와 `bold`를 사용해주세요.
  - `<Box display="inlineFlex" />` 등 유틸리티 컴포넌트 레이아웃 프로퍼티의 camelCase 옵션: kebab-case 옵션을 사용해주세요.
    - `display`, `justifyContent`, `justify`, `alignItems`, `align`, `alignContent`, `alignSelf`, `flexDirection`, `direction`
  - `AppBar`의 `divider` 옵션
    - 하단 구분선이 더 이상 표시되지 않습니다.
  - `BottomSheetRoot` (`DrawerRoot`)의 `noBodyStyles` 옵션
    - 제거되어 기본값(true)처럼 동작합니다.
  - `BottomSheetRoot` (`DrawerRoot`)의 `preventScrollRestoration` 옵션
    - 제거되어 기본값(false)처럼 동작합니다.
  - `BottomSheetRoot`의 `direction` 옵션
    - BottomSheet는 항상 아래에서 올라오므로 `direction`을 받지 않습니다.
  - `BottomSheetBackdrop` (`DrawerBackdrop`)의 `forceMount` 옵션
    - 제거되어 `BottomSheetRoot` (`DrawerRoot`)의 `lazyMount`/`unmountOnExit` 옵션으로 대체할 수 있습니다.
  - `BottomSheetContent` (`DrawerContent`)의 `onPointerDownOutside`, `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onInteractOutside`, `forceMount`, `onFocusOutside` 옵션
    - 제거되어 `BottomSheetRoot` (`DrawerRoot`)의 `onOpenChange` 두 번째 인자 `details`를 통해 대체할 수 있습니다.

## 1.1.19

### Patch Changes

- 7588e59: 신규 pressed 상태 스타일링을 위한 `$duration.pressed-scale` 및 `$timing-function.pressed-scale` 토큰을 추가합니다. (컴포넌트 변경사항 없음)

## 1.1.18

### Patch Changes

- 751e952: `$color.stroke.focus-ring` 색상 토큰을 추가합니다.

## 1.1.17

### Patch Changes

- 6fab0e7: Skeleton 가시성 향상을 위해 `$gradient.shimmer-magic` 및 `$gradient.shimmer-neutral` 토큰의 색상을 업데이트합니다.
- 5faef3a: 주석, 참고 사항 및 상세 리스트 등 부가 정보에 사용할 수 있는 시맨틱 텍스트 스타일 `articleNote`를 추가합니다.
- 94bebf8: `$color.bg.layer-basement` 위에서 컴포넌트의 가시성을 보장하기 위해 `$color.bg.neutral-weak-alpha` 토큰을 추가합니다.

  - Chip `variant=solid`에 적용
  - ChipTab `variant=neutralSolid`에 적용
  - SegmentedControl root에 적용

## 1.1.16

### Patch Changes

- 2f29fe8: 정적 텍스트 스타일 추가 (t1Static* ~ t10Static*)
- 10c0765: 배너 템플릿에 사용되는 `$color.banner.*` 색상 토큰을 추가합니다.

## 1.1.13

### Patch Changes

- cc4a45a: 신규 [Elevation 가이드](https://seed-design.io/docs/foundation/elevation)에 맞는 shadow 토큰을 추가합니다.

  - React: Box, Flex, HStack 등 StyleProps를 사용하는 컴포넌트에서 `boxShadow` prop을 사용하여 shadow 토큰을 쉽게 사용할 수 있습니다.

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

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- e038490: (**BREAKING CHANGE**: Snippet을 다시 설치해야 합니다.) Manner Temp, Manner Temp Badge 컴포넌트를 업데이트합니다.

  - snippet 내 오타 수정
  - 신규 10단계 반영
  - 업데이트 가이드
    1. `@seed-design/css@latest @seed-design/react@latest` 설치
    2. `npx @seed-design/cli@latest add ui:manner-temp ui:manner-temp-badge`로 snippet 최신화
    3. 온도 범위가 변경되었으므로, `<MannerTemp level="l1" />` 혹은 `<MannerTempBadge level="l1" />`과 같이 `level`을 직접 지정하여 사용하고 있는 경우가 있는지 확인

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

## 0.1.6

### Patch Changes

- 3c13ad7: `highlight-magic-pressed` 그라디언트 토큰을 추가합니다.

## 0.1.3

### Patch Changes

- 946faf7: 그라디언트 토큰 추가 및 변경

  - `fade-layer-floating`, `fade-layer-default` 토큰이 추가되었습니다.
  - `$gradient.shimmer-magic` 토큰 stop color가 변경되었습니다.

## 0.1.2

### Patch Changes

- 7b2c0f3: Updated dependencies
  - @seed-design/react@0.1.1

## 0.1.1

### Patch Changes

- e3b782d: `stroke.neutral`, `stroke.neutral-muted`, `stroke.on-image`의 컬러를 alpha 값으로 변경합니다.

## 0.0.41

### Patch Changes

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

## 0.0.21

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.

## 0.0.12

### Patch Changes

- ac83753: tailwind plugin (v3), tailwind theme (v4)를 제공해요.
