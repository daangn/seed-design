file: components/(deprecated)/stack.mdx

# Stack

세로로 쌓이는 레이아웃을 구성합니다. 디자인 토큰을 JSX에서 사용할 수 있도록 도와줍니다.

<Callout type="warn">
  더 이상 사용되지 않습니다. [`VStack`](/react/components/layout/v-stack) 컴포넌트를 사용하세요.
</Callout>

## Preview

```tsx
import { Box, Stack } from "@seed-design/react";

/**
 * @deprecated Use `VStack` instead.
 */
export default function StackPreview() {
  return (
    <Stack bg="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        1
      </Box>
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        2
      </Box>
      <Box bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        3
      </Box>
    </Stack>
  );
}
```

## Usage \[#usage]

```tsx
import { Stack } from "@seed-design/react";
```

```tsx
<Stack />
```

## Props \[#props]

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
- `bleed`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedTop`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative top margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedRight`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative right margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedBottom`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative bottom margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedLeft`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative left margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `color`
  - type: `(string & {}) | ScopedColorFg | ScopedColorPalette | undefined`
- `display`
  - type: `ResponsiveValue<"none" | "flex"> | undefined`
  - default: `"flex"`
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
- `position`
  - type: `"fixed" | "relative" | "absolute" | "sticky" | undefined`
- `overflowX`
  - type: `"auto" | "hidden" | "visible" | "scroll" | undefined`
- `overflowY`
  - type: `"auto" | "hidden" | "visible" | "scroll" | undefined`
- `zIndex`
  - type: `number | (string & {}) | undefined`
- `flexGrow`
  - type: `true | 0 | 1 | (number & {}) | undefined`
  - description: If true, flex-grow will be set to \`1\`.
- `flexShrink`
  - type: `true | 0 | (number & {}) | undefined`
  - description: If true, flex-shrink will be set to \`1\`.
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
- `as`
  - type: `React.ElementType<any, keyof React.JSX.IntrinsicElements> | undefined`
- `asChild`
  - type: `boolean | undefined`
- `hideFrom`
  - type: `BreakpointThreshold | undefined`
- `direction`
  - type: `ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse"> | undefined`
  - description: Shorthand for \`flexDirection\`.
- `wrap`
  - type: `true | "wrap" | "wrap-reverse" | "nowrap" | undefined`
  - description: Shorthand for \`flexWrap\`.
- `align`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
  - description: Shorthand for \`alignItems\`.
- `justify`
  - type: `"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | undefined`
  - description: Shorthand for \`justifyContent\`.
- `grow`
  - type: `true | 0 | 1 | (number & {}) | undefined`
  - description: Shorthand for \`flexGrow\`.
- `shrink`
  - type: `true | 0 | (number & {}) | undefined`
  - description: Shorthand for \`flexShrink\`.