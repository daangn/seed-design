# @seed-design/react-popover

## 2.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-floating@1.0.1
  - @seed-design/react-primitive@2.0.1

## 2.0.0

### Major Changes

- 029d052: Help Bubble Tooltip 컴포넌트를 추가합니다.

### Patch Changes

- Updated dependencies [029d052]
- Updated dependencies [ec33023]
  - @seed-design/react-floating@1.0.0
  - @seed-design/react-primitive@2.0.0

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
