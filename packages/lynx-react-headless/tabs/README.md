# @seed-design/lynx-react-tabs

Headless component built to implement [SEED Lynx Tabs](https://seed-design.io/lynx/components/tabs). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useState } from "@lynx-js/react";
import { Tabs } from "@seed-design/lynx-react-tabs";

export function ProfileTabs() {
  const [value, setValue] = useState("posts");

  return (
    <Tabs.Root value={value} onValueChange={setValue}>
      <Tabs.List>
        <Tabs.Trigger value="posts" accessibility-label="Posts">
          <text>Posts</text>
        </Tabs.Trigger>
        <Tabs.Trigger value="saved" accessibility-label="Saved">
          <text>Saved</text>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="posts" hidden={value !== "posts"}>
        <text>Your recent posts</text>
      </Tabs.Content>
      <Tabs.Content value="saved" hidden={value !== "saved"}>
        <text>Your saved posts</text>
      </Tabs.Content>
    </Tabs.Root>
  );
}
```
