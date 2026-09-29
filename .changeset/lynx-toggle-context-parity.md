---
"@seed-design/lynx-react-toggle": minor
---

Toggle Context를 React의 `@seed-design/react-toggle`과 같은 형태로 제공합니다. `ToggleContext` 대신 `ToggleProvider`를 export하며, `useToggleContext`는 호출자 이름 대신 `{ strict }`를 받습니다. `strict: false`이면 Toggle Root 밖에서 `null`을 반환합니다.

`useToggleContext("Label")`처럼 문자열을 넘기던 호출은 `useToggleContext()`로 바꾸고, `ToggleContext.Provider`는 `ToggleProvider`로 바꿉니다.
