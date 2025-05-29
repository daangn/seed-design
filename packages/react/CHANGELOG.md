# @seed-design/react

## 0.0.28

### Patch Changes

- Updated dependencies [5337e14]
  - @seed-design/css@0.0.28

## 0.0.27

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.
- Updated dependencies [9d85c16]
- Updated dependencies [d951317]
- Updated dependencies [7851a31]
- Updated dependencies [b3f964d]
  - @seed-design/css@0.0.27
  - @seed-design/react-segmented-control@0.0.4
  - @seed-design/react-pull-to-refresh@0.0.4
  - @seed-design/react-radio-group@0.0.3
  - @seed-design/react-text-field@0.0.3
  - @seed-design/react-checkbox@0.0.3
  - @seed-design/react-progress@0.0.3
  - @seed-design/react-snackbar@0.0.4
  - @seed-design/react-popover@0.0.6
  - @seed-design/react-avatar@0.0.3
  - @seed-design/react-dialog@0.0.4
  - @seed-design/react-portal@0.0.2
  - @seed-design/react-switch@0.0.3
  - @seed-design/react-toggle@0.0.3
  - @seed-design/react-tabs@0.0.5

## 0.0.25

### Patch Changes

- c87ede9: Avatar Stack의 디자인을 업데이트합니다.
- Updated dependencies [c87ede9]
  - @seed-design/css@0.0.25

## 0.0.24

### Patch Changes

- 4da536f: ActionSheet의 header가 렌더링되지 않을 때 상단 radius가 누락되는 버그를 수정합니다.
- 3efe201: `<Portal>` 컴포넌트를 제공합니다.
- Updated dependencies [4da536f]
- Updated dependencies [3efe201]
  - @seed-design/css@0.0.24
  - @seed-design/react-portal@0.0.1

## 0.0.23

### Patch Changes

- Updated dependencies [63e1541]
  - @seed-design/css@0.0.23

## 0.0.21

### Patch Changes

- 7ae87f8: 2개의 컨텐츠를 동일한 비율로 나누어 배치하되, 너무 긴 경우 세로로 접는 `<ResponsivePair>` 컴포넌트를 추가합니다.
- f144d28: BottomSheet, Dialog의 배경 색상을 layer-floating으로 변경합니다.
- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [5d69d1d]
- Updated dependencies [4d34760]
- Updated dependencies [7ae87f8]
- Updated dependencies [f144d28]
- Updated dependencies [e368c69]
  - @seed-design/css@0.0.21
  - @seed-design/react-segmented-control@0.0.3
  - @seed-design/react-pull-to-refresh@0.0.3
  - @seed-design/react-radio-group@0.0.2
  - @seed-design/react-text-field@0.0.2
  - @seed-design/react-primitive@0.0.2
  - @seed-design/react-checkbox@0.0.2
  - @seed-design/react-progress@0.0.2
  - @seed-design/react-snackbar@0.0.3
  - @seed-design/react-popover@0.0.5
  - @seed-design/react-avatar@0.0.2
  - @seed-design/react-dialog@0.0.3
  - @seed-design/react-switch@0.0.2
  - @seed-design/react-toggle@0.0.2
  - @seed-design/react-tabs@0.0.4
  - @seed-design/dom-utils@0.0.2

## 0.0.19

### Patch Changes

- Updated dependencies [3c9ec66]
- Updated dependencies [b3bb6e7]
  - @seed-design/css@0.0.19

## 0.0.17

### Patch Changes

- c042f90: recipe에서 직접 스타일시트 의존성을 표현하도록 변경합니다.
- Updated dependencies [c042f90]
  - @seed-design/css@0.0.17

## 0.0.15

### Patch Changes

- 1bb9f7b: - vite dev에서 컴포넌트 스타일시트가 로드되지 않는 버그를 수정합니다.
  - 플러그인이 컴포넌트 스타일시트를 로드하는 방식을 변경합니다.
- 4511814: - 레이아웃 및 flex 관련 shorthand prop을 추가합니다. (px, py, wrap, align, justify, direction)
  - ActionButton에 flexGrow prop을 추가합니다.
  - VStack, HStack 컴포넌트를 추가합니다.
    - Stack, Inline, Columns 컴포넌트를 deprecated 처리합니다.
  - 디자인 토큰이 아닌 css prop의 value가 유효한 css value가 되도록 변경합니다.
    - flexStart, spaceBetween 등 camelCase로 제공되는 값을 deprecated 처리합니다.
- d49e697: - Divider의 굵기가 의도보다 굵게 렌더링되는 버그 수정
  - borderColor, borderWidth 대신 color, thickness로 인터페이스 변경
- f4b0723: HelpBubble 디자인 스펙 업데이트 (shadow)
- f4b0723: HelpBubble의 enter, exit 모션을 추가합니다.
- Updated dependencies [1bb9f7b]
- Updated dependencies [4511814]
- Updated dependencies [f4b0723]
- Updated dependencies [f4b0723]
  - @seed-design/css@0.0.15
  - @seed-design/react-popover@0.0.4

## 0.0.14

### Patch Changes

- 87599b0: Divider 컴포넌트를 추가합니다.
- 92c0b80: HelpBubble 디자인 스펙 업데이트 (shadow)
- c1d94d0: HelpBubble의 enter, exit 모션을 추가합니다.
- Updated dependencies [92c0b80]
- Updated dependencies [c1d94d0]
  - @seed-design/css@0.0.14
  - @seed-design/react-popover@0.0.3

## 0.0.13

### Patch Changes

- 7fca755: Avatar의 Badge 스펙을 최신화합니다.
- Updated dependencies [7fca755]
- Updated dependencies [c0c0b7e]
  - @seed-design/css@0.0.13
  - @seed-design/react-pull-to-refresh@0.0.2

## 0.0.12

### Patch Changes

- 6426379: 유틸리티 컴포넌트에 사용되는 ScopedColorFg, ScopedColorBg, ScopedColorPalette, ScopedColorStroke 타입을 제공합니다.
- f5858ad: feat: icon scope를 `@daangn`에서 `@karrotmarket` 으로 변경해요
- Updated dependencies [fee050d]
- Updated dependencies [6426379]
- Updated dependencies [ee41f37]
  - @seed-design/react-tabs@0.0.3
  - @seed-design/css@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [e70f340]
- Updated dependencies [72f344f]
  - @seed-design/css@0.0.11

## 0.0.10

### Patch Changes

- e4b704c: Avatar size=42를 추가합니다.
- de5901d: Icon 컴포넌트에 color, size prop을 추가합니다.
- Updated dependencies [e4b704c]
- Updated dependencies [09fecb9]
  - @seed-design/css@0.0.10
  - @seed-design/react-segmented-control@0.0.2
  - @seed-design/react-snackbar@0.0.2
  - @seed-design/react-popover@0.0.2
  - @seed-design/react-dialog@0.0.2
  - @seed-design/react-tabs@0.0.2

## 0.0.9

### Patch Changes

- 63f8651: MannerTemp 컴포넌트를 추가합니다.
- Updated dependencies [63f8651]
- Updated dependencies [d9b01a9]
  - @seed-design/css@0.0.9

## 0.0.8

### Patch Changes

- 1424700: Notification Badge를 추가합니다.

  - Tabs의 Notification 슬롯을 Notification Badge로 변경합니다.

- Updated dependencies [1424700]
- Updated dependencies [0efeea1]
  - @seed-design/css@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies [8aca3de]
  - @seed-design/css@0.0.7

## 0.0.6

### Patch Changes

- 3d66c5b: visuallyHidden을 recipe에서 제거합니다.
- Updated dependencies [bf198e8]
- Updated dependencies [3d66c5b]
- Updated dependencies [a8d5242]
- Updated dependencies [ccf3989]
  - @seed-design/css@0.0.6

## 0.0.5

### Patch Changes

- e3234e7: single-slot recipe를 위한 간소화된 인터페이스를 추가합니다.
- Updated dependencies [e3234e7]
- Updated dependencies [5502bed]
  - @seed-design/css@0.0.5

## 0.0.4

### Patch Changes

- 6df5d19: Badge 디자인 업데이트
  - neutral tone 색상 변경
  - pill shape 삭제
- Updated dependencies [6df5d19]
- Updated dependencies [5cb50e7]
  - @seed-design/css@0.0.4

## 0.0.3

### Patch Changes

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
  - @seed-design/react-avatar@0.0.1
  - @seed-design/react-checkbox@0.0.1
  - @seed-design/react-dialog@0.0.1
  - @seed-design/react-popover@0.0.1
  - @seed-design/react-primitive@0.0.1
  - @seed-design/react-progress@0.0.1
  - @seed-design/react-pull-to-refresh@0.0.1
  - @seed-design/react-radio-group@0.0.1
  - @seed-design/react-segmented-control@0.0.1
  - @seed-design/react-snackbar@0.0.1
  - @seed-design/react-switch@0.0.1
  - @seed-design/react-tabs@0.0.1
  - @seed-design/react-text-field@0.0.1
  - @seed-design/react-toggle@0.0.1
  - @seed-design/dom-utils@0.0.1

## 0.0.1-rc.4

### Patch Changes

- Updated dependencies [93cfc30]
  - @seed-design/css@0.0.1-rc.4

## 0.0.1-rc.3

### Patch Changes

- cc4b2c5: fix: externalize subpath imports from `@seed-design/css`
  refactor: streamline package configurations
  refactor(qvism): generate recipe-shared module from cli
- Updated dependencies [cc4b2c5]
  - @seed-design/css@0.0.1-rc.3

## 0.0.1-rc.2

### Patch Changes

- Updated dependencies [14c9983]
  - @seed-design/css@0.0.1-rc.1

## 0.0.1-rc.1

### Patch Changes

- 6ee6544: re-export stylesheet from @seed-design/css package.

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
- Updated dependencies
  - @seed-design/css@0.0.1-rc.0
  - @seed-design/react-avatar@0.0.1-rc.0
  - @seed-design/react-checkbox@0.0.1-rc.0
  - @seed-design/react-dialog@0.0.1-rc.0
  - @seed-design/react-popover@0.0.1-rc.0
  - @seed-design/react-primitive@0.0.1-rc.0
  - @seed-design/react-progress@0.0.1-rc.0
  - @seed-design/react-pull-to-refresh@0.0.1-rc.0
  - @seed-design/react-radio-group@0.0.1-rc.0
  - @seed-design/react-segmented-control@0.0.1-rc.0
  - @seed-design/react-snackbar@0.0.1-rc.0
  - @seed-design/react-switch@0.0.1-rc.0
  - @seed-design/react-tabs@0.0.1-rc.0
  - @seed-design/react-text-field@0.0.1-rc.0
  - @seed-design/react-toggle@0.0.1-rc.0
  - @seed-design/dom-utils@0.0.1-rc.0
