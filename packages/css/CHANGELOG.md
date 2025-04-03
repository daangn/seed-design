# @seed-design/css

## 0.0.12

### Patch Changes

- 6426379: 유틸리티 컴포넌트에 사용되는 ScopedColorFg, ScopedColorBg, ScopedColorPalette, ScopedColorStroke 타입을 제공합니다.
- ee41f37: close button의 위치가 의도와 다르게 설정된 것을 수정합니다.

## 0.0.11

### Patch Changes

- e70f340: Dialog 및 Sheet 컴포넌트 레이아웃 스펙 업데이트
- 72f344f: `$dimension.spacing-y.screen-bottom` 토큰을 추가합니다.
  `$dimension.spacing-y.between-text` 토큰을 추가합니다.

## 0.0.10

### Patch Changes

- e4b704c: Avatar size=42를 추가합니다.

## 0.0.9

### Patch Changes

- 63f8651: MannerTemp 컴포넌트를 추가합니다.
- d9b01a9: feat: 다크모드에서의 gray200, gray300 색상, 라이트모드 carrot700 색상을 변경해요

  - (light) carrot700: #e84500 -> #e04f00
  - (dark) gray300: #2c2f35 -> #2b2e35
  - (dark) gray200: #1b1c22 -> #22252b

## 0.0.8

### Patch Changes

- 1424700: Notification Badge를 추가합니다.

  - Tabs의 Notification 슬롯을 Notification Badge로 변경합니다.

- 0efeea1: change help-bubble paddingY, lineHeight

## 0.0.7

### Patch Changes

- 8aca3de: remove text maxLines none display unset

## 0.0.6

### Patch Changes

- bf198e8: Skeleton의 width, height가 동작하지 않는 버그를 수정합니다.
- 3d66c5b: visuallyHidden을 recipe에서 제거합니다.
- a8d5242: callout, inline banner 디자인 스펙 수정
- ccf3989: fix: add --seed-safe-area-top in app-bar

## 0.0.5

### Patch Changes

- e3234e7: single-slot recipe를 위한 간소화된 인터페이스를 추가합니다.
- 5502bed: add textStyles (t6, t7 regular, medium)

## 0.0.4

### Patch Changes

- 6df5d19: Badge 디자인 업데이트
  - neutral tone 색상 변경
  - pill shape 삭제
- 5cb50e7: recipe 스타일시트의 exports map을 수정합니다.

## 0.0.3

### Patch Changes

- a33af94: Fixes an issue where the theming script was injecting the wrong color mode data-attr.
- b180822: Inject data-seed in theming script instead of plugin

## 0.0.2

### Patch Changes

- d04e344: theming script의 color mode data attribute 수정

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.

## 0.0.1-rc.4

### Patch Changes

- 93cfc30: feat: change theming data attribute names

  - theming에 사용되는 data attribute 이름을 변경합니다.
  - 유저가 선호하는 color scheme과 사전에 지정된 color mode를 구분하기 쉽도록 이름을 부여합니다.
  - 파편화된 platform 관련 네이밍을 통일합니다.
  - 테마 관련 data attribute가 지정되지 않은 경우 light theme로 fallback하는 동작을 추가합니다.

## 0.0.1-rc.3

### Patch Changes

- cc4b2c5: fix: externalize subpath imports from `@seed-design/css`
  refactor: streamline package configurations
  refactor(qvism): generate recipe-shared module from cli

## 0.0.1-rc.1

### Patch Changes

- 14c9983: change package.json exports map

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
