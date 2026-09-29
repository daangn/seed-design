---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `@seed-design/lynx-css`를 같은 릴리스 버전으로 함께 올려야 합니다. `BoxProps`·`StackProps`·`VStackProps`·`HStackProps`를 `interface ... extends`로 확장하던 코드는 타입 교차(`&`)로 바꿔야 합니다.) Lynx `Box`·`VStack`·`HStack`의 style prop을 CSS 변수와 전역 규칙으로 적용합니다.

- style prop이 inline 최종 값 대신 `--seed-box-*` CSS 변수와 `seed-box-*` class로 전달되고, `@seed-design/lynx-css`의 전역 규칙이 값을 계산합니다.
- `m`·`mx`·`mt` 등 margin prop과 `bleed`·`bleedX`·`bleedTop` 등 bleed prop을 추가합니다. bleed 값으로 dimension 토큰을 쓸 수 있습니다.
