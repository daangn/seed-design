# @seed-design/lynx-react-menu

Headless component built to implement [SEED Lynx Menu](https://seed-design.io/lynx/components/menu). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { Menu } from "@seed-design/lynx-react-menu";

export function ListingMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <Menu.Root>
      <Menu.Trigger>
        <text>Listing actions</text>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Group>
            <Menu.GroupLabel>Manage listing</Menu.GroupLabel>
            <Menu.Item bindtap={onEdit}>
              <text>Edit</text>
            </Menu.Item>
            <Menu.Item bindtap={onDelete}>
              <text>Delete</text>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
```
