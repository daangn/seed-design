# @seed-design/react-tabs

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

## 1.0.3

### Patch Changes

- 2552b1d: Tabs trigger에 포커스 후 키보드 조작으로 탭 변경 시 탭은 변경되지만 포커스가 이동하지 않는 문제를 수정합니다.
- a465d74: Tabs trigger에 포커스된 상태에서 키보드 조작 시 스크롤 등 브라우저 기본 동작이 발생하지 않도록 수정합니다.

## 1.0.2

### Patch Changes

- 938bf0b: TabsCarousel에 onSwipeStart, onSwipeEnd 이벤트 콜백을 추가합니다.

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

## 0.0.9

### Patch Changes

- ce047f5: Tabs.Carousel의 reInit 이벤트 시 탭 인덱스가 변경되지 않는 문제를 수정합니다.

## 0.0.8

### Patch Changes

- fd7c569: - Tabs.Carousel을 사용하는 경우 Hydration 이후 스크롤 애니매이션이 발생하는 문제를 수정합니다.
  - Tabs.Carousel의 드래그 제스처를 방지하는 영역을 선언할 수 있는 `Tabs.carouselPreventDrag` api를 추가합니다.
  - layout=hug일 때 Indicator에서 발생하는 Layout Shift를 수정합니다.
  - lazyMount 옵션이 의도와 다르게 모든 탭이 한꺼번에 마운트되는 문제를 수정합니다.

## 0.0.7

### Patch Changes

- 739b6bf: Tabs.Indicator의 width가 첫 렌더링 시 0으로 설정되는 문제를 수정합니다.

  Tabs의 불필요한 리렌더링을 줄입니다.

## 0.0.6

### Patch Changes

- Updated dependencies [29ec9f0]
  - @seed-design/react-primitive@0.0.3

## 0.0.5

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.

## 0.0.4

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [e368c69]
  - @seed-design/react-primitive@0.0.2
  - @seed-design/dom-utils@0.0.2

## 0.0.3

### Patch Changes

- fee050d: overflow된 Tab 선택 시 스크롤 동작을 추가합니다.

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

## 0.0.0-alpha-20241209060641

### Patch Changes

- tabs 스와이프 관련 이벤트 추가

## 0.0.0-alpha-20241204061301

### Patch Changes

- useSwipeable dragProps

## 0.0.0-alpha-20241203133940

### Patch Changes

- tabs 자잘한 스타일 수정 및 fixTriggerList prop 추가

## 0.0.0-alpha-20241202094027

### Patch Changes

- Tabs에 content-list에 스타일을 변경해요

## 0.0.0-alpha-20241202031729

### Patch Changes

- add --seed-design-tabs-current-tab-enabled-index css variable in root

## 0.0.0-alpha-20241202030714

### Patch Changes

- SSR 문제를 해결해요

## 0.0.0-alpha-20241030023710

### Patch Changes

- alpha
- Updated dependencies
  - @seed-design/dom-utils@0.0.0-alpha-20241030023710

## 0.0.0-alpha-20241014145845

### Patch Changes

- sync style chipTabs, Tabs to figma

## 0.0.0-alpha-20241004093556

### Patch Changes

- prerelease
- Updated dependencies
  - @seed-design/dom-utils@0.0.0-alpha-20241004093556
