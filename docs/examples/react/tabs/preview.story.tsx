"use client";

import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

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

// Controls come from TabsRoot's real group-level props (size/triggerLayout/
// contentLayout/…); the triggers and content panels are fixed.
function TabsPreview(props: ComponentPropsWithoutRef<typeof TabsRoot>) {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot {...props} defaultValue="1">
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
  // value/defaultValue are the controlled selection (a fixed one is hardcoded)
  Component: withStoryPreview<{
    children?: never;
    asChild?: never;
    value?: never;
    defaultValue?: never;
  }>()(TabsPreview),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
