---
"@seed-design/css": minor
"@seed-design/react": minor
---

Box, Flex, Grid, VStack, HStack 등 레이아웃 컴포넌트에 margin 관련 프로퍼티를 추가합니다.

- `margin`/`m`, `marginX`/`mx`, `marginY`/`my`, `marginTop`/`mt`, `marginRight`/`mr`, `marginBottom`/`mb`, `marginLeft`/`ml`
- `"auto"` 리터럴 및 breakpoint 기반 반응형 스타일링을 지원합니다.
- `margin*`과 `bleed*`를 동시에 사용할 수 없도록 타입 레벨 제약(discriminated union)을 추가합니다.
  - @seed-design/react를 통해 제공되는 다음 인터페이스가 `interface`에서 `type`으로 전환됩니다.
    - `BoxProps`, `FlexProps`, `GridProps`, `StackProps`, `VStackProps`, `HStackProps`, `ArticleProps`, `AspectRatioProps`, `ColumnsProps`, `ColumnProps`, `GridItemProps`, `ImageFrameProps`, `InlineProps`, `ResponsivePairProps`.
  - 위 인터페이스를 `extend`하는 타입은 `type X = BoxProps & {...}`처럼 전환할 수 있습니다.

Box, Flex, Grid, VStack, HStack 등 레이아웃 컴포넌트에 4개 방향 모두에 negative margin을 적용하는 `bleed` 프로퍼티를 추가합니다.
