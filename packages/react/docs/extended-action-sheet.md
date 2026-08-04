file: components/(deprecated)/extended-action-sheet.mdx

# Extended Action Sheet



<Callout type="warn">
  더 이상 사용되지 않습니다. [Swipeable Menu Sheet](/react/components/swipeable-menu-sheet)을 사용하세요.
</Callout>

## Preview

```tsx
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ExtendedActionSheetContent,
  ExtendedActionSheetGroup,
  ExtendedActionSheetItem,
  ExtendedActionSheetRoot,
  ExtendedActionSheetTrigger,
} from "seed-design/ui/extended-action-sheet";

const ExtendedActionSheetPreview = () => {
  return (
    <ExtendedActionSheetRoot>
      <ExtendedActionSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </ExtendedActionSheetTrigger>
      <ExtendedActionSheetContent aria-label="Extended Action Sheet">
        <ExtendedActionSheetGroup>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 1
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 2
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 3
          </ExtendedActionSheetItem>
        </ExtendedActionSheetGroup>
        <ExtendedActionSheetGroup>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 4
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem tone="critical">
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 5
          </ExtendedActionSheetItem>
        </ExtendedActionSheetGroup>
      </ExtendedActionSheetContent>
    </ExtendedActionSheetRoot>
  );
};

export default ExtendedActionSheetPreview;
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:extended-action-sheet
- pnpm: pnpm dlx @seed-design/cli@latest add ui:extended-action-sheet
- yarn: yarn dlx @seed-design/cli@latest add ui:extended-action-sheet
- bun: bun x @seed-design/cli@latest add ui:extended-action-sheet

<ManualInstallation name="extended-action-sheet" />

## Props \[#props]

### `ExtendedActionSheetRoot` \[#extendedactionsheetroot]

- `lazyMount`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to enable lazy mounting
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to unmount on exit.
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

### `ExtendedActionSheetTrigger` \[#extendedactionsheettrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ExtendedActionSheetContent` \[#extendedactionsheetcontent]

- `title`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ExtendedActionSheetGroup` \[#extendedactionsheetgroup]

<TypeTable
  id="type-table-extended-action-sheet.tsx-ExtendedActionSheetGroupProps"
  type="{
&#x22;id&#x22;: &#x22;extended-action-sheet.tsx-ExtendedActionSheetGroupProps&#x22;,
&#x22;name&#x22;: &#x22;ExtendedActionSheetGroupProps&#x22;,
&#x22;description&#x22;: &#x22;&#x22;,
&#x22;entries&#x22;: []
}"
/>

### `ExtendedActionSheetItem` \[#extendedactionsheetitem]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `tone`
  - type: `"neutral" | "critical" | undefined`
  - default: `"neutral"`