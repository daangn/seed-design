---
"@seed-design/lynx-react-field": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `Field.Label`은 이제 `Field.Root` 밖에서 렌더링하면 오류가 납니다. `Field.Root` 안으로 옮기세요. `Field.Description`·`Field.ErrorMessage`는 이전에도 `Field.Root`가 필요했습니다.) Lynx Field를 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-field`를 추가합니다. `required`·`disabled`·`readOnly`·`invalid`, 입력이 알리는 `focused`와 `setFocused`, Root native view의 `rootRef`를 제공하며, Context는 React `@seed-design/react-field`와 같이 `useFieldContext({ strict })`로 읽습니다. 파트는 React와 같은 `Root`·`Label`·`Description`·`ErrorMessage`입니다. `@seed-design/lynx-react` Field는 이 패키지 위에 Recipe와 Header·IndicatorText·RequiredIndicator·Footer·CharacterCount 표현을 조립하며 렌더링 결과는 바뀌지 않습니다.
