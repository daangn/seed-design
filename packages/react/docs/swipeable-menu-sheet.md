file: components/swipeable-menu-sheet.mdx

# Swipeable Menu Sheet

사용자의 작업과 관련된 선택지를 제공하는 시트 형태의 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetPreview = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent
        title="proident irure"
        description="Aliqua fugiat adipisicing magna dolor laborum."
        aria-label="Swipeable Menu Sheet"
      >
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetPreview;
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:swipeable-menu-sheet
- pnpm: pnpm dlx @seed-design/cli@latest add ui:swipeable-menu-sheet
- yarn: yarn dlx @seed-design/cli@latest add ui:swipeable-menu-sheet
- bun: bun x @seed-design/cli@latest add ui:swipeable-menu-sheet

<ManualInstallation name="swipeable-menu-sheet" />

## Props \[#props]

### `SwipeableMenuSheetRoot` \[#swipeablemenusheetroot]

- `skipAnimation`
  - type: `boolean | undefined`
  - default: `false`
- `children`
  - type: `React.ReactNode`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
  - default: `false`
  - description: Opened by default. Still reacts to \`open\` state changes
- `onOpenChange`
  - type: `((open: boolean, details?: DrawerChangeDetails) => void) | undefined`
- `closeOnEscape`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the drawer when pressing the escape key.
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the drawer when interacting outside of the drawer.
- `lazyMount`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to lazy mount the drawer content on first open.
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to unmount the drawer content on exit.
- `onAnimationEnd`
  - type: `((open: boolean) => void) | undefined`
  - description: Gets triggered after the open or close animation ends, it receives an \`open\` argument with the \`open\` state of the drawer by the time the function was triggered. Useful to revert any state changes for example.

### `SwipeableMenuSheetTrigger` \[#swipeablemenusheettrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SwipeableMenuSheetContent` \[#swipeablemenusheetcontent]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `showCloseButton`
  - type: `boolean | undefined`
  - default: `false`
- `labelAlign`
  - type: `"left" | "center" | undefined`
  - default: `"left"`
  - description: - \`left\`: 라벨을 왼쪽 정렬합니다. - \`center\`: 라벨을 중앙 정렬합니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SwipeableMenuSheetGroup` \[#swipeablemenusheetgroup]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `labelAlign`
  - type: `"left" | "center" | undefined`
  - default: `"left"`
  - description: - \`left\`: 라벨을 왼쪽 정렬합니다. - \`center\`: 라벨을 중앙 정렬합니다.

### `SwipeableMenuSheetItem` \[#swipeablemenusheetitem]

- `prefixIcon`
  - type: `React.ReactNode`
- `label`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `labelAlign`
  - type: `"left" | "center" | undefined`
  - default: `"left"`
  - description: - \`left\`: 라벨을 왼쪽 정렬합니다. - \`center\`: 라벨을 중앙 정렬합니다.
- `tone`
  - type: `"neutral" | "critical" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 일반적인 작업을 수행하는 기본 아이템입니다. - \`critical\`: 데이터 삭제와 같이 되돌릴 수 없는 작업을 수행하는 아이템입니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Trigger \[#trigger]

`<SwipeableMenuSheetTrigger>`는 `aria-haspopup="dialog"` 속성을 설정하고, SwipeableMenuSheet의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

`MenuSheet`과 달리, swipe-down 제스처로도 시트를 닫을 수 있어요. 시트 상단의 핸들이 드래그 affordance를 제공합니다. `SwipeableMenuSheetContent`의 `showCloseButton` prop으로 보이는 닫기 버튼을 표시할 수 있으며, 기본값(`false`)에서는 스크린 리더 사용자를 위해 시각적으로 숨겨진 닫기 버튼이 렌더링됩니다.

## Preview

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetPreview = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent
        title="proident irure"
        description="Aliqua fugiat adipisicing magna dolor laborum."
        aria-label="Swipeable Menu Sheet"
      >
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetPreview;
```

### Controlled \[#controlled]

Trigger 외의 방식으로 SwipeableMenuSheet를 열고 닫을 수 있습니다. 이 경우 `open` prop을 사용하여 SwipeableMenuSheet의 상태를 제어합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetControlled = () => {
  const [open, setOpen] = useState(false);

  const scheduleOpen = () => {
    setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  return (
    <>
      <ActionButton variant="neutralSolid" onClick={scheduleOpen}>
        1초 후 열기
      </ActionButton>
      <SwipeableMenuSheetRoot open={open} onOpenChange={setOpen}>
        <SwipeableMenuSheetContent title="메뉴" aria-label="Swipeable Menu Sheet">
          <SwipeableMenuSheetGroup>
            <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </SwipeableMenuSheetGroup>
        </SwipeableMenuSheetContent>
      </SwipeableMenuSheetRoot>
    </>
  );
};

export default SwipeableMenuSheetControlled;
```

### With Title \[#with-title]

`SwipeableMenuSheetContent`의 `title` prop을 사용하여 시트 헤더에 제목을 표시합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetWithTitle = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent title="Swipeable Menu Sheet">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <SwipeableMenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetWithTitle;
```

### With Title and Description \[#with-title-and-description]

`SwipeableMenuSheetContent`의 `description` prop을 사용하여 제목 아래에 부가 설명을 추가합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

export default function SwipeableMenuSheetWithTitleAndDescription() {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent
        title="Swipeable Menu Sheet"
        description="부가적인 설명이 여기에 표시됩니다."
      >
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <SwipeableMenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
}
```

### Close Button \[#close-button]

`SwipeableMenuSheetContent`의 `showCloseButton` prop으로 시트 하단에 보이는 닫기 버튼을 표시합니다. 기본값은 `false`이며, 이때는 스크린 리더 사용자를 위한 시각적으로 숨겨진 닫기 버튼이 렌더링됩니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetWithCloseButton = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent title="Swipeable Menu Sheet" showCloseButton>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetWithCloseButton;
```

### Label Align \[#label-align]

`SwipeableMenuSheetContent`의 `labelAlign` prop으로 메뉴 항목의 레이블 정렬을 설정합니다.

#### `labelAlign="left"` (with `PrefixIcon`) \[#labelalignleft-with-prefixicon]

레이블을 왼쪽 정렬합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetWithPrefixIcon = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetWithPrefixIcon;
```

#### `labelAlign="center"` (without `PrefixIcon`) \[#labelaligncenter-without-prefixicon]

레이블을 중앙 정렬합니다. (일반적으로, `prefixIcon` 없는 경우)

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetWithoutPrefixIcon = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet" labelAlign="center">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" />
          <SwipeableMenuSheetItem label="Action 2" />
          <SwipeableMenuSheetItem label="Action 3" />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" />
          <SwipeableMenuSheetItem label="Action 5" tone="critical" />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetWithoutPrefixIcon;
```

#### Overriding `labelAlign` \[#overriding-labelalign]

필요한 경우 `SwipeableMenuSheetContent`에 지정한 `labelAlign`을 `SwipeableMenuSheetGroup` 또는 `SwipeableMenuSheetItem`에 지정한 `labelAlign`으로 덮어쓸 수 있습니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetOverridingLabelAlign = () => {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet" labelAlign="center">
        <SwipeableMenuSheetGroup labelAlign="left">
          <SwipeableMenuSheetItem label="Action 1" />
          <SwipeableMenuSheetItem label="Action 2" labelAlign="center" />
          <SwipeableMenuSheetItem label="Action 3" />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" />
          <SwipeableMenuSheetItem label="Action 5" tone="critical" labelAlign="left" />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetOverridingLabelAlign;
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `SwipeableMenuSheetTrigger` (`SwipeableMenuSheet.Trigger`)로 열림

**닫힐 때** (`open: false`)

- `"closeButton"`: 닫기 버튼(`SwipeableMenuSheet.CloseButton`)이 활성화되어 닫힘 (`showCloseButton`이 `false`인 경우 시각적으로 숨겨진 버튼이며, 주로 스크린 리더 사용자)
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭
- `"drag"`: swipe 제스처로 닫힘

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

export default function SwipeableMenuSheetOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <SwipeableMenuSheetRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <SwipeableMenuSheetTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </SwipeableMenuSheetTrigger>
        <SwipeableMenuSheetContent title="메뉴" aria-label="Swipeable Menu Sheet">
          <SwipeableMenuSheetGroup>
            <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </SwipeableMenuSheetGroup>
        </SwipeableMenuSheetContent>
      </SwipeableMenuSheetRoot>

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
}
```

### Skip Animation \[#skip-animation]

`skipAnimation` prop을 사용하여 SwipeableMenuSheet의 enter/exit 애니메이션을 건너뛸 수 있습니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

const SwipeableMenuSheetSkipAnimation = () => {
  return (
    <SwipeableMenuSheetRoot skipAnimation>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent aria-label="Swipeable Menu Sheet">
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
};

export default SwipeableMenuSheetSkipAnimation;
```