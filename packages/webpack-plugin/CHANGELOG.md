# @seed-design/webpack-plugin

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
  - @ride-developer/css@2.0.0

## 1.1.0

### Patch Changes

- Updated dependencies [d6bb84d]
- Updated dependencies [a55f584]
- Updated dependencies [191005f]
- Updated dependencies [b131282]
- Updated dependencies [6af6501]
- Updated dependencies [33def2d]
  - @seed-design/css@1.1.0

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- Updated dependencies [39a96f1]
- Updated dependencies [34f92f2]
- Updated dependencies [e038490]
- Updated dependencies [4153ca5]
- Updated dependencies [a7d07f0]
  - @seed-design/css@1.0.0

## 0.2.0

### Patch Changes

- Updated dependencies [8448880]
  - @seed-design/css@0.2.0

## 0.1.3

### Patch Changes

- 71c58fd: iOS Font Scaling

  - iOS 기기에서 시스템 폰트 크기 설정에 따라 동적으로 폰트 크기와 줄 높이를 조정하는 폰트 스케일링 옵션이 추가되었습니다.
  - 플러그인(webpack, vite, rsbuild)에서 `fontScaling` 옵션을 통해 폰트 스케일링 기능을 활성화할 수 있습니다.
  - `data-seed-font-scaling='enabled'` 일 때, 폰트 크기를 조정합니다.

- Updated dependencies [cdc0930]
- Updated dependencies [946faf7]
- Updated dependencies [71c58fd]
  - @seed-design/css@0.1.3

## 0.1.2

### Patch Changes

- 7b2c0f3: Updated dependencies
  - @seed-design/react@0.1.1
- Updated dependencies [7b2c0f3]
  - @seed-design/css@0.1.2

## 0.1.0

### Patch Changes

- Updated dependencies [7cc6087]
- Updated dependencies [bdca898]
  - @seed-design/css@0.1.0

## 0.0.41

### Patch Changes

- Updated dependencies [561f74c]
- Updated dependencies [b43de05]
  - @seed-design/css@0.0.41

## 0.0.39

### Patch Changes

- Updated dependencies [f801300]
  - @seed-design/css@0.0.39

## 0.0.38

### Patch Changes

- Updated dependencies [70fbaaf]
  - @seed-design/css@0.0.38

## 0.0.35

### Patch Changes

- Updated dependencies [0789dc8]
  - @seed-design/css@0.0.35

## 0.0.34

### Patch Changes

- Updated dependencies [92801a2]
  - @seed-design/css@0.0.34

## 0.0.33

### Patch Changes

- Updated dependencies [fbdb091]
  - @seed-design/css@0.0.33

## 0.0.31

### Patch Changes

- Updated dependencies [fd7c569]
  - @seed-design/css@0.0.31

## 0.0.30

### Patch Changes

- Updated dependencies [285cb9b]
  - @seed-design/css@0.0.30

## 0.0.29

### Patch Changes

- Updated dependencies [116ee2c]
  - @seed-design/css@0.0.29

## 0.0.28

### Patch Changes

- Updated dependencies [5337e14]
  - @seed-design/css@0.0.28

## 0.0.27

### Patch Changes

- Updated dependencies [9d85c16]
- Updated dependencies [d951317]
- Updated dependencies [b3f964d]
  - @seed-design/css@0.0.27

## 0.0.26

### Patch Changes

- c8b2921: types 필드와 exports 필드를 수정해요

## 0.0.25

### Patch Changes

- Updated dependencies [c87ede9]
  - @seed-design/css@0.0.25

## 0.0.24

### Patch Changes

- Updated dependencies [4da536f]
  - @seed-design/css@0.0.24

## 0.0.23

### Patch Changes

- Updated dependencies [63e1541]
  - @seed-design/css@0.0.23

## 0.0.21

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [5d69d1d]
- Updated dependencies [4d34760]
- Updated dependencies [7ae87f8]
- Updated dependencies [f144d28]
- Updated dependencies [e368c69]
  - @seed-design/css@0.0.21

## 0.0.19

### Patch Changes

- Updated dependencies [3c9ec66]
- Updated dependencies [b3bb6e7]
  - @seed-design/css@0.0.19

## 0.0.17

### Patch Changes

- Updated dependencies [c042f90]
  - @seed-design/css@0.0.17

## 0.0.15

### Patch Changes

- 1bb9f7b: - vite dev에서 컴포넌트 스타일시트가 로드되지 않는 버그를 수정합니다.
  - 플러그인이 컴포넌트 스타일시트를 로드하는 방식을 변경합니다.
- Updated dependencies [1bb9f7b]
- Updated dependencies [4511814]
- Updated dependencies [f4b0723]
- Updated dependencies [f4b0723]
  - @seed-design/css@0.0.15

## 0.0.14

### Patch Changes

- Updated dependencies [92c0b80]
- Updated dependencies [c1d94d0]
  - @seed-design/css@0.0.14

## 0.0.13

### Patch Changes

- Updated dependencies [7fca755]
  - @seed-design/css@0.0.13

## 0.0.12

### Patch Changes

- Updated dependencies [6426379]
- Updated dependencies [ee41f37]
  - @seed-design/css@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [e70f340]
- Updated dependencies [72f344f]
  - @seed-design/css@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies [e4b704c]
  - @seed-design/css@0.0.10

## 0.0.9

### Patch Changes

- Updated dependencies [63f8651]
- Updated dependencies [d9b01a9]
  - @seed-design/css@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies [1424700]
- Updated dependencies [0efeea1]
  - @seed-design/css@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies [8aca3de]
  - @seed-design/css@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies [bf198e8]
- Updated dependencies [3d66c5b]
- Updated dependencies [a8d5242]
- Updated dependencies [ccf3989]
  - @seed-design/css@0.0.6

## 0.0.5

### Patch Changes

- Updated dependencies [e3234e7]
- Updated dependencies [5502bed]
  - @seed-design/css@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies [6df5d19]
- Updated dependencies [5cb50e7]
  - @seed-design/css@0.0.4

## 0.0.3

### Patch Changes

- bad86f9: loosen up peer dependencies
- b180822: Inject data-seed in theming script instead of plugin
- b20de60: Move the injection location of the theming script from pre-body to pre-head.
- Updated dependencies [a33af94]
- Updated dependencies [b180822]
  - @seed-design/css@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [d04e344]
  - @seed-design/css@0.0.2

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.
- Updated dependencies [b64023c]
  - @seed-design/css@0.0.1
