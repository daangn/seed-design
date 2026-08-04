file: components/dialog.mdx

# Dialog

화면 중앙에 떠서 사용자의 주의를 모으는 다이얼로그입니다. 제목, 본문, 푸터와 닫기 버튼을 갖추어 폼이나 스크롤되는 콘텐츠 등 풍부한 내용을 담을 때 사용합니다.

사용 가능 버전: @seed-design/react@2.1.0, @seed-design/css@2.3.0

## Preview

```tsx
import { HStack, Text } from "@seed-design/react";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { ActionButton } from "seed-design/ui/action-button";

const DialogPreview = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open Dialog</ActionButton>
      </DialogTrigger>
      <DialogContent title="제목" description="설명을 작성할 수 있어요">
        <DialogBody>
          <Text textStyle="articleBody">
            본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.
          </Text>
        </DialogBody>
        <DialogFooter>
          <HStack gap="x2" justify="flex-end">
            <DialogAction variant="neutralWeak">취소</DialogAction>
            <DialogAction variant="neutralSolid">확인</DialogAction>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogPreview;
```

<Card title="Alert Dialog" href="/react/components/alert-dialog" variant="example">
  사용자의 확인이나 경고가 목적이라면 Alert Dialog를 사용하세요.
</Card>

## Installation \[#installation]

### Default \[#default]

화면 중앙에 떠서 제목, 본문, 푸터를 담는 기본 Dialog 컴포넌트를 포함합니다.

- npm: npx @seed-design/cli@latest add ui:dialog
- pnpm: pnpm dlx @seed-design/cli@latest add ui:dialog
- yarn: yarn dlx @seed-design/cli@latest add ui:dialog
- bun: bun x @seed-design/cli@latest add ui:dialog

<ManualInstallation name="dialog" />

### Responsive \[#responsive]

뷰포트에 따라 Bottom Sheet로 자동 전환되는 반응형 변형입니다.

- npm: npx @seed-design/cli@latest add ui:responsive-dialog
- pnpm: pnpm dlx @seed-design/cli@latest add ui:responsive-dialog
- yarn: yarn dlx @seed-design/cli@latest add ui:responsive-dialog
- bun: bun x @seed-design/cli@latest add ui:responsive-dialog

<ManualInstallation name="responsive-dialog" />

## Props \[#props]

### `DialogRoot` \[#dialogroot]

- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to close the dialog when the outside is clicked
- `lazyMount`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to enable lazy mounting
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to unmount on exit.
- `size`
  - type: `"medium" | "large" | undefined`
  - default: `"medium"`
- `children`
  - type: `React.ReactNode`
  - required: `true`
- `modal`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether the dialog should behave as a modal overlay. When true, focus is trapped, background content is hidden from assistive technology, and \`aria-modal\` is set. Set to \`false\` to temporarily suspend modal behavior (e.g., when a Stackflow Activity is pushed on top of a mounted dialog).
- `closeOnEscape`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the dialog when the escape key is pressed
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onOpenChange`
  - type: `((open: boolean, details?: DialogChangeDetails) => void) | undefined`

### `DialogTrigger` \[#dialogtrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `DialogContent` \[#dialogcontent]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `showCloseButton`
  - type: `boolean | undefined`
  - default: `true`
- `width`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `maxWidth`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `DialogBody` \[#dialogbody]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `paddingX`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText"> | undefined`
- `minHeight`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `maxHeight`
  - type: `ResponsiveValue<(string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "full"> | undefined`
- `justifyContent`
  - type: `"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | undefined`
- `alignItems`
  - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`

### `DialogFooter` \[#dialogfooter]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `DialogAction` \[#dialogaction]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `color`
  - type: `ScopedColorFg | ScopedColorPalette | undefined`
  - default: `"fg.neutral"`
  - description: Color of the label and icons inside the button. Works only when \`variant\` is \`ghost\`.
- `fontWeight`
  - type: `"medium" | "bold" | "regular" | undefined`
  - default: `"bold"`
  - description: Weight of the label. Works only when \`variant\` is \`ghost\`.
- `variant`
  - type: `"brandSolid" | "neutralSolid" | "neutralWeak" | "criticalSolid" | "brandOutline" | "neutralOutline" | "ghost" | undefined`
  - default: `"brandSolid"`
  - description: - \`brandSolid\`: 브랜드의 핵심 가치를 전달하며, 사용자 간 연결이 일어나는 서비스의 주요 기능에 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다. - \`neutralSolid\`: 대부분의 화면에서 CTA로 사용합니다. 한 화면에 하나만 사용하는 것을 권장합니다. - \`neutralWeak\`: CTA를 제외한 대부분의 액션에 사용됩니다. - \`criticalSolid\`: 삭제나 초기화처럼 되돌릴 수 없는 중요한 작업에 사용합니다. - \`brandOutline\`: variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=neutralOutline과 조합하여 사용하는 것을 권장합니다. - \`neutralOutline\`: variant=brandSolid, neutralSolid, criticalSolid와 함께 사용할 수 없으며, variant=brandOutline과 조합하여 사용하는 것을 권장합니다. - \`ghost\`: 배경 없이 텍스트와 아이콘만 표시됩니다. 모두 동일한 색상을 사용하는 조건에서 icon, prefix icon, suffix icon, label에 정의된 color를 변경할 수 있으며, label의 fontWeight를 \`$font-weight.regular\` 또는 \`$font-weight.medium\`으로 변경하여 주목도를 조절할 수 있습니다.
- `size`
  - type: `"medium" | "large" | "small" | "xsmall" | undefined`
  - default: `"medium"`
  - description: - \`xsmall\`: 작은 공간에서 효율적으로 사용할 수 있는 Pill 형태로 제공됩니다. - \`small\`: 화면 중앙에서 범용적으로 사용됩니다. - \`medium\`: 화면 중앙에서 범용적으로 사용됩니다. - \`large\`: 주로 CTA 역할로 사용됩니다.
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`
  - description: - \`withText\`: 텍스트와 함께 아이콘을 표시할 수 있습니다. - \`iconOnly\`: 아이콘만으로 의미를 전달하기 때문에 접근성이 떨어집니다. 꼭 필요한 경우에만 접근성 레이블과 함께 사용하는 것을 권장합니다.
- `loading`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼에 등록된 비동기 작업이 진행 중임을 사용자에게 알립니다.
- `bleed`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative margin on all four sides to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedX`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative x-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `bleedY`
  - type: `ResponsiveValue<0 | (string & {}) | Dimension | "spacingX.betweenChips" | "spacingX.globalGutter" | "spacingY.componentDefault" | "spacingY.navToTitle" | "spacingY.screenBottom" | "spacingY.betweenText" | "asPadding"> | undefined`
  - description: Negative y-axis margin to extend the element outside its parent. If set to "asPadding", it will use the padding value in the same direction. Cannot be combined with any \`margin\*\` prop.
- `flexGrow`
  - type: `true | 0 | 1 | (number & {}) | undefined`
  - description: If true, flex-grow will be set to \`1\`.

### `ResponsiveDialogRoot` \[#responsivedialogroot]

- `children`
  - type: `React.ReactNode`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onOpenChange`
  - type: `((open: boolean) => void) | undefined`
- `dialogBreakpoint`
  - type: `"sm" | "md" | "lg" | "xl" | undefined`
  - default: `"md"`
  - description: Breakpoint at and above which it renders as a Dialog; below it, a BottomSheet. Cannot be \`"base"\`, which would always be a Dialog.
- `dialogRootProps`
  - type: `Omit<ContentDialogRootProps, "children" | "open" | "defaultOpen" | "onOpenChange"> | undefined`
  - description: Props forwarded to the underlying ContentDialog root (at and above the breakpoint).
- `bottomSheetRootProps`
  - type: `Omit<BottomSheetRootProps, "children" | "open" | "defaultOpen" | "onOpenChange"> | undefined`
  - description: Props forwarded to the underlying BottomSheet root (below the breakpoint).

## Examples \[#examples]

### Trigger \[#trigger]

`<DialogTrigger>`는 `aria-haspopup="dialog"` 속성을 설정하고, Dialog의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

```tsx
import { HStack, Text } from "@seed-design/react";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { ActionButton } from "seed-design/ui/action-button";

const DialogTriggerExample = () => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </DialogTrigger>
      <DialogContent title="Trigger 패턴">
        <DialogBody>
          <Text textStyle="articleBody">Trigger를 클릭하면 현재 화면 위에 Dialog가 열립니다.</Text>
        </DialogBody>
        <DialogFooter>
          <HStack gap="x2" justify="flex-end">
            <DialogAction variant="neutralWeak">취소</DialogAction>
            <DialogAction variant="neutralSolid">확인</DialogAction>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogTriggerExample;
```

### Controlled \[#controlled]

Trigger 외의 방식으로 Dialog를 열고 닫을 수 있습니다. 이 경우 `open` prop을 사용하여 Dialog의 상태를 제어합니다.

```tsx
import { HStack, Text } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
} from "seed-design/ui/dialog";

const DialogControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={() => setOpen(true)}>
        열기
      </ActionButton>
      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogContent title="제목" description="설명을 작성할 수 있어요">
          <DialogBody>
            <Text textStyle="articleBody">
              Labore do culpa dolore irure nisi dolor dolor laboris veniam ipsum excepteur
              adipisicing laboris non quis. Velit ea ut minim. Magna dolore culpa velit incididunt
              consequat sint. Fugiat ad culpa labore dolore esse dolore ex aliquip duis aute aliquip
              ad velit et.
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default DialogControlled;
```

### Size \[#size]

`<DialogRoot>`에 `size` prop을 설정하여 Dialog의 너비를 변경할 수 있습니다. `"medium"` (480px, 기본값)과 `"large"` (800px)를 지원합니다.
`md` 미만 화면에서는 뷰포트 너비의 90%를 차지하고, `md` 이상에서 각 size의 최대 너비가 적용됩니다. content의 높이는 뷰포트의 80%로 제한됩니다.

`<DialogContent>`에 `width`, `maxWidth` prop을 전달하여 너비를 직접 제어할 수도 있습니다.
프리셋 size 대신 뷰포트 기반의 유동적인 너비가 필요할 때 사용합니다.
단일 값은 모든 breakpoint에 적용되므로, md 미만의 기본 너비(뷰포트의 90%)를 유지하려면 `width={{ md: "560px" }}`처럼 breakpoint 객체로 전달하세요.

```tsx
import { Flex, HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Slider } from "seed-design/ui/slider";

const DialogSize = () => {
  const [width, setWidth] = useState(90);
  const [maxWidth, setMaxWidth] = useState(640);

  return (
    <Flex gap="x3" wrap="wrap">
      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Medium (480px)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Medium Dialog">
          <DialogBody>
            <Text textStyle="articleBody">
              기본 너비로 상세 정보와 주요 액션을 함께 제공합니다.
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot size="large">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Large (800px)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Large Dialog">
          <DialogBody>
            <Text textStyle="articleBody">
              넓은 다이얼로그에서 더 많은 폼 필드나 상세 콘텐츠를 다룹니다.
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">Custom (조절 가능)</ActionButton>
        </DialogTrigger>
        <DialogContent title="Custom Size" width={`${width}vw`} maxWidth={`${maxWidth}px`}>
          <DialogBody>
            <VStack gap="x4">
              <Text textStyle="articleBody">
                뷰포트 너비에 따라 유동적으로 커지되 maxWidth로 최대 크기를 제한합니다.
              </Text>
              <Slider
                label="width (vw)"
                min={50}
                max={100}
                values={[width]}
                onValuesChange={(values) => setWidth(values[0])}
              />
              <Slider
                label="maxWidth (px)"
                min={320}
                max={800}
                values={[maxWidth]}
                onValuesChange={(values) => setMaxWidth(values[0])}
              />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};

export default DialogSize;
```

### Body \[#body]

`<DialogBody>`는 본문 영역을 스크롤 가능하게 만듭니다. 본문이 길어 스크롤되면 헤더 아래에 구분선이 나타나고, 하단은 서서히 사라지는 마스크가 적용됩니다.
Body가 뷰포트 높이를 넘겨 스크롤이 생길 때에만 하단 fade 마스크와 `padding-bottom`이 적용됩니다. 본문이 짧아 넘치지 않으면 마스크가 적용되지 않아 마지막 줄이 흐려지지 않습니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogBodyExample = () => {
  return (
    <VStack gap="x3" align="stretch">
      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralWeak">짧은 본문 (fade 없음)</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="짧은 본문"
          description="Body가 넘치지 않으면 하단 fade와 padding-bottom이 적용되지 않습니다"
        >
          <DialogBody>
            <Text textStyle="articleBody">
              내용이 짧아 스크롤이 없으면 하단 마스크가 적용되지 않아, 마지막 줄이 흐려지지
              않습니다.
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot size="medium">
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">긴 본문 (fade 적용)</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="긴 본문"
          description="Body가 넘쳐 스크롤되면 하단이 서서히 사라집니다"
        >
          <DialogBody>
            <VStack gap="x4" align="stretch">
              {Array.from({ length: 16 }, (_, index) => (
                <Text key={index} textStyle="articleBody">
                  {index + 1}. Body가 넘치면 하단에 fade 마스크와 padding-bottom이 적용되고,
                  스크롤하면 헤더 아래에 구분선이 나타납니다.
                </Text>
              ))}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </VStack>
  );
};

export default DialogBodyExample;
```

### Custom Body \[#custom-body]

`<DialogBody>`에 `paddingX`, `minHeight`, `maxHeight`, `justifyContent`, `alignItems` prop을 전달하여 본문 영역을 직접 제어할 수 있습니다.
기본 캡(뷰포트의 80%)보다 낮게 스크롤 높이를 제한하거나, 짧은 내용에서도 높이를 고정하거나, 가로 패딩을 제거해 콘텐츠를 가장자리까지 배치할 때 사용합니다.

```tsx
import { Box, Flex, HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogCustomBody = () => {
  return (
    <Flex gap="x3" wrap="wrap">
      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">maxHeight 200px</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="본문 최대 높이"
          description="본문(Body)의 스크롤 높이를 200px로 제한합니다"
        >
          <DialogBody maxHeight="200px">
            <VStack gap="x4" align="stretch">
              {Array.from({ length: 12 }, (_, index) => (
                <Text key={index} textStyle="articleBody">
                  {index + 1}. 본문이 200px을 넘으면 그 안에서 스크롤됩니다.
                </Text>
              ))}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">minHeight + 가운데 정렬</ActionButton>
        </DialogTrigger>
        <DialogContent title="빈 상태" description="짧은 내용에서도 높이를 고정합니다">
          <DialogBody minHeight="240px" justifyContent="center" alignItems="center">
            <Text textStyle="articleBody" color="fg.neutralMuted">
              아직 항목이 없습니다
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">추가</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">paddingX 0</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="Full Bleed"
          description="가로 패딩을 제거해 콘텐츠를 가장자리까지 배치합니다"
        >
          <DialogBody paddingX={0}>
            <Box bg="palette.gray200" paddingY="x8">
              <Text textStyle="articleBody">가장자리까지 닿는 영역입니다</Text>
            </Box>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};

export default DialogCustomBody;
```

### Show Close Button \[#show-close-button]

`<DialogContent>`에 `showCloseButton` prop을 전달하여 우측 상단 닫기 버튼을 표시할 수 있습니다.
기본 값은 `true`입니다.

```tsx
import { Flex, HStack, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogShowCloseButton = () => {
  return (
    <Flex gap="x3">
      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 있음</ActionButton>
        </DialogTrigger>
        <DialogContent title="닫기 버튼" showCloseButton>
          <DialogBody>
            <Text textStyle="articleBody">기본적으로 우측 상단에 닫기 버튼이 표시됩니다.</Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot>
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
        </DialogTrigger>
        <DialogContent title="닫기 버튼 없음" showCloseButton={false}>
          <DialogBody>
            <Text textStyle="articleBody">
              닫기 버튼을 숨길 때는 본문이나 푸터에 닫을 수 있는 액션을 제공하세요.
            </Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Flex>
  );
};

export default DialogShowCloseButton;
```

### Footer Layout \[#footer-layout]

`DialogFooter`는 flex 레이아웃만 제공하며, 버튼 배치는 `VStack`, `HStack` 등으로 직접 구성합니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogFooterLayout = () => {
  return (
    <DialogRoot size="medium">
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">Footer 레이아웃</ActionButton>
      </DialogTrigger>
      <DialogContent
        title="Footer 레이아웃"
        description="버튼 배치는 VStack, HStack 등으로 직접 구성합니다."
      >
        <DialogBody>
          <VStack gap="x3" align="stretch">
            <Text textStyle="articleBody">DialogFooter는 flex 레이아웃만 제공합니다.</Text>
            <Text textStyle="articleBody">
              넓은 다이얼로그에서는 주요 액션을 우측에 가로로 정렬할 수 있습니다.
            </Text>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <HStack gap="x2" justify="flex-end">
            <DialogAction variant="neutralWeak">취소</DialogAction>
            <DialogAction variant="neutralSolid">확인</DialogAction>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogFooterLayout;
```

### Prevent Close \[#prevent-close]

`DialogAction`의 `onClick`에서 `e.preventDefault()`를 호출하면 다이얼로그가 닫히지 않습니다.

```tsx
import { HStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

const DialogPreventClose = () => {
  const [preventClose, setPreventClose] = useState(true);

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </DialogTrigger>
      <DialogContent
        title="닫기 방지"
        description="확인 버튼을 눌러도 Dialog가 닫히지 않도록 설정할 수 있습니다."
      >
        <DialogBody alignItems="flex-start">
          <Switch
            size="16"
            tone="neutral"
            label="preventDefault 사용"
            checked={preventClose}
            onCheckedChange={setPreventClose}
          />
        </DialogBody>
        <DialogFooter>
          <HStack gap="x2" justify="flex-end">
            <DialogAction variant="neutralWeak">취소</DialogAction>
            <DialogAction
              variant="neutralSolid"
              onClick={(e) => {
                if (preventClose) {
                  e.preventDefault();
                }
              }}
            >
              확인
            </DialogAction>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default DialogPreventClose;
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `DialogTrigger`로 열림

**닫힐 때** (`open: false`)

- `"closeButton"`: `DialogAction` 또는 우측 상단 닫기 버튼으로 닫힘
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭
  - `DialogRoot`는 기본적으로 `closeOnInteractOutside={false}`입니다. `interactOutside`는 이 옵션을 `true`로 설정한 경우에만 발생할 수 있습니다.
- `"cascadeDismiss"`: 상위 레이어 닫힘으로 인한 연쇄 닫힘

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

const DialogOnOpenChangeReason = () => {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);
  const [closeOnInteractOutside, setCloseOnInteractOutside] = useState(false);

  return (
    <VStack gap="x4" align="center">
      <DialogRoot
        open={open}
        closeOnInteractOutside={closeOnInteractOutside}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </DialogTrigger>
        <DialogContent title="onOpenChange 이유">
          <DialogBody>
            <VStack gap="x3" align="flex-start">
              <Text textStyle="articleBody">
                ESC 키를 누르거나 우측 상단 닫기 버튼, 하단 버튼을 눌러 닫아보세요. 아래 스위치를 켠
                뒤 바깥 영역을 누르면 interactOutside 이유로 닫힙니다.
              </Text>
              <Switch
                tone="neutral"
                size="16"
                label="closeOnInteractOutside"
                checked={closeOnInteractOutside}
                onCheckedChange={setCloseOnInteractOutside}
              />
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <HStack gap="x4">
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 열림 이유: {openReason ?? "-"}
        </Text>
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 닫힘 이유: {closeReason ?? "-"}
        </Text>
      </HStack>
    </VStack>
  );
};

export default DialogOnOpenChangeReason;
```

#### Confirm Before Close \[#confirm-before-close]

작성 중인 내용을 실수로 닫는 것을 막고 싶다면, `open`을 제어 상태로 두고 특정 `reason`일 때 `open`을 유지한 채 확인용 Alert Dialog를 띄워 사용자에게 되물을 수 있습니다.

```tsx
import { HStack, ResponsivePair, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
} from "seed-design/ui/alert-dialog";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
  type DialogRootProps,
} from "seed-design/ui/dialog";
import { Switch } from "seed-design/ui/switch";

const closeReasons = [
  "closeButton",
  "escapeKeyDown",
  "interactOutside",
] as const satisfies NonNullable<
  Parameters<NonNullable<DialogRootProps["onOpenChange"]>>[1]
>["reason"][];

const confirmReasonLabels = {
  closeButton: "닫기 버튼으로 닫을 때 확인 (closeButton)",
  escapeKeyDown: "ESC 키로 닫을 때 확인 (escapeKeyDown)",
  interactOutside: "바깥 클릭으로 닫을 때 확인 (interactOutside)",
} as const satisfies Record<(typeof closeReasons)[number], string>;

const DialogConfirmBeforeClose = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [closeOnInteractOutside, setCloseOnInteractOutside] = useState(true);
  const [confirmReasons, setConfirmReasons] = useState<
    Record<(typeof closeReasons)[number], boolean>
  >({ closeButton: true, escapeKeyDown: true, interactOutside: true });

  return (
    <>
      <DialogRoot
        open={open}
        closeOnInteractOutside={closeOnInteractOutside}
        onOpenChange={(nextOpen, details) => {
          if (nextOpen) {
            setOpen(true);

            return;
          }

          const reason = closeReasons.find((reason) => reason === details?.reason);

          if (reason && confirmReasons[reason]) {
            setConfirmOpen(true);

            return;
          }

          setOpen(false);
        }}
      >
        <DialogTrigger asChild>
          <ActionButton variant="neutralSolid">작성 폼 열기</ActionButton>
        </DialogTrigger>
        <DialogContent
          title="글 작성"
          description="닫기 동작을 바꿔가며 확인 다이얼로그를 띄워보세요"
        >
          <DialogBody>
            <VStack align="flex-start" gap="x4">
              <Switch
                label="바깥 클릭으로 닫기 (closeOnInteractOutside)"
                tone="brand"
                size="16"
                checked={closeOnInteractOutside}
                onCheckedChange={setCloseOnInteractOutside}
              />
              <VStack align="flex-start" gap="x2">
                <Text fontSize="t3" color="fg.neutralMuted">
                  닫으려는 reason별로 확인 다이얼로그 띄우기
                </Text>
                {closeReasons.map((reason) => (
                  <Switch
                    key={reason}
                    label={confirmReasonLabels[reason]}
                    tone="neutral"
                    size="16"
                    checked={confirmReasons[reason]}
                    onCheckedChange={(checked) =>
                      setConfirmReasons((prev) => ({ ...prev, [reason]: checked }))
                    }
                  />
                ))}
              </VStack>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">저장</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <AlertDialogRoot open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 닫을까요?</AlertDialogTitle>
            <AlertDialogDescription>작성 중인 내용은 저장되지 않습니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ResponsivePair gap="x2">
              <AlertDialogAction variant="neutralWeak" onClick={() => setConfirmOpen(false)}>
                계속 작성
              </AlertDialogAction>
              <AlertDialogAction
                variant="criticalSolid"
                onClick={() => {
                  setConfirmOpen(false);
                  setOpen(false);
                }}
              >
                닫기
              </AlertDialogAction>
            </ResponsivePair>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </>
  );
};

export default DialogConfirmBeforeClose;
```

### Portalled \[#portalled]

Portal은 기본적으로 `document.body`에 렌더링됩니다.

```tsx
import { HStack, Portal, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  DialogAction,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";

const DialogPortalled = () => {
  return (
    // You can set z-index dialog with "--layer-index" custom property. useful for stackflow integration.
    <DialogRoot>
      <DialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </DialogTrigger>
      <Portal>
        <DialogContent title="Portal" layerIndex={50}>
          <DialogBody>
            <Text textStyle="articleBody">Portal은 기본적으로 document.body에 렌더링됩니다.</Text>
          </DialogBody>
          <DialogFooter>
            <HStack gap="x2" justify="flex-end">
              <DialogAction variant="neutralWeak">취소</DialogAction>
              <DialogAction variant="neutralSolid">확인</DialogAction>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default DialogPortalled;
```

### Responsive \[#responsive-1]

`ResponsiveDialog`를 사용하면 md 이상에서는 Dialog, sm 이하에서는 Bottom Sheet로 자동 전환됩니다. 뷰포트를 줄여서 전환 동작을 확인해보세요.
`onOpenChange`는 열림 상태만 전달하며, Dialog 또는 Bottom Sheet에만 적용되는 Root 옵션은 `dialogRootProps`, `bottomSheetRootProps`로 전달합니다.

```tsx
import { HStack, Text, useResponsiveDialogContext } from "@seed-design/react";
import { forwardRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveDialogAction,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogRoot,
  ResponsiveDialogTrigger,
  type ResponsiveDialogFooterProps,
} from "seed-design/ui/responsive-dialog";

const Footer = forwardRef<HTMLDivElement, ResponsiveDialogFooterProps>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return (
    <ResponsiveDialogFooter ref={ref} {...props}>
      <HStack gap="x2" justify="flex-end">
        <ResponsiveDialogAction
          variant="neutralWeak"
          flexGrow={shouldUseBottomSheet ? 1 : undefined}
        >
          취소
        </ResponsiveDialogAction>
        <ResponsiveDialogAction
          variant="neutralSolid"
          flexGrow={shouldUseBottomSheet ? 1 : undefined}
        >
          확인
        </ResponsiveDialogAction>
      </HStack>
    </ResponsiveDialogFooter>
  );
});

const DialogResponsive = () => {
  return (
    <ResponsiveDialogRoot>
      <ResponsiveDialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        title="반응형 다이얼로그"
        description="화면 크기에 따라 적합한 컴포넌트로 자동 전환됩니다."
      >
        <ResponsiveDialogBody>
          <Text textStyle="articleBody">
            md 이상에서는 화면 중앙의 Dialog로, sm 이하에서는 화면 하단에서 슬라이드되는 Bottom
            Sheet로 표시됩니다.
          </Text>
        </ResponsiveDialogBody>
        <Footer />
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  );
};

export default DialogResponsive;
```