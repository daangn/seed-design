---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `ProgressCircle.Root`와 `ProgressCircle.Range`를 직접 조합한다면 그 사이에 `<ProgressCircle.Track />`을 추가하고, `seed-progress-circle__root--tone_*` CSS 선택자는 `seed-progress-circle__track--tone_*`로 옮겨야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:progress-circle`과 `npx @seed-design/cli@latest add ui:quantity-picker`로 다시 설치해야 합니다.) `ProgressCircle`의 트랙을 `Track` 파트로 분리해 트랙과 진행 범위를 따로 조합할 수 있습니다.
