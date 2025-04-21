---
"@seed-design/figma": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

- 레이아웃 및 flex 관련 shorthand prop을 추가합니다. (px, py, wrap, align, justify, direction)
- ActionButton에 flexGrow prop을 추가합니다.
- VStack, HStack 컴포넌트를 추가합니다.
  - Stack, Inline, Columns 컴포넌트를 deprecated 처리합니다.
- 디자인 토큰이 아닌 css prop의 value가 유효한 css value가 되도록 변경합니다.
  - flexStart, spaceBetween 등 camelCase로 제공되는 값을 deprecated 처리합니다.
