---
"@seed-design/lynx-react-progress": minor
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

(BREAKING CHANGE: `ProgressCircle.Root`와 `ProgressCircle.Range`를 직접 조립한다면 그 사이에 `<ProgressCircle.Track />`을 추가해야 트랙이 보입니다. `seed-progress-circle__root--tone_*`의 배경색은 `seed-progress-circle__track--tone_*`로 옮겼습니다. Registry `ui:progress-circle`·`ui:quantity-picker`는 `npx @seed-design/cli@latest add`로 다시 설치하세요.) Lynx ProgressCircle을 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-progress`를 추가합니다. `useProgress`, `Root`·`Track`·`Range`, `ProgressCircleProvider`·`useProgressCircleContext({ strict })`를 제공합니다.
