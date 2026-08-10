file: components/image-frame.mdx

# Image Frame

사용자가 업로드한 이미지를 표시하기 위한 컴포넌트입니다.

사용 가능 버전: @seed-design/react@1.2.0, @seed-design/css@1.2.0

## Preview

```tsx
import { ImageFrame } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFramePreview() {
  return (
    <ImageFrame
      ratio={4 / 3}
      borderRadius="r2"
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape photograph by Tobias Tullius"
      width="300px"
      fallback={<ContentPlaceholder type="commerce" />}
    />
  );
}
```

## Usage \[#usage]

```tsx
import { ImageFrame } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";
```

```tsx
<ImageFrame
  ratio={4 / 3}
  borderRadius="r2"
  stroke
  src="..."
  alt="..."
  fallback={<ContentPlaceholder type="image" />}
/>
```

## Props \[#props]

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
- `position`
  - type: `"relative" | "absolute" | "fixed" | "sticky" | undefined`
  - default: `"relative"`
- `overflowX`
  - type: `"hidden" | "visible" | "scroll" | "auto" | undefined`
  - default: `"hidden"`
- `overflowY`
  - type: `"hidden" | "visible" | "scroll" | "auto" | undefined`
  - default: `"hidden"`
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
- `ratio`
  - type: `number | undefined`
  - default: `4 / 3`
  - description: The aspect ratio of the aspect ratio container (width / height).
- `stroke`
  - type: `boolean | undefined`
  - default: `false`
- `src`
  - type: `string`
  - required: `true`
- `alt`
  - type: `string`
  - required: `true`
- `fallback`
  - type: `React.ReactNode`
- `loading`
  - type: `"eager" | "lazy" | undefined`
- `decoding`
  - type: `"auto" | "async" | "sync" | undefined`
- `crossOrigin`
  - type: `"" | "anonymous" | "use-credentials" | undefined`
- `referrerPolicy`
  - type: `React.HTMLAttributeReferrerPolicy | undefined`
- `sizes`
  - type: `string | undefined`
- `srcSet`
  - type: `string | undefined`
- `children`
  - type: `React.ReactNode`

## Examples \[#examples]

### Ratio \[#ratio]

다양한 비율을 지정할 수 있습니다. `1`은 정사각형, `4/3`은 일반적인 사진 비율, `16/9`는 와이드스크린 비율입니다.

```tsx
import { ImageFrame, Flex, VStack, Text } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameRatio() {
  return (
    <Flex gap="x2" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="1:1"
          style={{ width: 120 }}
          fallback={<ContentPlaceholder type="buySell" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          1:1
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="4:3"
          style={{ width: 160 }}
          fallback={<ContentPlaceholder type="food" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          4:3
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={16 / 9}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="16:9"
          style={{ width: 200 }}
          fallback={<ContentPlaceholder type="realty" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          16:9
        </Text>
      </VStack>
    </Flex>
  );
}
```

### Border Radius \[#border-radius]

`borderRadius` prop으로 모서리 라운드 스타일을 적용할 수 있습니다. 기본값은 `"r2"`입니다.

```tsx
import { ImageFrame, Flex, VStack, Text } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameBorderRadius() {
  return (
    <VStack gap="x6" alignItems="flex-start">
      <Flex gap="x4" wrap="wrap" align="flex-end">
        <VStack gap="x2" alignItems="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1"
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
            alt="size 20 borderRadius=r1"
            style={{ width: 20 }}
            fallback={<ContentPlaceholder type="buySell" />}
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            20 / r1 (4px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1"
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
            alt="size 24 borderRadius r1"
            style={{ width: 24 }}
            fallback={<ContentPlaceholder type="car" />}
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            24 / r1 (4px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1_5"
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
            alt="size 36 borderRadius r1_5"
            style={{ width: 36 }}
            fallback={<ContentPlaceholder type="food" />}
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            36 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1_5"
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
            alt="size 42 borderRadius r1_5"
            style={{ width: 42 }}
            fallback={<ContentPlaceholder type="jobs" />}
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            42 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1_5"
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=120&dpr=2&q=80"
            alt="size 48 borderRadius r1_5"
            style={{ width: 48 }}
            fallback={<ContentPlaceholder type="realty" />}
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            48 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" alignItems="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r2"
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=160&dpr=2&q=80"
            alt="size 64 borderRadius r2"
            style={{ width: 64 }}
            fallback={<ContentPlaceholder type="commerce" />}
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            64+ / r2 (8px)
          </Text>
        </VStack>
      </Flex>
    </VStack>
  );
}
```

### Stroke \[#stroke]

`stroke` prop으로 테두리 스타일을 적용할 수 있습니다.

```tsx
import { ImageFrame, Flex, VStack, Text } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameStroke() {
  return (
    <Flex gap="x4" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          stroke={false}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="stroke=false"
          style={{ width: 150 }}
          fallback={<ContentPlaceholder type="post" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          stroke=false
        </Text>
      </VStack>
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={4 / 3}
          stroke={true}
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="stroke=true"
          style={{ width: 150 }}
          fallback={<ContentPlaceholder type="group" />}
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          stroke=true
        </Text>
      </VStack>
    </Flex>
  );
}
```

### Fallback Image \[#fallback-image]

`fallback` prop으로 이미지가 로드되지 않았을 때 보여질 요소를 지정할 수 있습니다. 주로 [ContentPlaceholder](/react/components/content-placeholder)를 사용합니다.

```tsx
import { ImageFrame, Flex } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameFallbackExample() {
  return (
    <Flex gap="x3" wrap="wrap" align="flex-end">
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="Fallback with buySell type"
        style={{ width: 120 }}
        fallback={<ContentPlaceholder type="buySell" />}
      />
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="Fallback with food type"
        style={{ width: 120 }}
        fallback={<ContentPlaceholder type="food" />}
      />
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://invalid-url"
        alt="Fallback with jobs type"
        style={{ width: 120 }}
        fallback={<ContentPlaceholder type="jobs" />}
      />
    </Flex>
  );
}
```

### Overlay \[#overlay]

`ImageFrameFloater`를 사용하여 이미지 위에 오버레이 요소를 배치할 수 있습니다. `ImageFrameBadge`, `ImageFrameIcon`, `ImageFrameIndicator`, `ImageFrameReactionButton` 등 다양한 오버레이 컴포넌트를 제공합니다.

```tsx
import { IconCarrotFill } from "@karrotmarket/react-monochrome-icon";
import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameBadge,
  ImageFrameIcon,
  ImageFrameIndicator,
  ImageFrameReactionButton,
  Flex,
  VStack,
  Text,
} from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";
import { useState } from "react";

export default function ImageFrameOverlayExample() {
  const [liked, setLiked] = useState(false);

  return (
    <Flex gap="x3" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with badge overlay"
          style={{ width: 120 }}
          fallback={<ContentPlaceholder type="buySell" />}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameBadge tone="brand" variant="solid">
              NEW
            </ImageFrameBadge>
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameBadge
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with icon overlay"
          style={{ width: 120 }}
          fallback={<ContentPlaceholder type="commerce" />}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIcon svg={<IconCarrotFill />} />
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameIcon
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with indicator overlay"
          style={{ width: 120 }}
          fallback={<ContentPlaceholder type="food" />}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIndicator>+9</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameIndicator
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with reaction button overlay"
          style={{ width: 120 }}
          fallback={<ContentPlaceholder type="car" />}
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameReactionButton
              pressed={liked}
              onPressedChange={setLiked}
              aria-label="좋아요"
            />
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameReactionButton
        </Text>
      </VStack>
    </Flex>
  );
}
```

#### Multiple Overlays \[#multiple-overlays]

여러 위치에 오버레이를 동시에 배치할 수 있습니다.

```tsx
import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameBadge,
  ImageFrameReactionButton,
} from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";
import { useState } from "react";

export default function ImageFrameOverlayMultipleExample() {
  const [liked, setLiked] = useState(false);

  return (
    <ImageFrame
      ratio={1}
      borderRadius="r2"
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape with multiple overlays"
      style={{ width: 200 }}
      fallback={<ContentPlaceholder type="coupon" />}
    >
      <ImageFrameFloater placement="top-start">
        <ImageFrameBadge tone="brand" variant="solid">
          NEW
        </ImageFrameBadge>
      </ImageFrameFloater>
      <ImageFrameFloater placement="bottom-end">
        <ImageFrameReactionButton pressed={liked} onPressedChange={setLiked} aria-label="좋아요" />
      </ImageFrameFloater>
    </ImageFrame>
  );
}
```

#### Custom Overlay \[#custom-overlay]

`ImageFrameFloater`는 모든 React 요소를 children으로 받을 수 있습니다. 미리 정의된 오버레이 컴포넌트 외에도 커스텀 UI를 배치할 수 있습니다.

```tsx
import { ImageFrame, ImageFrameFloater } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameOverlayCustomExample() {
  return (
    <ImageFrame
      ratio={1}
      borderRadius="r2"
      stroke
      src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
      alt="Landscape with custom overlay"
      style={{ width: 200 }}
      fallback={<ContentPlaceholder type="business" />}
    >
      <ImageFrameFloater placement="bottom-end">
        <div
          style={{
            padding: "4px 8px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 4,
            color: "white",
            fontSize: 12,
          }}
        >
          Custom Element
        </div>
      </ImageFrameFloater>
    </ImageFrame>
  );
}
```

#### Offset \[#offset]

`offsetX`, `offsetY` prop으로 오버레이의 여백을 조절할 수 있습니다. 기본값은 `6px`입니다.

```tsx
import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

export default function ImageFrameOverlayInsetExample() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with default offset"
        style={{ width: 150 }}
        fallback={<ContentPlaceholder type="jobs" />}
      >
        <ImageFrameFloater placement="bottom-end">
          <ImageFrameIndicator>default</ImageFrameIndicator>
        </ImageFrameFloater>
      </ImageFrame>

      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with 0 offset"
        style={{ width: 150 }}
        fallback={<ContentPlaceholder type="image" />}
      >
        <ImageFrameFloater placement="bottom-end" offsetX={0} offsetY={0}>
          <ImageFrameIndicator>offset=0</ImageFrameIndicator>
        </ImageFrameFloater>
      </ImageFrame>

      <ImageFrame
        ratio={1}
        borderRadius="r2"
        stroke
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
        alt="Landscape with 12 offset"
        style={{ width: 150 }}
        fallback={<ContentPlaceholder type="default" />}
      >
        <ImageFrameFloater placement="bottom-end" offsetX="12px" offsetY="12px">
          <ImageFrameIndicator>offset=12</ImageFrameIndicator>
        </ImageFrameFloater>
      </ImageFrame>
    </div>
  );
}
```