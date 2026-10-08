---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Slider.Thumb`·`Slider.ValueIndicatorRoot`·`Slider.ValueIndicatorLabel`의 `index={n}`을 `thumbIndex={n}`으로 변경해야 합니다. 생략한 곳에는 `thumbIndex={0}`을 지정하고, Registry `ui:slider`는 `npx @seed-design/cli@latest add ui:slider`로 다시 설치해야 합니다.) 슬라이더의 thumb 지정 prop을 필수 `thumbIndex`로 변경합니다.
