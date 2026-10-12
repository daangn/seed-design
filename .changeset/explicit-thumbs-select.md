---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Slider.Thumb`·`Slider.ValueIndicatorRoot`·`Slider.ValueIndicatorLabel`의 `index={n}`을 `thumbIndex={n}`으로 변경해야 합니다. 생략한 곳에는 `thumbIndex={0}`을 지정하고, Registry `ui:slider`는 `npx @seed-design/cli@latest add ui:slider`로 다시 설치해야 합니다.)

`Slider.Thumb`·`Slider.ValueIndicatorRoot`·`Slider.ValueIndicatorLabel`이 참조할 thumb를 지정하는 prop을 선택적 `index`에서 필수 `thumbIndex`로 변경합니다.

- 이전에는 `index`를 생략하면 첫 thumb를 사용했지만, 이제 각 파트에 `thumbIndex`를 직접 지정해야 해당 thumb의 위치와 값을 표시합니다.
