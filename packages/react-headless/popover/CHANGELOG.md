# @seed-design/react-popover

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

## 1.0.3

### Patch Changes

- 2c302a5: PopoverPositionerPortal과 HelpBubblePositionerPortal을 추가합니다.

## 1.0.2

### Patch Changes

- 0c1ab6a: 닫힌 HelpBubbleAnchor/HelpBubbleTrigger가 불필요하게 리렌더링되지 않도록 수정합니다.

## 1.0.1

### Patch Changes

- b10ff0b: closeOnInteractOutside를 false로 설정하여 Help Bubble 외부와 상호작용 시에도 닫히지 않도록 설정할 수 있습니다. (기본값: true)

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- Updated dependencies [34f92f2]
  - @seed-design/react-primitive@1.0.0
  - @seed-design/dom-utils@1.0.0

## 0.0.8

### Patch Changes

- 62094b6: Help Bubble의 스타일 문제를 수정합니다.

  - `placement=left-*` / `placement=right-*`에서 arrow가 content와 떨어져 표시되는 문제를 수정합니다.

## 0.0.7

### Patch Changes

- Updated dependencies [29ec9f0]
  - @seed-design/react-primitive@0.0.3

## 0.0.6

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.

## 0.0.5

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [e368c69]
  - @seed-design/react-primitive@0.0.2
  - @seed-design/dom-utils@0.0.2

## 0.0.4

### Patch Changes

- f4b0723: HelpBubble의 enter, exit 모션을 추가합니다.

## 0.0.3

### Patch Changes

- c1d94d0: HelpBubble의 enter, exit 모션을 추가합니다.

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

## 0.0.0-alpha-20241030023710

### Patch Changes

- alpha
- Updated dependencies
  - @seed-design/dom-utils@0.0.0-alpha-20241030023710

## 0.0.0-alpha-20241004093556

### Patch Changes

- Updated dependencies
  - @seed-design/dom-utils@0.0.0-alpha-20241004093556
