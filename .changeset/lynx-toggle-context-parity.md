---
"@seed-design/lynx-react-toggle": major
---

(BREAKING CHANGE: `ToggleContext.Provider`를 `ToggleProvider`로, `useToggleContext("호출자 이름")`을 `useToggleContext()`로 변경해야 합니다. Provider 밖에서 선택적으로 호출한다면 `useToggleContext({ strict: false })`를 사용하고 반환값이 `null`인 경우를 처리해야 합니다.)

Toggle의 context API를 React와 같은 Provider와 strict 옵션 형태로 변경합니다.

- 직접 사용하던 `ToggleContext` export를 제거하고 `ToggleProvider`를 제공합니다.
- `useToggleContext`는 호출자 이름 문자열 대신 `{ strict }` 옵션을 받습니다. 기본 호출은 Provider가 필요하며, `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
