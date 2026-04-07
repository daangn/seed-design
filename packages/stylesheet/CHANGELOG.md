# @seed-design/stylesheet

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

## 1.1.1

### Patch Changes

- 1b49be1: V3 compat을 강제로 적용하지 않고, 선택적으로 적용할 수 있도록 변경합니다.

## 1.1.0

### Patch Changes

- 93cfc30: feat: change theming data attribute names

  - Seed Design V3의 theming과 호환되도록 data attribute를 추가합니다.

- 9c06ce7: V3 다크모드 배경색과 일치하도록 주요 배경 색상을 변경합니다.

## 1.0.4

### Patch Changes

- cf271ad: sync design token

## 1.0.3

### Patch Changes

- 19be06c: recover lost changes

## 1.0.2

### Patch Changes

- fc69b3e: chore(stylesheet): change css selector logic

## 1.0.1

### Patch Changes

- 21773c2: style(stylesheet): add css selector

## 1.0.0

### Major Changes

- 1.0.0 Release

  ## Karrot UI → Seed Design 주요 변경 사항

  - 프로젝트/디자인 시스템 명이 **Seed Design**으로 리브랜딩 됩니다.
  - 패키지 명이 `@seed-design/*` 으로 변경됩니다.
  - `@karrot-ui/*` packages are deprecated.
  - `color-scheme: light dark` 지원이 기본값이 됩니다.
  - 디자인 토큰이 [KDT](https://github.com/daangn/kdt/tree/main/language) 의미론을 따릅니다.
