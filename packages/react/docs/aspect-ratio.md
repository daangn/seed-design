file: components/aspect-ratio.mdx

# Aspect Ratio

가로(width)가 정해지면 비율에 따라 세로(height)가 자동으로 결정되는 레이아웃 컨테이너입니다.

사용 가능 버전: @seed-design/react@1.2.0, @seed-design/css@1.2.0

## Preview

```tsx
import { AspectRatio, Text, VStack } from "@seed-design/react";

export default function AspectRatioPreview() {
  return (
    <VStack gap="x4">
      <AspectRatio ratio={4 / 3} width="160px" bg="palette.gray100">
        <Text color="palette.gray700">4 / 3</Text>
      </AspectRatio>
      <AspectRatio ratio={1} width="160px" bg="palette.gray100">
        <Text color="palette.gray700">1:1</Text>
      </AspectRatio>
      <AspectRatio ratio={16 / 9} width="160px" bg="palette.gray100">
        <Text color="palette.gray700">16 / 9</Text>
      </AspectRatio>
    </VStack>
  );
}
```

## Usage \[#usage]

```tsx
import { AspectRatio } from "@seed-design/react";
```

```tsx
<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." />
</AspectRatio>
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
  - type: `ResponsiveValue<"block" | "flex" | "grid" | "inline-flex" | "inline" | "inline-block" | "none"> | undefined`
- `position`
  - type: `"relative" | "absolute" | "fixed" | "sticky" | undefined`
  - default: `"relative"`
- `overflowX`
  - type: `"hidden" | "visible" | "scroll" | "auto" | undefined`
  - default: `"hidden"`
- `overflowY`
  - type: `"hidden" | "visible" | "scroll" | "auto" | undefined`
  - default: `"hidden"`
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
- `bleed`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedTop`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative top margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedRight`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative right margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedBottom`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative bottom margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedLeft`
  - type: `ResponsiveValue<0 | "asPadding" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Negative left margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `margin`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Margin on all four sides. Cannot be combined with any \`bleed\*\` prop.
- `m`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`margin\`. Cannot be combined with any \`bleed\*\` prop.
- `marginX`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Horizontal margin (left + right). Cannot be combined with any \`bleed\*\` prop.
- `mx`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`marginX\`. Cannot be combined with any \`bleed\*\` prop.
- `marginY`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Vertical margin (top + bottom). Cannot be combined with any \`bleed\*\` prop.
- `my`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`marginY\`. Cannot be combined with any \`bleed\*\` prop.
- `marginTop`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Top margin. Cannot be combined with any \`bleed\*\` prop.
- `mt`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`marginTop\`. Cannot be combined with any \`bleed\*\` prop.
- `marginRight`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Right margin. Cannot be combined with any \`bleed\*\` prop.
- `mr`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`marginRight\`. Cannot be combined with any \`bleed\*\` prop.
- `marginBottom`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Bottom margin. Cannot be combined with any \`bleed\*\` prop.
- `mb`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`marginBottom\`. Cannot be combined with any \`bleed\*\` prop.
- `marginLeft`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Left margin. Cannot be combined with any \`bleed\*\` prop.
- `ml`
  - type: `ResponsiveValue<0 | "auto" | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | (string & {})> | undefined`
  - description: Shorthand for \`marginLeft\`. Cannot be combined with any \`bleed\*\` prop.
- `as`
  - type: `React.ElementType<any, keyof React.JSX.IntrinsicElements> | undefined`
- `asChild`
  - type: `boolean | undefined`
- `hideFrom`
  - type: `BreakpointThreshold | undefined`
- `ratio`
  - type: `number | undefined`
  - default: `4 / 3`
  - description: The aspect ratio of the aspect ratio container (width / height).

## Examples \[#examples]

### Ratio \[#ratio]

다양한 비율을 지정할 수 있습니다. `1`은 정사각형, `4/3`은 일반적인 사진 비율, `16/9`는 와이드스크린 비율입니다.

```tsx
import { AspectRatio, Box, HStack } from "@seed-design/react";

export default function AspectRatioRatio() {
  return (
    <HStack gap="x4">
      <Box width="150px">
        <AspectRatio ratio={1}>
          <img src="https://picsum.photos/seed/square/400/400" alt="1:1 Square" />
        </AspectRatio>
      </Box>
      <Box width="150px">
        <AspectRatio ratio={4 / 3}>
          <img src="https://picsum.photos/seed/4-3/400/300" alt="4:3" />
        </AspectRatio>
      </Box>
      <Box width="150px">
        <AspectRatio ratio={16 / 9}>
          <img src="https://picsum.photos/seed/16-9/400/225" alt="16:9" />
        </AspectRatio>
      </Box>
    </HStack>
  );
}
```