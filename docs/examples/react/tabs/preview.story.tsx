"use client";

import type { PropsWithChildren } from "react";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  type TabsRootProps,
  TabsTrigger,
} from "seed-design/ui/tabs";

const Content = ({ children }: PropsWithChildren) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "300px",
      backgroundColor: "var(--seed-color-bg-layer-default)",
    }}
  >
    {children}
  </div>
);

function TabsPreview({
  size,
  triggerLayout,
}: {
  size?: TabsRootProps["size"];
  triggerLayout?: TabsRootProps["triggerLayout"];
}) {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" size={size} triggerLayout={triggerLayout}>
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

export const story = defineStory({
  displayName: "Tabs",
  Component: withStoryPreview()(TabsPreview),
  args: {
    initial: {
      size: "small",
      triggerLayout: "fill",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
