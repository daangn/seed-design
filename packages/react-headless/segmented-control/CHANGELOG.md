# @seed-design/react-segmented-control

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

### Patch Changes

- Updated dependencies
  - @ride-developer/dom-utils@2.0.0
  - @ride-developer/react-primitive@2.0.0
  - @ride-developer/react-supports@1.0.0

## 1.0.1

### Patch Changes

- ae1b768: :focus-visible selector를 사용하기 전 브라우저에서 selector를 지원하는지 확인합니다.
- Updated dependencies [ae1b768]
  - @seed-design/react-supports@0.0.1

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- Updated dependencies [34f92f2]
  - @seed-design/react-primitive@1.0.0
  - @seed-design/dom-utils@1.0.0

## 0.0.5

### Patch Changes

- Updated dependencies [29ec9f0]
  - @seed-design/react-primitive@0.0.3

## 0.0.4

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.

## 0.0.3

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [e368c69]
  - @seed-design/react-primitive@0.0.2
  - @seed-design/dom-utils@0.0.2

## 0.0.2

### Patch Changes

- 09fecb9: 누락된 seed-design/react-primitive 의존성 추가 및 불필요한 의존성 제거

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.
- Updated dependencies [b64023c]
  - @seed-design/dom-utils@0.0.1

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
- Updated dependencies
  - @seed-design/dom-utils@0.0.1-rc.0
