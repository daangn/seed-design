# @seed-design/react-field-button

## 0.0.0-alpha-20260511052324

### Patch Changes

- Updated dependencies [0cb4cf3]
  - @seed-design/react-primitive@0.0.0-alpha-20260511052324

## 1.0.2

### Patch Changes

- 751e952: FieldButton 내부 clear button이 FieldButton 상호작용에 따른 data prop을 받지 않도록 수정합니다.

## 1.0.1

### Patch Changes

- 53290ab: FieldButton에 Read Only 상태를 추가합니다. Disabled 상태인 FieldButton은 내부 `<input />`도 `disabled` 속성을 갖도록 수정합니다.
- ae1b768: :focus-visible selector를 사용하기 전 브라우저에서 selector를 지원하는지 확인합니다.
- Updated dependencies [ae1b768]
  - @seed-design/react-supports@0.0.1

## 1.0.0

### Major Changes

- d6bb84d: (BREAKING CHANGE: TextField snippet을 다시 설치해야 합니다.) Text Field 관련 컴포넌트를 업데이트합니다.

  - 스타일 업데이트
  - size 통일 및 variant (underline) 추가
  - 내부적으로 Field 컴포넌트를 사용하도록 변경하여 스타일 일관성 향상

  Field Button 컴포넌트를 추가합니다.
