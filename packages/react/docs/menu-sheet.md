file: components/(deprecated)/menu-sheet.mdx

# Menu Sheet

사용자의 작업과 관련된 선택지를 제공하는 시트 형태의 컴포넌트입니다.

<Callout type="warn">
  더 이상 사용되지 않습니다. [Swipeable Menu Sheet](/react/components/swipeable-menu-sheet)을 사용하세요.
</Callout>

## Preview

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetPreview = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent
        title="proident irure"
        description="Aliqua fugiat adipisicing magna dolor laborum."
        aria-label="Menu Sheet"
      >
        <MenuSheetGroup>
          <MenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
          <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetPreview;
```

<Card title="Stackflow" href="/react/stackflow/menu-sheet" variant="example">
  Stackflow와 Menu Sheet를 함께 사용하는 방법에 대해 알아보세요.
</Card>

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:menu-sheet
- pnpm: pnpm dlx @seed-design/cli@latest add ui:menu-sheet
- yarn: yarn dlx @seed-design/cli@latest add ui:menu-sheet
- bun: bun x @seed-design/cli@latest add ui:menu-sheet

<ManualInstallation name="menu-sheet" />

## Props \[#props]

### `MenuSheetRoot` \[#menusheetroot]

- `lazyMount`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to enable lazy mounting
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to unmount on exit.
- `skipAnimation`
  - type: `boolean | undefined`
  - default: `false`
- `children`
  - type: `React.ReactNode`
  - required: `true`
- `role`
  - type: `"dialog" | "alertdialog" | undefined`
  - default: `"dialog"`
  - description: The role of the dialog.
- `modal`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether the dialog should behave as a modal overlay. When true, focus is trapped, background content is hidden from assistive technology, and \`aria-modal\` is set. Set to \`false\` to temporarily suspend modal behavior (e.g., when a Stackflow Activity is pushed on top of a mounted dialog).
- `closeOnInteractOutside`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to close the dialog when the outside is clicked
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

### `MenuSheetTrigger` \[#menusheettrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuSheetContent` \[#menusheetcontent]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `labelAlign`
  - type: `"left" | "center" | undefined`
  - default: `"left"`
  - description: - \`left\`: 라벨을 왼쪽 정렬합니다. - \`center\`: 라벨을 중앙 정렬합니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuSheetGroup` \[#menusheetgroup]

- `labelAlign`
  - type: `"left" | "center" | undefined`
  - default: `"left"`
  - description: - \`left\`: 라벨을 왼쪽 정렬합니다. - \`center\`: 라벨을 중앙 정렬합니다.

### `MenuSheetItem` \[#menusheetitem]

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

`<MenuSheetTrigger>`는 `aria-haspopup="dialog"` 속성을 설정하고, MenuSheet의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

## Preview

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetPreview = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent
        title="proident irure"
        description="Aliqua fugiat adipisicing magna dolor laborum."
        aria-label="Menu Sheet"
      >
        <MenuSheetGroup>
          <MenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
          <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetPreview;
```

### With Title \[#with-title]

`MenuSheetContent`의 `title` prop을 사용하여 시트 헤더에 제목을 표시합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetWithTitle = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="Menu Sheet">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <MenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetWithTitle;
```

### With Title and Description \[#with-title-and-description]

`MenuSheetContent`의 `description` prop을 사용하여 제목 아래에 부가 설명을 추가합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

export default function MenuSheetWithTitleAndDescription() {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent title="Menu Sheet" description="부가적인 설명이 여기에 표시됩니다.">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem
            label="Action 2"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
          <MenuSheetItem
            label="Action 3"
            prefixIcon={<IconEyeSlashLine />}
            description="Ut nulla et id dolor labore ullamco irure est id occaecat."
          />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
}
```

### Label Align \[#label-align]

`MenuSheetContent`의 `labelAlign` prop으로 메뉴 항목의 레이블 정렬을 설정합니다.

#### `labelAlign="left"` (with `PrefixIcon`) \[#labelalignleft-with-prefixicon]

레이블을 왼쪽 정렬합니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetWithPrefixIcon = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 5" prefixIcon={<IconEyeSlashLine />} tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetWithPrefixIcon;
```

#### `labelAlign="center"` (without `PrefixIcon`) \[#labelaligncenter-without-prefixicon]

레이블을 중앙 정렬합니다. (일반적으로, `prefixIcon` 없는 경우)

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetWithoutPrefixIcon = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet" labelAlign="center">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" />
          <MenuSheetItem label="Action 2" />
          <MenuSheetItem label="Action 3" />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" />
          <MenuSheetItem label="Action 5" tone="critical" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetWithoutPrefixIcon;
```

#### Overriding `labelAlign` \[#overriding-labelalign]

필요한 경우 `MenuSheetContent`에 지정한 `labelAlign`을 `MenuSheetGroup` 또는 `MenuSheetItem`에 지정한 `labelAlign`으로 덮어쓸 수 있습니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetOverridingLabelAlign = () => {
  return (
    <MenuSheetRoot>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet" labelAlign="center">
        <MenuSheetGroup labelAlign="left">
          <MenuSheetItem label="Action 1" />
          <MenuSheetItem label="Action 2" labelAlign="center" />
          <MenuSheetItem label="Action 3" />
        </MenuSheetGroup>
        <MenuSheetGroup>
          <MenuSheetItem label="Action 4" />
          <MenuSheetItem label="Action 5" tone="critical" labelAlign="left" />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetOverridingLabelAlign;
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `MenuSheetTrigger` (`MenuSheet.Trigger`)로 열림

**닫힐 때** (`open: false`)

- `"closeButton"`: `MenuSheet.CloseButton`으로 닫힘
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

export default function MenuSheetOnOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <MenuSheetRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <MenuSheetTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </MenuSheetTrigger>
        <MenuSheetContent title="메뉴" aria-label="Menu Sheet">
          <MenuSheetGroup>
            <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
            <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
            <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
          </MenuSheetGroup>
        </MenuSheetContent>
      </MenuSheetRoot>

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

`skipAnimation` prop을 사용하여 MenuSheet의 enter/exit 애니메이션을 건너뛸 수 있습니다.

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
  MenuSheetRoot,
  MenuSheetTrigger,
} from "seed-design/ui/menu-sheet";

const MenuSheetSkipAnimation = () => {
  return (
    <MenuSheetRoot skipAnimation>
      <MenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </MenuSheetTrigger>
      <MenuSheetContent aria-label="Menu Sheet">
        <MenuSheetGroup>
          <MenuSheetItem label="Action 1" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <MenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </MenuSheetGroup>
      </MenuSheetContent>
    </MenuSheetRoot>
  );
};

export default MenuSheetSkipAnimation;
```