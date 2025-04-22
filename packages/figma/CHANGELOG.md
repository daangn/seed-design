# @seed-design/figma

## 0.0.18

### Patch Changes

- b28303c: borderRadius codegen에 radius prefix가 붙지 않도록 수정합니다.

## 0.0.17

### Patch Changes

- Updated dependencies [c042f90]
  - @seed-design/css@0.0.17

## 0.0.15

### Patch Changes

- 4511814: - 레이아웃 및 flex 관련 shorthand prop을 추가합니다. (px, py, wrap, align, justify, direction)
  - ActionButton에 flexGrow prop을 추가합니다.
  - VStack, HStack 컴포넌트를 추가합니다.
    - Stack, Inline, Columns 컴포넌트를 deprecated 처리합니다.
  - 디자인 토큰이 아닌 css prop의 value가 유효한 css value가 되도록 변경합니다.
    - flexStart, spaceBetween 등 camelCase로 제공되는 값을 deprecated 처리합니다.
- Updated dependencies [1bb9f7b]
- Updated dependencies [4511814]
- Updated dependencies [f4b0723]
- Updated dependencies [f4b0723]
  - @seed-design/css@0.0.15

## 0.0.6

### Patch Changes

- Updated dependencies [92c0b80]
- Updated dependencies [c1d94d0]
  - @seed-design/css@0.0.14

## 0.0.5

### Patch Changes

- Updated dependencies [7fca755]
  - @seed-design/css@0.0.13

## 0.0.4

### Patch Changes

- Updated dependencies [6426379]
- Updated dependencies [ee41f37]
  - @seed-design/css@0.0.12

## 0.0.3

### Patch Changes

- 9ff6487: - 숨겨진 노드 및 Fill을 무시하도록 수정합니다.
  - BOOLEAN_OPERATION 노드를 지원합니다.
- Updated dependencies [e70f340]
- Updated dependencies [72f344f]
  - @seed-design/css@0.0.11

## 0.0.2

### Patch Changes

- 1d9e06a: SEED Design의 Figma 통합을 위한 패키지를 제공합니다.

  - REST API와 Plugin API를 normalize 합니다. 플러그인 및 서버 환경 모두 동일한 방식으로 사용할 수 있도록 합니다.
  - Figma Plugin으로 제공되었던 Codegen 기능을 패키지로 제공합니다.

- Updated dependencies [e4b704c]
  - @seed-design/css@0.0.10
