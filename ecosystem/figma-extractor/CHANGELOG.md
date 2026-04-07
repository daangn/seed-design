# @seed-design/figma-extractor

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

## 1.1.0

### Minor Changes

- 15d9587: `@seed-design/figma-extractor` config 파이프라인에서 `fetchNodes`를 context의 일부로 제공합니다.

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

## 0.0.5

### Patch Changes

- 99e7f2c: figma-extractor (Figma REST API 호출 결과를 파일로 저장하는 CLI 툴) 설정 파일 작성 방법을 개선합니다.

  - 사용자가 직접 API 호출부터 파일 저장까지의 파이프라인을 작성할 수 있습니다.

## 0.0.4

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.

## 0.0.3

### Patch Changes

- Sort exports

## 0.0.2

### Patch Changes

- component 추출 추가, 로그 개선 등

## 0.0.1

### Patch Changes

- First release

## 0.0.1-alpha-20250124070042

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124065342

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124063758

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124061957

### Patch Changes

- Alpha release

## 0.0.1-alpha-20250124060425

### Patch Changes

- Alpha release
