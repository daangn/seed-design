---
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: `ProgressCircle.Root`와 `ProgressCircle.Range`를 직접 조합한다면 그 사이에 `<ProgressCircle.Track />`을 추가해야 트랙이 보입니다. `seed-progress-circle__root--tone_*` CSS 선택자는 `seed-progress-circle__track--tone_*`로 옮겨야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:progress-circle`과 `npx @seed-design/cli@latest add ui:quantity-picker`로 다시 설치해야 합니다.)

`ProgressCircle`의 배경 트랙을 React와 같이 별도 `ProgressCircle.Track` 파트로 그립니다.

- 이전에는 `Root`가 tone에 맞는 배경색으로 트랙을 직접 그렸습니다. 이제 `Root`는 트랙을 그리지 않고, `Track`이 진행률과 관계없이 전체 링을 tone의 트랙 색으로 그립니다.
- tone별 트랙 색은 `Track` 요소에 적용되므로 tone class가 `seed-progress-circle__root--tone_*`에서 `seed-progress-circle__track--tone_*`로 바뀝니다.
- `Track`에 `className`·`style`을 지정해 트랙만 따로 꾸밀 수 있습니다.
