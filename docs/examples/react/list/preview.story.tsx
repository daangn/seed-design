"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { List, ListDivider, ListItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";

// Controls come from ListItem's real props (title/detail/highlighted/…); a
// sibling item and the prefix/suffix slots are fixed. List is just the container.
function ListItemPreview(props: ComponentPropsWithoutRef<typeof ListItem>) {
  return (
    <VStack width="360px">
      <ListHeader as="h2">리스트 헤더</ListHeader>
      <List width="full">
        <ListItem title="기본 리스트 아이템" />
        <ListDivider />
        <ListItem
          {...props}
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          suffix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
        />
      </List>
    </VStack>
  );
}

export const story = defineStory({
  // prefix/suffix are ReactNode slots (fixed icons), not usable control widgets
  Component: withStoryPreview<{ prefix?: never; suffix?: never }>()(ListItemPreview),
  args: {
    initial: {
      title: "아이콘이 있는 리스트 아이템",
      detail: "부가 정보가 포함된 설명",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
