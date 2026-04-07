# @seed-design/migration-index

## 2.0.0

### Major Changes

- Renamed all packages from `@seed-design/*` to `@ride-developer/*` and switched the CSS variable / data attribute / class name prefix from `seed` to `ride`.

  This is a **breaking change** for consumers. The `@ride-developer/*` packages are a hard fork of `@seed-design/*` v1.2.x with full ownership transferred to the Ride team. Existing `@seed-design/*` consumers must migrate by:

  1. Replacing all `@seed-design/*` package imports with `@ride-developer/*`
  2. Replacing all `--seed-*` CSS variables with `--ride-*`
  3. Replacing all `data-seed-*` attributes with `data-ride-*`
  4. Replacing all `data-seed` (no dash) attributes with `data-ride`
  5. Replacing all `dataset.seed*` JS access with `dataset.ride*`
  6. Replacing CSS class names: `seed-icon`, `seed-prefix-icon`, `seed-suffix-icon`, `seed-loading-indicator`, `seed-count`, `seed-box`, `seed-grid`, `seed-consistent-width` → `ride-*`
  7. Removing any `seed-bridge.ts` adapter file (alpha tokens are now natively published; see `MIGRATION.md` for details)

  Why this change:

  - Ride needs full ownership of the design system to add Ride-specific components that don't exist in Seed
  - Alpha tokens (`overlay`, `overlay-muted`, `static-black-alpha-*`, `static-white-alpha-*`) are now natively generated through the rootage pipeline, eliminating the `seed-bridge.ts` hardcoded RGBA hack that previously caused Dialog dim handling to break
  - CSS layer names changed: `@layer seed-base, seed-components` → `@layer ride-base, ride-components`

  See `MIGRATION.md` for the complete consumer migration guide including a sed-based automation cheat sheet and a name mapping table for all 44 packages.

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
