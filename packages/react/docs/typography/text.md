file: components/(foundation)/typography/text.mdx

# Text

텍스트를 표시하는 기본 타이포그래피 컴포넌트입니다. 일관된 글꼴 스타일과 크기를 적용하여 텍스트를 렌더링할 때 사용됩니다.

## Preview

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextPreview() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" textStyle="t1Regular">
        t1Regular
      </Text>
      <Text color="fg.neutral" textStyle="t2Regular">
        t2Regular
      </Text>
      <Text color="fg.neutral" textStyle="t3Regular">
        t3Regular
      </Text>
      <Text color="fg.neutral" textStyle="t4Regular">
        t4Regular
      </Text>
      <Text color="fg.neutral" textStyle="t5Regular">
        t5Regular
      </Text>
      <Text color="fg.neutral" textStyle="t6Bold">
        t6Bold
      </Text>
      <Text color="fg.neutral" textStyle="t7Bold">
        t7Bold
      </Text>
      <Text color="fg.neutral" textStyle="t8Bold">
        t8Bold
      </Text>
      <Text color="fg.neutral" textStyle="t9Bold">
        t9Bold
      </Text>
      <Text color="fg.neutral" textStyle="t10Bold">
        t10Bold
      </Text>
      <Text color="fg.neutral" textStyle="t11Bold">
        t11Bold
      </Text>
      <Text color="fg.neutral" textStyle="t12Bold">
        t12Bold
      </Text>
      <Text color="fg.neutral" textStyle="t13Bold">
        t13Bold
      </Text>
      <Text color="fg.neutral" textStyle="t14Bold">
        t14Bold
      </Text>
    </Flex>
  );
}
```

## Usage \[#usage]

```tsx
import { Text } from "@seed-design/react";
```

```tsx
<Text />
```

## Props \[#props]

- `as`
  - type: `"dt" | "dd" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "legend" | undefined`
  - default: `"span"`
  - description: The element to render as
- `color`
  - type: `ScopedColorFg | ScopedColorPalette | (string & {}) | undefined`
  - description: The color of the text.
- `fontSize`
  - type: `(string & {}) | "t1" | "t2" | "t3" | "t4" | "t5" | "t6" | "t7" | "t8" | "t9" | "t10" | "t11" | "t12" | "t13" | "t14" | "t1Static" | "t2Static" | "t3Static" | "t4Static" | "t5Static" | "t6Static" | "t7Static" | "t8Static" | "t9Static" | "t10Static" | "t11Static" | "t12Static" | "t13Static" | "t14Static" | undefined`
  - description: The font size of the text. Partially overrides the textStyle.
- `lineHeight`
  - type: `(string & {}) | "t1" | "t2" | "t3" | "t4" | "t5" | "t6" | "t7" | "t8" | "t9" | "t10" | "t11" | "t12" | "t13" | "t14" | "t1Static" | "t2Static" | "t3Static" | "t4Static" | "t5Static" | "t6Static" | "t7Static" | "t8Static" | "t9Static" | "t10Static" | "t11Static" | "t12Static" | "t13Static" | "t14Static" | undefined`
  - description: The line height of the text. Partially overrides the textStyle.
- `fontWeight`
  - type: `"regular" | "medium" | "bold" | undefined`
  - description: The font weight of the text. Partially overrides the textStyle.
- `maxLines`
  - type: `number | undefined`
  - description: The maximum number of lines to display. If the text overflows, it will be truncated.
- `align`
  - type: `"center" | "left" | "right" | undefined`
  - description: The alignment of the text.
- `userSelect`
  - type: `"auto" | "none" | "text" | undefined`
  - description: The user-select behavior of the text.
- `whiteSpace`
  - type: `"break-spaces" | "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap" | undefined`
  - description: The white-space behavior of the text.
- `textStyle`
  - type: `"screenTitle" | "articleBody" | "articleNote" | "t1Regular" | "t1Medium" | "t1Bold" | "t2Regular" | "t2Medium" | "t2Bold" | "t3Regular" | "t3Medium" | "t3Bold" | "t4Regular" | "t4Medium" | "t4Bold" | "t5Regular" | "t5Medium" | "t5Bold" | "t6Regular" | "t6Medium" | "t6Bold" | "t7Regular" | "t7Medium" | "t7Bold" | "t8Regular" | "t8Medium" | "t8Bold" | "t9Regular" | "t9Medium" | "t9Bold" | "t10Regular" | "t10Medium" | "t10Bold" | "t11Regular" | "t11Medium" | "t11Bold" | "t12Regular" | "t12Medium" | "t12Bold" | "t13Regular" | "t13Medium" | "t13Bold" | "t14Regular" | "t14Medium" | "t14Bold" | "t1StaticRegular" | "t1StaticMedium" | "t1StaticBold" | "t2StaticRegular" | "t2StaticMedium" | "t2StaticBold" | "t3StaticRegular" | "t3StaticMedium" | "t3StaticBold" | "t4StaticRegular" | "t4StaticMedium" | "t4StaticBold" | "t5StaticRegular" | "t5StaticMedium" | "t5StaticBold" | "t6StaticRegular" | "t6StaticMedium" | "t6StaticBold" | "t7StaticRegular" | "t7StaticMedium" | "t7StaticBold" | "t8StaticRegular" | "t8StaticMedium" | "t8StaticBold" | "t9StaticRegular" | "t9StaticMedium" | "t9StaticBold" | "t10StaticRegular" | "t10StaticMedium" | "t10StaticBold" | "t11StaticRegular" | "t11StaticMedium" | "t11StaticBold" | "t12StaticRegular" | "t12StaticMedium" | "t12StaticBold" | "t13StaticRegular" | "t13StaticMedium" | "t13StaticBold" | "t14StaticRegular" | "t14StaticMedium" | "t14StaticBold" | undefined`
  - default: `"t5Regular"`
  - description: - \`screenTitle\`: 화면에 크게 표시되는 주요 제목이나 타이틀에 사용합니다. - \`articleBody\`: 게시물이나 콘텐츠 중심 섹션의 본문 텍스트에 사용합니다. - \`articleNote\`: 주석, 참고 사항 및 상세 리스트 등 부가 정보에 사용하며, 일반 본문 텍스트에는 사용하지 않습니다. - \`t11Regular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t11Medium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t11Bold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t12Regular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t12Medium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t12Bold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t13Regular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t13Medium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t13Bold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t14Regular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t14Medium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t14Bold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. - \`t1StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t1StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t1StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t2StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t2StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t2StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t3StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t3StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t3StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t4StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t4StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t4StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t5StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t5StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t5StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t6StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t6StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t6StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t7StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t7StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t7StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t8StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t8StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t8StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t9StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t9StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t9StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t10StaticRegular\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t10StaticMedium\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t10StaticBold\`: 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t11StaticRegular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t11StaticMedium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t11StaticBold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t12StaticRegular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t12StaticMedium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t12StaticBold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t13StaticRegular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t13StaticMedium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t13StaticBold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t14StaticRegular\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t14StaticMedium\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다. - \`t14StaticBold\`: \`sm\` breakpoint 이상에서만 사용하는 것을 권장합니다. 폰트 스케일링에 반응하지 않도록 static text size와 static line height 토큰을 사용합니다.
- `textDecorationLine`
  - type: `"none" | "line-through" | "underline" | undefined`
  - default: `"none"`

## Examples \[#examples]

### Text Styles \[#text-styles]

Figma의 Text Style과 대응되는 `textStyle` 속성을 사용하는 것이 기본 방법입니다. `textStyle`은 글꼴 크기, 줄 간격, 글꼴 굵기를 한 번에 설정합니다.

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextTextStyles() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" textStyle="t1Regular">
        t1Regular
      </Text>
      <Text color="fg.neutral" textStyle="t2Regular">
        t2Regular
      </Text>
      <Text color="fg.neutral" textStyle="t3Regular">
        t3Regular
      </Text>
      <Text color="fg.neutral" textStyle="t4Regular">
        t4Regular
      </Text>
      <Text color="fg.neutral" textStyle="t5Regular">
        t5Regular
      </Text>
      <Text color="fg.neutral" textStyle="t6Bold">
        t6Bold
      </Text>
      <Text color="fg.neutral" textStyle="t7Bold">
        t7Bold
      </Text>
      <Text color="fg.neutral" textStyle="t8Bold">
        t8Bold
      </Text>
      <Text color="fg.neutral" textStyle="t9Bold">
        t9Bold
      </Text>
      <Text color="fg.neutral" textStyle="t10Bold">
        t10Bold
      </Text>
    </Flex>
  );
}
```

#### Font Sizes \[#font-sizes]

더 구체적으로 변경이 필요한 경우 `fontSize` 및 `lineHeight` 속성을 각각 사용할 수 있습니다.

`lineHeight` 속성은 `fontSize`에 대응되는 기본값으로 설정되며, `lineHeight` 속성으로 변경이 가능합니다.

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextFontSizes() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t1">
        t1
      </Text>
      <Text color="fg.neutral" fontSize="t2">
        t2
      </Text>
      <Text color="fg.neutral" fontSize="t3">
        t3
      </Text>
      <Text color="fg.neutral" fontSize="t4">
        t4
      </Text>
      <Text color="fg.neutral" fontSize="t5">
        t5
      </Text>
      <Text color="fg.neutral" fontSize="t6">
        t6
      </Text>
      <Text color="fg.neutral" fontSize="t7">
        t7
      </Text>
      <Text color="fg.neutral" fontSize="t8">
        t8
      </Text>
      <Text color="fg.neutral" fontSize="t9">
        t9
      </Text>
      <Text color="fg.neutral" fontSize="t10">
        t10
      </Text>
    </Flex>
  );
}
```

#### Font Weights \[#font-weights]

더 구체적으로 변경이 필요한 경우 `fontWeight` 속성을 사용할 수 있습니다.

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextFontWeights() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" fontWeight="regular">
        regular
      </Text>
      <Text color="fg.neutral" fontSize="t5" fontWeight="medium">
        medium
      </Text>
      <Text color="fg.neutral" fontSize="t5" fontWeight="bold">
        bold
      </Text>
    </Flex>
  );
}
```

### Text Decoration Lines \[#text-decoration-lines]

`textDecorationLine` 속성을 사용하여 텍스트에 밑줄 또는 취소선을 추가할 수 있습니다.

<Callout type="warning" title="&#x22;textDecorationLine=\&#x22;underline\&#x22;을 사용하기 전 읽어보기&#x22;">
  - 링크가 아닌 텍스트를 강조하기 위해 밑줄을 적용할 때는 사용자 경험을 고려해야 합니다. 밑줄이 있는 텍스트는 링크로 인식될 수 있으므로, 혼동을 피하기 위해 적절한 상황에서만 사용해야 합니다.
  - 본문 밖 영역에서 인라인 텍스트를 링크 용도로 사용하고자 하는 경우 [ActionButton](/react/components/action-button)을 `variant="ghost" bleedX="asPadding" bleedY="asPadding"` 옵션으로 사용하는 것을 고려해보세요.
</Callout>

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextTextDecorationLines() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" textDecorationLine="underline">
        underline
      </Text>
      <Text color="fg.neutral" fontSize="t5" textDecorationLine="line-through">
        line-through
      </Text>
    </Flex>
  );
}
```

### Max Lines \[#max-lines]

`maxLines` 속성을 사용하여 텍스트가 차지하는 최대 줄 수를 제한할 수 있습니다. 지정된 줄 수를 초과하는 텍스트는 생략 부호(ellipsis) `…` 로 표시됩니다.

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextMaxLines() {
  return (
    <Flex direction="column" gap="x2" width="full">
      <Text color="fg.neutral" fontSize="t5" maxLines={1}>
        maxLines=1 Aliquip pariatur adipisicing elit consectetur velit commodo Lorem nulla eu.
        Occaecat sint voluptate ut dolore eiusmod minim qui reprehenderit. Do aliquip tempor ipsum
        aliqua enim. Incididunt irure do ullamco esse sit enim mollit nisi anim laboris do. Ut
        fugiat aliquip velit eiusmod ad incididunt. Consequat qui quis in ad culpa officia eu in
        Lorem. Elit voluptate est veniam aliqua magna Lorem proident incididunt amet aliquip.
        Aliquip sint sit ex eiusmod sint. Eiusmod incididunt consequat fugiat.
      </Text>
      <Text color="fg.neutral" fontSize="t5" maxLines={2}>
        maxLines=2 Aliquip pariatur adipisicing elit consectetur velit commodo Lorem nulla eu.
        Occaecat sint voluptate ut dolore eiusmod minim qui reprehenderit. Do aliquip tempor ipsum
        aliqua enim. Incididunt irure do ullamco esse sit enim mollit nisi anim laboris do. Ut
        fugiat aliquip velit eiusmod ad incididunt. Consequat qui quis in ad culpa officia eu in
        Lorem. Elit voluptate est veniam aliqua magna Lorem proident incididunt amet aliquip.
        Aliquip sint sit ex eiusmod sint. Eiusmod incididunt consequat fugiat.
      </Text>
      <Text color="fg.neutral" fontSize="t5" maxLines={3}>
        maxLines=3 Aliquip pariatur adipisicing elit consectetur velit commodo Lorem nulla eu.
        Occaecat sint voluptate ut dolore eiusmod minim qui reprehenderit. Do aliquip tempor ipsum
        aliqua enim. Incididunt irure do ullamco esse sit enim mollit nisi anim laboris do. Ut
        fugiat aliquip velit eiusmod ad incididunt. Consequat qui quis in ad culpa officia eu in
        Lorem. Elit voluptate est veniam aliqua magna Lorem proident incididunt amet aliquip.
        Aliquip sint sit ex eiusmod sint. Eiusmod incididunt consequat fugiat.
      </Text>
    </Flex>
  );
}
```

### User Select \[#user-select]

`userSelect` 속성을 사용하여 사용자가 텍스트를 선택할 수 있는지 여부를 제어할 수 있습니다.

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextUserSelect() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" userSelect="auto">
        auto
      </Text>
      <Text color="fg.neutral" fontSize="t5" userSelect="none">
        none
      </Text>
      <Text color="fg.neutral" fontSize="t5" userSelect="text">
        text
      </Text>
    </Flex>
  );
}
```

### Static \[#static]

폰트 스케일링에 반응하지 않는 static 토큰을 활용하는 텍스트 스타일을 적용할 수 있습니다.

```tsx
import { Flex, Text } from "@seed-design/react";

export default function TextStatic() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" textStyle="t1StaticRegular">
        t1StaticRegular
      </Text>
      <Text color="fg.neutral" textStyle="t2StaticRegular">
        t2StaticRegular
      </Text>
      <Text color="fg.neutral" textStyle="t3StaticRegular">
        t3StaticRegular
      </Text>
      <Text color="fg.neutral" textStyle="t4StaticRegular">
        t4StaticRegular
      </Text>
      <Text color="fg.neutral" textStyle="t5StaticRegular">
        t5StaticRegular
      </Text>
      <Text color="fg.neutral" textStyle="t6StaticBold">
        t6StaticBold
      </Text>
      <Text color="fg.neutral" textStyle="t7StaticBold">
        t7StaticBold
      </Text>
      <Text color="fg.neutral" textStyle="t8StaticBold">
        t8StaticBold
      </Text>
      <Text color="fg.neutral" textStyle="t9StaticBold">
        t9StaticBold
      </Text>
      <Text color="fg.neutral" textStyle="t10StaticBold">
        t10StaticBold
      </Text>
    </Flex>
  );
}
```

### White Space \[#white-space]

<Callout type="warning">
  `whiteSpace` prop은 `maxLines` prop을 사용하지 않을 때만 적용됩니다.
</Callout>

```tsx
import { Box, Text, VStack } from "@seed-design/react";

const sampleText = `이것은 여러 개         의
공백, 줄바꿈과
    들여쓰기를 포함한 샘플 텍스트입니다.          각각의 white-space 속성\n값이 어떻게 작동하는지 보여줍니다.`;

export default function TextWhiteSpace() {
  return (
    <VStack gap="x4" width="full">
      {(["normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"] as const).map(
        (value) => (
          <VStack gap="x2" key={value}>
            <Text textStyle="t4Bold">{value}</Text>
            <Box width="full" padding="x4" borderRadius="r2" bg="bg.neutralWeak" overflowX="auto">
              <Text whiteSpace={value}>{sampleText}</Text>
            </Box>
          </VStack>
        ),
      )}
    </VStack>
  );
}
```