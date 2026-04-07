# @seed-design/docs-mcp

## 1.0.0

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

## 0.5.1

### Patch Changes

- e92892a: 아이콘 정보를 업데이트합니다.

## 0.5.0

### Minor Changes

- c300110: Tool의 개수를 유지보수 가능한 형태로 줄였습니다

## 0.4.0

### Minor Changes

- 0315e98: 아이콘 라이브러리 관련 새로운 도구 3개를 추가합니다. (아이콘 목록 조회, 검색, 상세 정보 조회)

## 0.3.0

### Minor Changes

- 63b65db: - `get_rootage` tool 추가 (design token 및 component spec 조회)
  - React 문서 조회 기능 개선 및 fetch 함수 통합

## 0.2.0

### Minor Changes

- f385599: `list_foundation`, `get_foundation`, `list_docs_components`, `get_docs_component` tools 추가

## 0.1.0

### Minor Changes

- 8661d79: `@seed-design/docs-mcp` 패키지 추가

  Tools:

  - `get_react_component`
  - `get_breeze_component`
  - `get_react_changelog`
  - `list_react_components`
  - `list_breeze_components`
  - `get_react_changelog`
