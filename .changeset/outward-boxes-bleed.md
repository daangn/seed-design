---
"@seed-design/lynx-react": minor
---

`Box`, `VStack`, `HStack`에 margin과 bleed style prop을 추가합니다.

- `m`, `mx`, `my`, `mt`, `mr`, `mb`, `ml`과 longhand margin prop으로 margin을 지정합니다. SEED 토큰, 길이, `"auto"`를 받습니다.
- `bleed`, `bleedX`, `bleedY`, `bleedTop`, `bleedRight`, `bleedBottom`, `bleedLeft`로 요소를 부모의 padding 영역까지 넓힙니다. px 길이, `0`, `"safeArea"`를 받으며, `"safeArea"`는 같은 방향의 safe area inset만큼 넓힙니다. Lynx는 inline style의 `calc()` 안에 있는 CSS 변수를 적용하지 않으므로, bleed는 SEED 토큰을 받지 않습니다.
- margin 계열과 bleed 계열은 함께 지정할 수 없습니다. 이 제약 때문에 `BoxProps`, `StackProps`, `VStackProps`, `HStackProps`가 union 타입으로 바뀌었습니다. 이 타입을 `interface ... extends`로 확장하던 코드는 `type MyBoxProps = BoxProps & { ... }`처럼 `type`으로 바꿔야 합니다.
- 이 변경으로 기존 `ui:result-section` snippet은 타입 검사를 통과하지 못합니다. snippet을 다시 내려받아 주세요.
  - `npx @seed-design/cli@latest add ui:result-section`
