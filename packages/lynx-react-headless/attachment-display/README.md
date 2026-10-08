# @seed-design/lynx-react-attachment-display

Headless component built to implement [SEED Lynx Attachment Display Field](https://seed-design.io/lynx/components/attachment-display-field). This is an internal utility, not intended for public usage.

## Usage

```tsx
import {
  AttachmentDisplay,
  AttachmentDisplayItemProvider,
  useAttachmentDisplayItem,
  type DisplayItemEntry,
} from "@seed-design/lynx-react-attachment-display";

function PhotoItem({ entry }: { entry: DisplayItemEntry }) {
  const item = useAttachmentDisplayItem(entry);

  return (
    <AttachmentDisplayItemProvider value={item}>
      <view>
        <AttachmentDisplay.ItemImage style={{ width: "80px", height: "80px" }} />
        <text>{entry.name}</text>
        <AttachmentDisplay.ItemRemoveButton>
          <text>Remove</text>
        </AttachmentDisplay.ItemRemoveButton>
      </view>
    </AttachmentDisplayItemProvider>
  );
}

export function ProductPhotos({ entries }: { entries: DisplayItemEntry[] }) {
  return (
    <AttachmentDisplay.Root defaultEntries={entries} maxEntries={5}>
      <AttachmentDisplay.Context>
        {({ entries }) => entries.map((entry) => <PhotoItem key={entry.id} entry={entry} />)}
      </AttachmentDisplay.Context>
      <AttachmentDisplay.Description>
        Photos attached to this product.
      </AttachmentDisplay.Description>
    </AttachmentDisplay.Root>
  );
}
```
