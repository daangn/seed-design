# @seed-design/migration-index

## 2.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 2.0.0

### Major Changes

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

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

## 0.0.30

### Patch Changes

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

## 0.0.28

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

## 0.0.20

### Patch Changes

- f17f842: - static 색상들의 맵핑을 추가해요
  - `needsVerification` 필드를 추가해요

## 0.0.18

### Patch Changes

- a7e2571: fix color mapping (divider-1, on-gray-overlay-50)

## 0.0.3

### Patch Changes

- 4f465ba: remove static next token

## 0.0.2

### Patch Changes

- 9f55b8f: add iconography index

## 0.0.1

## 0.0.1-rc.0

### Patch Changes

- f83bbf8: migration index, codemod (vars, tailwind)
