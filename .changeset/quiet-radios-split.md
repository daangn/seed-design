---
"@seed-design/lynx-react-radio-group": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: 선택 상태를 관리하던 `RadioGroup.Root`를 `@seed-design/lynx-react-radio-group`의 `RadioGroup.Root` 또는 `RadioGroupField.Root`로 교체하고, Root의 `weight`, `size`, `tone`을 `RadioGroup.Item`으로 옮겨야 합니다.) RadioGroup의 단일 선택 기능과 SEED 표현을 분리합니다.

- `@seed-design/lynx-react-radio-group`에 스타일 없는 `Root`, `Item`, `ItemControl`, `Label`, `Description`, `ErrorMessage`와 상태 hook·context를 추가합니다.
- `@seed-design/lynx-react`의 `RadioGroup.Root`는 스타일 컨테이너로 변경하고, Field 표현과 단일 선택 기능을 조립하는 `RadioGroupField`를 추가합니다.
- 최신 RadioGroup·RadioSelectBox Registry 컴포넌트는 `RadioGroupField.Root`를 사용합니다.
