# @seed-design/lynx-react-sortable

Headless component built to implement [SEED Lynx Attachment Field](https://seed-design.io/lynx/components/attachment-field). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Sortable } from "@seed-design/lynx-react-sortable";

export function AttachmentOrder() {
  const [items, setItems] = useState(["photo.jpg", "receipt.pdf"]);

  function reorder(from: number, to: number) {
    setItems((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  return (
    <Sortable.Root
      items={items}
      getItemKey={(item) => item}
      scrollableBoundaryId="attachment-scroll"
      onReorder={reorder}
    >
      {({ onScroll, dragging }) => (
        <scroll-view
          id="attachment-scroll"
          scroll-x
          enable-scroll={!dragging}
          main-thread:bindscroll={onScroll}
        >
          <view style={{ display: "flex", flexDirection: "row" }}>
            {items.map((item, index) => (
              <Sortable.Item
                key={item}
                itemId={item}
                index={index}
                accessibility-element={true}
                accessibility-label={item}
                moveActionLabels={{ previous: "Move earlier", next: "Move later" }}
              >
                {() => <text>{item}</text>}
              </Sortable.Item>
            ))}
          </view>
        </scroll-view>
      )}
    </Sortable.Root>
  );
}
```
