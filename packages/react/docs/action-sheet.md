file: components/(deprecated)/action-sheet.mdx

# Action Sheet



<Callout type="warn">
  더 이상 사용되지 않습니다. [Swipeable Menu Sheet](/react/components/swipeable-menu-sheet)을 사용하세요.
</Callout>

## Preview

```tsx
import {
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetRoot,
  ActionSheetTrigger,
} from "seed-design/ui/action-sheet";
import { ActionButton } from "seed-design/ui/action-button";

const ActionSheetPreview = () => {
  return (
    <ActionSheetRoot>
      <ActionSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </ActionSheetTrigger>
      <ActionSheetContent aria-label="Action Sheet">
        <ActionSheetItem label="Action 1" />
        <ActionSheetItem label="Action 2" />
        <ActionSheetItem tone="critical" label="Action 3" />
      </ActionSheetContent>
    </ActionSheetRoot>
  );
};

export default ActionSheetPreview;
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:action-sheet
- pnpm: pnpm dlx @seed-design/cli@latest add ui:action-sheet
- yarn: yarn dlx @seed-design/cli@latest add ui:action-sheet
- bun: bun x @seed-design/cli@latest add ui:action-sheet

<ManualInstallation name="action-sheet" />

## Props \[#props]

### `ActionSheetRoot` \[#actionsheetroot]

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

### `ActionSheetContent` \[#actionsheetcontent]

- `title`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `layerIndex`
  - type: `number | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `ActionSheetItem` \[#actionsheetitem]

- `label`
  - type: `React.ReactNode`
  - required: `true`
- `tone`
  - type: `"neutral" | "critical" | undefined`
  - default: `"neutral"`

## Examples \[#examples]

### Portalled \[#portalled]

`<Portal>`으로 `<ActionSheetContent>`를 감싸서 컨텐츠를 원하는 요소에 렌더링할 수 있습니다.

Portal은 기본적으로 `document.body`에 렌더링됩니다.

```tsx
import { Portal } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ActionSheetContent,
  ActionSheetItem,
  ActionSheetRoot,
  ActionSheetTrigger,
} from "seed-design/ui/action-sheet";

const ActionSheetPortalled = () => {
  return (
    <ActionSheetRoot>
      <ActionSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </ActionSheetTrigger>
      <Portal>
        <ActionSheetContent aria-label="Action Sheet">
          <ActionSheetItem label="Action 1" />
          <ActionSheetItem label="Action 2" />
          <ActionSheetItem tone="critical" label="Action 3" />
        </ActionSheetContent>
      </Portal>
    </ActionSheetRoot>
  );
};

export default ActionSheetPortalled;
```