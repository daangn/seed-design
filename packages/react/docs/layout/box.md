file: components/(foundation)/layout/box.mdx

# Box

Box 컴포넌트는 가장 기초적인 레이아웃 컴포넌트입니다. 디자인 토큰을 JSX에서 사용할 수 있도록 도와줍니다.

## Preview

```tsx
import { Box } from "@seed-design/react";

export default function BoxPreview() {
  return (
    <Box
      bg="bg.neutralWeak"
      borderWidth="2"
      borderColor="stroke.brandWeak"
      borderRadius="r2"
      px="x3"
      py="x2"
      boxShadow="s2"
    >
      Box Example
    </Box>
  );
}
```

## Usage \[#usage]

```tsx
import { Box } from "@seed-design/react";
```

```tsx
<Box />
```

## Props \[#props]

- `bg`
  - type: `(string & {}) | ScopedColorBg | ScopedColorPalette | ScopedColorBanner | undefined`
  - description: Shorthand for \`background\`.
- `background`
  - type: `(string & {}) | ScopedColorBg | ScopedColorPalette | ScopedColorBanner | undefined`
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
- `color`
  - type: `(string & {}) | ScopedColorPalette | ScopedColorFg | undefined`
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
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `minWidth`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `maxWidth`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `height`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `minHeight`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `maxHeight`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `top`
  - type: `0 | (string & {}) | undefined`
- `left`
  - type: `0 | (string & {}) | undefined`
- `right`
  - type: `0 | (string & {}) | undefined`
- `bottom`
  - type: `0 | (string & {}) | undefined`
- `padding`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `p`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`padding\`.
- `paddingX`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `px`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`paddingX\`.
- `paddingY`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `py`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`paddingY\`.
- `paddingTop`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "safeArea"> | undefined`
- `pt`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "safeArea"> | undefined`
  - description: Shorthand for \`paddingTop\`.
- `paddingRight`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `pr`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`paddingRight\`.
- `paddingBottom`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "safeArea"> | undefined`
- `pb`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "safeArea"> | undefined`
  - description: Shorthand for \`paddingBottom\`.
- `paddingLeft`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `pl`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
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
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `gridColumn`
  - type: `string | undefined`
- `gridRow`
  - type: `string | undefined`
- `unstable_transform`
  - type: `string | undefined`
- `_active`
  - type: `{ bg?: ScopedColorBg | ScopedColorPalette | (string & {}); background?: ScopedColorBg | ScopedColorPalette | (string & {}); } | undefined`
- `bleed`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedTop`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative top margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedRight`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative right margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedBottom`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative bottom margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedLeft`
  - type: `ResponsiveValue<0 | (string & {}) | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Negative left margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `margin`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Margin on all four sides. Cannot be combined with any \`bleed\*\` prop.
- `m`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`margin\`. Cannot be combined with any \`bleed\*\` prop.
- `marginX`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Horizontal margin (left + right). Cannot be combined with any \`bleed\*\` prop.
- `mx`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`marginX\`. Cannot be combined with any \`bleed\*\` prop.
- `marginY`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Vertical margin (top + bottom). Cannot be combined with any \`bleed\*\` prop.
- `my`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`marginY\`. Cannot be combined with any \`bleed\*\` prop.
- `marginTop`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Top margin. Cannot be combined with any \`bleed\*\` prop.
- `mt`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`marginTop\`. Cannot be combined with any \`bleed\*\` prop.
- `marginRight`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Right margin. Cannot be combined with any \`bleed\*\` prop.
- `mr`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`marginRight\`. Cannot be combined with any \`bleed\*\` prop.
- `marginBottom`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Bottom margin. Cannot be combined with any \`bleed\*\` prop.
- `mb`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`marginBottom\`. Cannot be combined with any \`bleed\*\` prop.
- `marginLeft`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Left margin. Cannot be combined with any \`bleed\*\` prop.
- `ml`
  - type: `ResponsiveValue<0 | (string & {}) | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
  - description: Shorthand for \`marginLeft\`. Cannot be combined with any \`bleed\*\` prop.
- `as`
  - type: `React.ElementType<any, keyof React.JSX.IntrinsicElements> | undefined`
- `asChild`
  - type: `boolean | undefined`
- `hideFrom`
  - type: `BreakpointThreshold | undefined`

## Examples \[#examples]

### Gradient \[#gradient]

```tsx
import { Box, VStack } from "@seed-design/react";

export default function BoxGradient() {
  return (
    <VStack gap="x2">
      <Box
        backgroundGradient="highlightMagic"
        backgroundGradientDirection="43deg"
        borderRadius="r2"
        color="palette.staticWhite"
        px="x3"
        py="x2"
      >
        Box Gradient
      </Box>
      <Box
        backgroundGradient="highlightMagic"
        backgroundGradientDirection="to bottom"
        borderRadius="r2"
        color="palette.staticWhite"
        px="x3"
        py="x2"
      >
        Box Gradient
      </Box>
    </VStack>
  );
}
```

## Responsive Design \[#responsive-design]

<Card title="Responsive Design" href="/react/components/concepts/responsive-design">
  Box의 레이아웃 프로퍼티에 반응형 값을 전달하여 viewport 크기에 따라 스타일을 조정할 수 있습니다.
</Card>