# @seed-design/react-popover

## 1.0.5

### Patch Changes

- c9ae1cd: 화면 끝을 기준으로 위치를 잡는 컴포넌트가 노치·홈 인디케이터·가로 화면의 측면 safe area inset을 피하도록 수정합니다. Backdrop과 시트 배경은 그대로 화면 끝까지 채웁니다.

  - Dialog·BottomSheet·MenuSheet는 좌우 inset을 뺀 영역의 가운데에 놓이고, 너비도 그 영역을 넘지 않습니다.
  - Dialog는 위아래 inset도 피하고, 높이가 그 사이를 넘으면 안에서 스크롤합니다.
  - BottomSheet·MenuSheet의 높이는 화면 높이의 90%를 넘지 않고, 위쪽 inset이 그보다 크면 inset 아래까지로 제한됩니다. 넘친 내용은 시트 안에서 스크롤합니다.
  - Snackbar는 좌우와 하단 inset을 `--seed-safe-area-*` 변수로 피합니다.
  - HelpBubble은 네 방향의 inset을 피해 위치를 잡고, `overflowPadding`을 화면 끝이 아니라 safe area 경계에서부터 잽니다.

## 1.0.4

### Patch Changes

- e48f021: HelpBubble이 좁은 화면에서 화면 밖으로 잘리던 문제를 수정합니다. (Popover의 floating 요소 너비를 viewport에 맞게 동적으로 제한하고, 긴 텍스트가 Help Bubble 밖으로 넘치지 않도록 긴 단어 중간 줄바꿈을 허용합니다.)

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
