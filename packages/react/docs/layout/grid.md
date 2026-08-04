file: components/(foundation)/layout/grid.mdx

# Grid

Grid 컴포넌트는 CSS Grid를 사용하며 디자인 토큰을 JSX에서 사용할 수 있도록 도와줍니다.

## Preview

```tsx
import { Flex, Grid } from "@seed-design/react";

export default function GridPreview() {
  return (
    <Grid columns={3} gap="x2" width="full" height="full" p="x8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Flex
          key={index}
          bg="palette.purple300"
          color="palette.purple700"
          borderRadius="r2"
          align="center"
          justify="center"
        >
          {index + 1}
        </Flex>
      ))}
    </Grid>
  );
}
```

## Props \[#props]

### `Grid` \[#grid]

- `margin`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Margin on all four sides. Cannot be combined with any \`bleed\*\` prop.
- `m`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`margin\`. Cannot be combined with any \`bleed\*\` prop.
- `marginX`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Horizontal margin (left + right). Cannot be combined with any \`bleed\*\` prop.
- `mx`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginX\`. Cannot be combined with any \`bleed\*\` prop.
- `marginY`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Vertical margin (top + bottom). Cannot be combined with any \`bleed\*\` prop.
- `my`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginY\`. Cannot be combined with any \`bleed\*\` prop.
- `marginTop`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Top margin. Cannot be combined with any \`bleed\*\` prop.
- `mt`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginTop\`. Cannot be combined with any \`bleed\*\` prop.
- `marginRight`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Right margin. Cannot be combined with any \`bleed\*\` prop.
- `mr`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginRight\`. Cannot be combined with any \`bleed\*\` prop.
- `marginBottom`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Bottom margin. Cannot be combined with any \`bleed\*\` prop.
- `mb`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginBottom\`. Cannot be combined with any \`bleed\*\` prop.
- `marginLeft`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Left margin. Cannot be combined with any \`bleed\*\` prop.
- `ml`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginLeft\`. Cannot be combined with any \`bleed\*\` prop.
- `bleed`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedTop`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative top margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedRight`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative right margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedBottom`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative bottom margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedLeft`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative left margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `color`
  - type: `(string & {}) | ScopedColorFg | ScopedColorPalette | undefined`
- `bg`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorBg | ScopedColorBanner | undefined`
  - description: Shorthand for \`background\`.
- `background`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorBg | ScopedColorBanner | undefined`
- `bgGradient`
  - type: `"glowMagic" | "glowMagicPressed" | "highlightMagic" | "highlightMagicPressed" | "shimmerMagic" | "shimmerNeutral" | undefined`
  - description: Shorthand for \`backgroundGradient\`.
- `backgroundGradient`
  - type: `"glowMagic" | "glowMagicPressed" | "highlightMagic" | "highlightMagicPressed" | "shimmerMagic" | "shimmerNeutral" | undefined`
- `bgGradientDirection`
  - type: `(string & {}) | "to right" | "to left" | "to top" | "to bottom" | "to top right" | "to top left" | "to bottom right" | "to bottom left" | undefined`
  - description: Shorthand for \`backgroundGradientDirection\`. e.g. \`43deg\`
- `backgroundGradientDirection`
  - type: `(string & {}) | "to right" | "to left" | "to top" | "to bottom" | "to top right" | "to top left" | "to bottom right" | "to bottom left" | undefined`
  - description: e.g. \`43deg\`
- `borderColor`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorStroke | undefined`
- `borderWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderTopWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderRightWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderBottomWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderLeftWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderTopLeftRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderTopRightRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderBottomRightRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderBottomLeftRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `boxShadow`
  - type: `(string & {}) | "s1" | "s2" | "s3" | undefined`
- `width`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `minWidth`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `maxWidth`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `height`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `minHeight`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `maxHeight`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `top`
  - type: `0 | (string & {}) | undefined`
- `left`
  - type: `0 | (string & {}) | undefined`
- `right`
  - type: `0 | (string & {}) | undefined`
- `bottom`
  - type: `0 | (string & {}) | undefined`
- `padding`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `p`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`padding\`.
- `paddingX`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `px`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingX\`.
- `paddingY`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `py`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingY\`.
- `paddingTop`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
- `pt`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
  - description: Shorthand for \`paddingTop\`.
- `paddingRight`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `pr`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingRight\`.
- `paddingBottom`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
- `pb`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
  - description: Shorthand for \`paddingBottom\`.
- `paddingLeft`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `pl`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingLeft\`.
- `position`
  - type: `"fixed" | "relative" | "absolute" | "sticky" | undefined`
- `overflowX`
  - type: `"hidden" | "auto" | "visible" | "scroll" | undefined`
- `overflowY`
  - type: `"hidden" | "auto" | "visible" | "scroll" | undefined`
- `zIndex`
  - type: `number | (string & {}) | undefined`
- `flexGrow`
  - type: `true | 0 | 1 | (number & {}) | undefined`
  - description: If true, flex-grow will be set to \`1\`.
- `flexShrink`
  - type: `true | 0 | (number & {}) | undefined`
  - description: If true, flex-shrink will be set to \`1\`.
- `flexDirection`
  - type: `ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse"> | undefined`
- `flexWrap`
  - type: `true | "wrap" | "wrap-reverse" | "nowrap" | undefined`
  - description: If true, flex-wrap will be set to \`wrap\`.
- `justifyContent`
  - type: `"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | undefined`
- `justifySelf`
  - type: `"center" | "start" | "end" | "stretch" | undefined`
  - description: In flexbox layout, this property is ignored.
- `alignItems`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `alignContent`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `alignSelf`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `gap`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `gridColumn`
  - type: `string | undefined`
- `gridRow`
  - type: `string | undefined`
- `unstable_transform`
  - type: `string | undefined`
- `_active`
  - type: `{ bg?: ScopedColorBg | ScopedColorPalette | (string & {}); background?: ScopedColorBg | ScopedColorPalette | (string & {}); } | undefined`
- `as`
  - type: `React.ElementType<any, keyof React.JSX.IntrinsicElements> | undefined`
- `asChild`
  - type: `boolean | undefined`
- `hideFrom`
  - type: `BreakpointThreshold | undefined`
- `display`
  - type: `ResponsiveValue<"none" | "grid"> | undefined`
  - default: `"grid"`
- `align`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
  - description: Shorthand for \`alignItems\`.
- `justify`
  - type: `"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | undefined`
  - description: Shorthand for \`justifyContent\`.
- `justifyItems`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `columns`
  - type: `ResponsiveValue<string | number> | undefined`
  - description: Shorthand for \`gridTemplateColumns\`. If number, \`repeat(\{columns}, minmax(0, 1fr))\` is applied.
- `rows`
  - type: `ResponsiveValue<string | number> | undefined`
  - description: Shorthand for \`gridTemplateRows\`. If number, \`repeat(\{rows}, minmax(0, 1fr))\` is applied.
- `autoFlow`
  - type: `"row" | "column" | "row dense" | "column dense" | undefined`
  - description: Shorthand for \`gridAutoFlow\`.
- `autoColumns`
  - type: `string | undefined`
  - description: Shorthand for \`gridAutoColumns\`.
- `autoRows`
  - type: `string | undefined`
  - description: Shorthand for \`gridAutoRows\`.

### `GridItem` \[#griditem]

`GridItem`은 Grid 컨테이너 내에서 아이템의 배치를 제어하는 컴포넌트입니다. Grid 내부의 모든 아이템이 `GridItem`일 필요는 없습니다.

- `margin`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Margin on all four sides. Cannot be combined with any \`bleed\*\` prop.
- `m`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`margin\`. Cannot be combined with any \`bleed\*\` prop.
- `marginX`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Horizontal margin (left + right). Cannot be combined with any \`bleed\*\` prop.
- `mx`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginX\`. Cannot be combined with any \`bleed\*\` prop.
- `marginY`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Vertical margin (top + bottom). Cannot be combined with any \`bleed\*\` prop.
- `my`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginY\`. Cannot be combined with any \`bleed\*\` prop.
- `marginTop`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Top margin. Cannot be combined with any \`bleed\*\` prop.
- `mt`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginTop\`. Cannot be combined with any \`bleed\*\` prop.
- `marginRight`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Right margin. Cannot be combined with any \`bleed\*\` prop.
- `mr`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginRight\`. Cannot be combined with any \`bleed\*\` prop.
- `marginBottom`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Bottom margin. Cannot be combined with any \`bleed\*\` prop.
- `mb`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginBottom\`. Cannot be combined with any \`bleed\*\` prop.
- `marginLeft`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Left margin. Cannot be combined with any \`bleed\*\` prop.
- `ml`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "auto" | (string & {})> | undefined`
  - description: Shorthand for \`marginLeft\`. Cannot be combined with any \`bleed\*\` prop.
- `bleed`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedTop`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative top margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedRight`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative right margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedBottom`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative bottom margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedLeft`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "asPadding"> | undefined`
  - description: Negative left margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `color`
  - type: `(string & {}) | ScopedColorFg | ScopedColorPalette | undefined`
- `bg`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorBg | ScopedColorBanner | undefined`
  - description: Shorthand for \`background\`.
- `background`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorBg | ScopedColorBanner | undefined`
- `bgGradient`
  - type: `"glowMagic" | "glowMagicPressed" | "highlightMagic" | "highlightMagicPressed" | "shimmerMagic" | "shimmerNeutral" | undefined`
  - description: Shorthand for \`backgroundGradient\`.
- `backgroundGradient`
  - type: `"glowMagic" | "glowMagicPressed" | "highlightMagic" | "highlightMagicPressed" | "shimmerMagic" | "shimmerNeutral" | undefined`
- `bgGradientDirection`
  - type: `(string & {}) | "to right" | "to left" | "to top" | "to bottom" | "to top right" | "to top left" | "to bottom right" | "to bottom left" | undefined`
  - description: Shorthand for \`backgroundGradientDirection\`. e.g. \`43deg\`
- `backgroundGradientDirection`
  - type: `(string & {}) | "to right" | "to left" | "to top" | "to bottom" | "to top right" | "to top left" | "to bottom right" | "to bottom left" | undefined`
  - description: e.g. \`43deg\`
- `borderColor`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorStroke | undefined`
- `borderWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderTopWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderRightWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderBottomWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderLeftWidth`
  - type: `0 | (string & {}) | 1 | undefined`
- `borderRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderTopLeftRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderTopRightRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderBottomRightRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `borderBottomLeftRadius`
  - type: `0 | (string & {}) | "r0_5" | "r1" | "r1_5" | "r2" | "r2_5" | "r3" | "r3_5" | "r4" | "r5" | "r6" | "full" | undefined`
- `boxShadow`
  - type: `(string & {}) | "s1" | "s2" | "s3" | undefined`
- `width`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `minWidth`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `maxWidth`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `height`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `minHeight`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `maxHeight`
  - type: `ResponsiveValue<Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "full"> | undefined`
- `top`
  - type: `0 | (string & {}) | undefined`
- `left`
  - type: `0 | (string & {}) | undefined`
- `right`
  - type: `0 | (string & {}) | undefined`
- `bottom`
  - type: `0 | (string & {}) | undefined`
- `padding`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `p`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`padding\`.
- `paddingX`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `px`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingX\`.
- `paddingY`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `py`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingY\`.
- `paddingTop`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
- `pt`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
  - description: Shorthand for \`paddingTop\`.
- `paddingRight`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `pr`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingRight\`.
- `paddingBottom`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
- `pb`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {}) | "safeArea"> | undefined`
  - description: Shorthand for \`paddingBottom\`.
- `paddingLeft`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `pl`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`paddingLeft\`.
- `display`
  - type: `ResponsiveValue<"none" | "grid" | "inline" | "block" | "flex" | "inline-flex" | "inline-block"> | undefined`
- `position`
  - type: `"fixed" | "relative" | "absolute" | "sticky" | undefined`
- `overflowX`
  - type: `"hidden" | "auto" | "visible" | "scroll" | undefined`
- `overflowY`
  - type: `"hidden" | "auto" | "visible" | "scroll" | undefined`
- `zIndex`
  - type: `number | (string & {}) | undefined`
- `flexGrow`
  - type: `true | 0 | 1 | (number & {}) | undefined`
  - description: If true, flex-grow will be set to \`1\`.
- `flexShrink`
  - type: `true | 0 | (number & {}) | undefined`
  - description: If true, flex-shrink will be set to \`1\`.
- `flexDirection`
  - type: `ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse"> | undefined`
- `flexWrap`
  - type: `true | "wrap" | "wrap-reverse" | "nowrap" | undefined`
  - description: If true, flex-wrap will be set to \`wrap\`.
- `justifyContent`
  - type: `"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | undefined`
- `justifySelf`
  - type: `"center" | "start" | "end" | "stretch" | undefined`
  - description: In flexbox layout, this property is ignored.
- `alignItems`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `alignContent`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `alignSelf`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
- `gap`
  - type: `ResponsiveValue<0 | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
- `unstable_transform`
  - type: `string | undefined`
- `_active`
  - type: `{ bg?: ScopedColorBg | ScopedColorPalette | (string & {}); background?: ScopedColorBg | ScopedColorPalette | (string & {}); } | undefined`
- `as`
  - type: `React.ElementType<any, keyof React.JSX.IntrinsicElements> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: If true, the component will render its children directly without a wrapper element.
- `hideFrom`
  - type: `BreakpointThreshold | undefined`
- `colSpan`
  - type: `number | "full" | undefined`
  - description: Number of columns to span, or "full" for full width (1 / -1).
- `rowSpan`
  - type: `number | "full" | undefined`
  - description: Number of rows to span, or "full" for full height (1 / -1).
- `colStart`
  - type: `number | undefined`
  - description: Starting column
- `colEnd`
  - type: `number | undefined`
  - description: Ending column.
- `rowStart`
  - type: `number | undefined`
  - description: Starting row
- `rowEnd`
  - type: `number | undefined`
  - description: Ending row.

## Columns and Rows \[#columns-and-rows]

`<Grid>`의 `columns` 또는 `rows` prop에 number를 지정하여 `grid-template-columns` 또는 `grid-template-rows`를 `repeat(${columns|rows}, minmax(0, 1fr))`로 설정할 수 있습니다.

```tsx
import { Divider, Flex, Grid, HStack } from "@seed-design/react";

export default function GridNumber() {
  return (
    <HStack gap="x4" width="full" height="full" p="x8">
      <Grid flexGrow columns={2} gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.purple300"
            color="palette.purple700"
            borderRadius="r2"
            align="center"
            justify="center"
          >
            {n}
          </Flex>
        ))}
      </Grid>
      <Divider orientation="vertical" />
      <Grid flexGrow rows={2} gap="x2" autoFlow="column">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.green300"
            color="palette.green700"
            borderRadius="r2"
            align="center"
            justify="center"
          >
            {n}
          </Flex>
        ))}
      </Grid>
    </HStack>
  );
}
```

`<Grid>`의 `columns` 또는 `rows`에 `grid-template-columns` 또는 `grid-template-rows` 값을 직접 지정할 수도 있습니다.

```tsx
import { Divider, Flex, Grid, HStack } from "@seed-design/react";

export default function GridString() {
  return (
    <HStack gap="x4" width="full" height="full" p="x8">
      <Grid flexGrow columns="3fr 1fr" gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.purple300"
            color="palette.purple700"
            borderRadius="r2"
            align="center"
            justify="center"
          >
            {n}
          </Flex>
        ))}
      </Grid>
      <Divider orientation="vertical" />
      <Grid flexGrow rows="1fr 3fr" gap="x2" autoFlow="column">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg="palette.green300"
            color="palette.green700"
            borderRadius="r2"
            align="center"
            justify="center"
          >
            {n}
          </Flex>
        ))}
      </Grid>
    </HStack>
  );
}
```

## Spanning Items \[#spanning-items]

`<GridItem>`을 활용하여 그리드 아이템이 여러 열이나 행을 차지하도록 할 수 있습니다.

- `colSpan` 또는 `colStart`, `colEnd` prop으로 열 span을 지정합니다. `colSpan="full"`을 전달하면 행 전체 (좌우 양 끝)을 차지합니다.
- `rowSpan` 또는 `rowStart`, `rowEnd` prop으로 행 span을 지정합니다. `rowSpan="full"`을 전달하면 열 전체 (상하 양 끝)을 차지합니다.

```tsx
import { Divider, Grid, GridItem, HStack } from "@seed-design/react";

export default function Spanning() {
  return (
    <HStack gap="x4" width="full" height="full" p="x8">
      <Grid flexGrow columns={4} gap="x2">
        <GridItem
          colSpan={2}
          display="flex"
          bg="palette.purple600"
          color="palette.purple200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          1
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.purple300"
          color="palette.purple600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          2
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.purple300"
          color="palette.purple600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          3
        </GridItem>
        <GridItem
          colSpan="full"
          display="flex"
          bg="palette.purple600"
          color="palette.purple200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          4
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.purple300"
          color="palette.purple600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          5
        </GridItem>
        <GridItem
          rowSpan={2}
          display="flex"
          bg="palette.purple600"
          color="palette.purple200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          6
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.purple300"
          color="palette.purple600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          7
        </GridItem>
        <GridItem
          colStart={2}
          colEnd={-1}
          display="flex"
          bg="palette.purple600"
          color="palette.purple200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          8
        </GridItem>
      </Grid>
      <Divider orientation="vertical" />
      <Grid flexGrow rows={4} gap="x2" autoFlow="column">
        <GridItem
          rowSpan={2}
          display="flex"
          bg="palette.green600"
          color="palette.green200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          1
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.green300"
          color="palette.green600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          2
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.green300"
          color="palette.green600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          3
        </GridItem>
        <GridItem
          rowSpan="full"
          display="flex"
          bg="palette.green600"
          color="palette.green200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          4
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.green300"
          color="palette.green600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          5
        </GridItem>
        <GridItem
          colSpan={2}
          display="flex"
          bg="palette.green600"
          color="palette.green200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          6
        </GridItem>
        <GridItem
          display="flex"
          bg="palette.green300"
          color="palette.green600"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          7
        </GridItem>
        <GridItem
          rowStart={2}
          rowEnd={-1}
          display="flex"
          bg="palette.green600"
          color="palette.green200"
          borderRadius="r2"
          alignItems="center"
          justifyContent="center"
        >
          8
        </GridItem>
      </Grid>
    </HStack>
  );
}
```

## Auto Flow \[#auto-flow]

`<Grid>`의 `autoFlow` prop을 사용하여 아이템이 배치되는 방향을 지정할 수 있습니다.

```tsx
import { useState } from "react";
import { Grid, type GridProps, GridItem, VStack } from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

type AutoFlow = NonNullable<GridProps["autoFlow"]>;

export default function AutoFlow() {
  const [autoFlow, setAutoFlow] = useState<AutoFlow>("row");

  const isColumn = autoFlow.startsWith("column");
  const color = isColumn ? "green" : "purple";

  const gridProps = isColumn ? { rows: 3 } : { columns: 3 };
  const spanProps = isColumn ? { rowSpan: 2 } : { colSpan: 2 };

  return (
    <VStack gap="x6" width="full" height="full" p="x8" align="center">
      <Grid {...gridProps} alignSelf="stretch" flexGrow gap="x2" autoFlow={autoFlow}>
        {[1, 2].map((n) => (
          <GridItem
            key={n}
            {...spanProps}
            display="flex"
            bg={`palette.${color}600`}
            color={`palette.${color}200`}
            borderRadius="r2"
            alignItems="center"
            justifyContent="center"
          >
            {n}
          </GridItem>
        ))}
        {[3, 4, 5].map((n) => (
          <GridItem
            key={n}
            display="flex"
            bg={`palette.${color}300`}
            color={`palette.${color}600`}
            borderRadius="r2"
            alignItems="center"
            justifyContent="center"
          >
            {n}
          </GridItem>
        ))}
      </Grid>
      <SegmentedControl
        value={autoFlow}
        onValueChange={(value) => setAutoFlow(value as AutoFlow)}
        aria-label="Auto Flow"
      >
        <SegmentedControlItem value="row">row</SegmentedControlItem>
        <SegmentedControlItem value="row dense">row dense</SegmentedControlItem>
        <SegmentedControlItem value="column">column</SegmentedControlItem>
        <SegmentedControlItem value="column dense">column dense</SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
```

## Auto Rows / Columns \[#auto-rows--columns]

`<Grid>`의 `autoRows` 또는 `autoColumns` prop을 사용하여 암시적으로 생성되는 행이나 열의 크기를 지정할 수 있습니다. 동적으로 아이템이 추가되는 그리드에서 유용합니다.

```tsx
import { Divider, Flex, Grid, HStack } from "@seed-design/react";

export default function AutoRowsColumns() {
  return (
    <HStack gap="x4" width="full" height="full" p="x8" align="flex-start">
      <Grid flexGrow columns={3} autoRows="1fr" gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg={n === 2 ? "palette.purple600" : "palette.purple300"}
            color={n === 2 ? "palette.purple200" : "palette.purple700"}
            borderRadius="r2"
            align="center"
            justify="center"
            p="x4"
          >
            {n === 2
              ? "Ea anim non aute minim ea deserunt enim Elit deserunt laborum et quis sit."
              : n}
          </Flex>
        ))}
      </Grid>
      <Divider orientation="vertical" style={{ alignSelf: "stretch" }} />
      <Grid flexGrow rows={3} autoColumns="1fr" autoFlow="column" gap="x2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Flex
            key={n}
            bg={n === 2 ? "palette.green600" : "palette.green300"}
            color={n === 2 ? "palette.green200" : "palette.green700"}
            borderRadius="r2"
            align="center"
            justify="center"
            p="x4"
          >
            {n === 2
              ? "Ea anim non aute minim ea deserunt enim Elit deserunt laborum et quis sit."
              : n}
          </Flex>
        ))}
      </Grid>
    </HStack>
  );
}
```

## Using `asChild` Prop \[#using-aschild-prop]

`GridItem`은 `asChild` prop을 사용하여 자식 요소에 직접 grid 속성을 적용할 수 있습니다.

<Card title="Composition" href="/react/components/concepts/composition#aschild-prop" icon="<IconComponent />">
  `asChild` prop에 대해 자세히 알아봅니다.
</Card>

```tsx
<Grid columns={3}>
  <GridItem colSpan={2} asChild>
    <a href="/link">Link spanning 2 columns</a>
  </GridItem>
</Grid>
```

## Using Box for Grid Item Placement \[#using-box-for-grid-item-placement]

`GridItem`은 내부적으로 `colSpan`, `colStart`, `colEnd`, `rowSpan`, `rowStart`, `rowEnd` prop을 `gridColumn` 및 `gridRow` 스타일로 변환하여 `Box`에 적용합니다.

따라서 `Box` 컴포넌트에서 `gridColumn`, `gridRow` prop을 직접 사용할 수도 있습니다.

```tsx
<Grid columns={3}>
  <Box gridColumn="span 2">colSpan=2</Box>
  <Box gridColumn="1 / -1">colSpan=full</Box>
  <Box gridColumn="2 / 4">colStart=2 colEnd=4</Box>
</Grid>
```

## Responsive Design \[#responsive-design]

<Card title="Responsive Design" href="/react/components/concepts/responsive-design">
  Grid의 `columns`, `rows`, `gap` 등에 반응형 값을 전달하여 viewport 크기에 따라 레이아웃을 조정할 수 있습니다.
</Card>