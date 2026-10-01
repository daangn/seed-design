---
"@seed-design/lynx-react-field-button": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: Lynx `InputButton`의 이름을 React와 같은 `FieldButton`으로 바꿉니다. `InputButton.*`는 `FieldButton.*`로, `InputButtonRoot`·`InputButtonRootProps` 등 개별 export와 타입은 `FieldButtonRoot`·`FieldButtonRootProps` 등으로 옮기세요. Recipe(`@seed-design/lynx-css/recipes/input-button`)와 `seed-input-button` class는 그대로입니다. Registry `field-button` snippet은 `FieldButton`을 사용하도록 바뀌었고 `inputButtonRef` prop 이름이 `controlRef`로 바뀌었으므로 snippet을 다시 설치하세요.) Lynx FieldButton을 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-field-button`을 추가합니다. React `@seed-design/react-field-button`과 같이 선택값을 `values`·`onValuesChange`로만 받고 내부에 소유하지 않으며, `disabled`·`readOnly`일 때 Button·ClearButton tap 차단, Button 눌림 상태, 접근성 기본값을 제공합니다. ClearButton은 사용자 `bindtap` 다음에 `onValuesChange([])`를 호출합니다. Context는 `FieldButtonProvider`·`useFieldButtonContext({ strict })`, 파트는 React와 같은 `Root`·`Button`·`ClearButton`·`Description`·`ErrorMessage`입니다(form 제출 모델이 없어 `HiddenInput`·`name`은 제공하지 않습니다). `@seed-design/lynx-react` FieldButton은 렌더링 결과를 유지하며 이 패키지 위에 Recipe·stroke·Content Scale을 조립하고, `FieldButton.Root`에 `values`·`onValuesChange`를 추가합니다.
