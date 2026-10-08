---
"@seed-design/lynx-react-toggle": major
---

(BREAKING CHANGE: `ToggleContext.Provider`를 `ToggleProvider`로, `useToggleContext("호출자 이름")`을 `useToggleContext()`로 변경해야 합니다.) `useToggleContext`가 `{ strict }` 옵션을 받습니다. Provider 밖에서 선택적으로 호출하려면 `useToggleContext({ strict: false })`를 사용하고 반환값이 `null`인 경우를 처리해야 합니다.
