# @seed-design/stackflow

## 1.1.17

### Patch Changes

- 6db2515: AppBar의 `bg` 또는 `background` 프로퍼티로 배경 색상을 조절할 수 있는 옵션을 추가합니다. (`tone="layer"`인 경우 적용)

## 1.1.16

### Patch Changes

- 6d30b72: Stackflow와 함께 AppScreen 사용 시 최상위 AppScreen이 push/pop될 때, 이외의 AppScreen이 고유한 `transitionStyle`을 재생하는 문제를 수정합니다. 같은 스택 내에 여러 `transitionStyle`이 공존할 때 자연스러운 트랜지션을 제공하기 위해 최상위 AppScreen의 `transitionStyle`을 재생합니다. ([데모](https://seed-design.io/react/stackflow/app-screen#transition-styles))

  - 예를 들면, `transitionStyle="fadeFromBottomAndroid"`인 0번 AppScreen 위에 `transitionStyle="slideFromLeftIOS"`인 1번 AppScreen이 push되는 경우, 0번 AppScreen이 `slideFromLeftIOS` 트랜지션을 재생하도록 수정합니다.
    - 0번 AppScreen이 자연스럽게 좌측으로 조금 밀려나며 어두워지고(`slideFromLeftIOS`) 1번 AppScreen이 우측에서 슬라이드 인(`slideFromLeftIOS`)

- Updated dependencies [2f29fe8]
- Updated dependencies [9119723]
- Updated dependencies [6d30b72]
- Updated dependencies [10c0765]
- Updated dependencies [5e462db]
  - @seed-design/css@1.1.16

## 1.1.15

### Patch Changes

- e4b0ce8: AppScreen 스와이프 중 취소 시 트랜지션이 끝난 뒤에도 `GlobalInteraction`의 `data-swipe-back-state`가 `idle`로 되돌아가지 않고 `canceling`으로 남아 있는 문제를 수정합니다.
- Updated dependencies [76acd7e]
- Updated dependencies [7a428ec]
- Updated dependencies [498a9e7]
  - @seed-design/css@1.1.15

## 1.1.11

### Patch Changes

- ea488c5: @seed-design/stackflow: @stackflow/react-ui-core를 peerDependencies에서 dependencies로 이동합니다.

## 1.1.9

### Patch Changes

- 4e7e15b: Stackflow 플러그인이 최신이 아닌 data attribute에 의해 잘못된 트랜지션을 재생하지 않도록 수정합니다.
- Updated dependencies [37d332d]
- Updated dependencies [77517f1]
  - @seed-design/css@1.1.9

## 1.1.5

### Patch Changes

- 7529e31: @seed-design/stackflow 패키지에서 `useActivityZIndexBase` 훅을 제공합니다.
- Updated dependencies [53290ab]
  - @seed-design/css@1.1.5

## 1.1.0

### Patch Changes

- b131282: AppScreen에 `tone` 속성을 조절해 그라데이션이 들어간 투명한 배경을 사용할 수 있습니다.

  - AppBar에 있던 `tone` 속성을 AppScreen에서도 사용할 수 있도록 이동합니다.
  - AppScreen, AppBar 둘 다 `tone` 속성을 사용할 수 있도록 합니다.

- Updated dependencies [d6bb84d]
- Updated dependencies [a55f584]
- Updated dependencies [191005f]
- Updated dependencies [b131282]
- Updated dependencies [6af6501]
- Updated dependencies [33def2d]
  - @seed-design/css@1.1.0

## 1.0.5

### Patch Changes

- 9b91751: AppScreen에서 스와이프로 pop할 때 AppScreen이 한번 깜빡거리고 닫히는 버그를 수정합니다.
- Updated dependencies [f1cf4cd]
- Updated dependencies [9b91751]
- Updated dependencies [3898183]
  - @seed-design/css@1.0.5

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
  - @seed-design/react-primitive@1.0.0
  - @seed-design/dom-utils@1.0.0

## 0.2.0

### Patch Changes

- Updated dependencies [8448880]
  - @seed-design/css@0.2.0

## 0.1.3

### Patch Changes

- cdc0930: `@seed-design/stackflow` 백스와이프 애니메이션 개선

  - iOS 스타일 화면 전환 애니메이션의 지속 시간과 타이밍 함수가 `300ms`에서 `350ms`로 조정되어 더 부드러운 전환 효과를 제공합니다.
  - 스와이프 백 제스처 시 애니메이션이 보다 자연스럽고 일관되게 표현됩니다.
  - 스와이프 백 종료 시 CSS 변수를 활용해 전환 상태를 명확히 하여 사용자 경험이 개선되었습니다.

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

## 0.0.37

### Patch Changes

- 97a1237: `@stackflow/react-ui-core`의 usePreventTouchDuringTransition prop `ref`로 이름을 변경했습니다

## 0.0.36

### Patch Changes

- 479e38b: 화면 전환 중 터치 입력이 차단합니다.

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

- 29ec9f0: `reactSlot.createSlot is not a function` 오류가 발생하지 않도록, radix-ui/react-slot 버전을 1.2.3으로 수정합니다.
- Updated dependencies [116ee2c]
- Updated dependencies [29ec9f0]
  - @seed-design/css@0.0.29
  - @seed-design/react-primitive@0.0.3

## 0.0.28

### Patch Changes

- Updated dependencies [5337e14]
  - @seed-design/css@0.0.28

## 0.0.27

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.
- Updated dependencies [9d85c16]
- Updated dependencies [d951317]
- Updated dependencies [b3f964d]
  - @seed-design/css@0.0.27

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

- 63e1541: AppBar의 배경이 상단 safe-area를 덮도록 수정합니다.
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
  - @seed-design/react-primitive@0.0.2
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
  - @seed-design/react-primitive@0.0.1
  - @seed-design/dom-utils@0.0.1

## 0.0.1-rc.4

### Patch Changes

- Updated dependencies [93cfc30]
  - @seed-design/css@0.0.1-rc.4

## 0.0.1-rc.3

### Patch Changes

- Updated dependencies [cc4b2c5]
  - @seed-design/css@0.0.1-rc.3

## 0.0.1-rc.1

### Patch Changes

- Updated dependencies [14c9983]
  - @seed-design/css@0.0.1-rc.1

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
- Updated dependencies
  - @seed-design/css@0.0.1-rc.0
  - @seed-design/react-primitive@0.0.1-rc.0
  - @seed-design/dom-utils@0.0.1-rc.0
