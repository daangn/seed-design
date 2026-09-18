# @seed-design/lynx-react-toggle

## 0.1.0

### Minor Changes

- fa699aa: Lynx 요소의 선택 상태와 사용자 입력을 관리하는 headless `Toggle` 컴포넌트를 추가합니다.

  - `Toggle.Root`가 native `view` 요소에 tap·touch 이벤트와 접근성 속성을 연결하고, 하위 컴포넌트에 상태를 공유합니다.
  - `pressed`, `defaultPressed`, `onPressedChange`로 controlled/uncontrolled 선택 상태를 구성하고, `disabled`로 사용자 입력에 의한 토글을 막을 수 있습니다.
  - 선택 상태와 별도로 터치 중인 상태를 관리하며, 터치가 취소되거나 비활성화되면 터치 중인 상태를 해제합니다.
  - 직접 동작을 구성하는 `useToggle`과 하위 컴포넌트에서 상태를 읽는 `useToggleContext`를 함께 제공합니다. 시각적 스타일은 사용처에서 지정합니다.

### Patch Changes

- Updated dependencies [fa699aa]
  - @seed-design/lynx-react-use-controllable-state@0.1.0
  - @seed-design/lynx-react-use-press-tap@0.1.0
