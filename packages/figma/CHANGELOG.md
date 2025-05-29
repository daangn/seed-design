# @seed-design/figma

## 0.0.28

### Patch Changes

- b3da758: Figma XML 타겟에서 instance 노드의 컴포넌트 정보를 제공합니다.
- Updated dependencies [5337e14]
  - @seed-design/css@0.0.28

## 0.0.27

### Patch Changes

- 4133c5e: 레이아웃 컴포넌트의 codegen이 default value를 정상적으로 제외하도록 수정합니다.
- Updated dependencies [9d85c16]
- Updated dependencies [d951317]
- Updated dependencies [b3f964d]
  - @seed-design/css@0.0.27

## 0.0.25

### Patch Changes

- c8a6d41: codegen 결과물이 import 문을 함께 반환하는 기능을 추가합니다.
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

## 0.0.22

### Patch Changes

- 6c0133a: 커스텀 컴포넌트를 등록할 수 있도록 extend.componentHandlers 설정을 제공합니다.

## 0.0.21

### Patch Changes

- b167e95: NormalizedInstanceNode의 componentProperties에 componentSetKey를 추가합니다.
- 2f2f9b3: TextField codegen이 아이콘을 인식하지 못하는 문제를 수정합니다.
- 4d34760: 상단 내비게이션의 아이콘 버튼 터치영역을 44px로 변경합니다.
- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [5d69d1d]
- Updated dependencies [4d34760]
- Updated dependencies [7ae87f8]
- Updated dependencies [f144d28]
- Updated dependencies [e368c69]
  - @seed-design/css@0.0.21

## 0.0.20

### Patch Changes

- 38ece6a: Text style, 아이콘을 찾지 못했을 때 fallback을 추가합니다.

## 0.0.19

### Patch Changes

- Updated dependencies [3c9ec66]
- Updated dependencies [b3bb6e7]
  - @seed-design/css@0.0.19

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
