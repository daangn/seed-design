"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";
import { List, ListDivider, ListItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";

function ListPreview({
  title,
  detail,
  highlighted,
}: {
  title?: string;
  detail?: string;
  highlighted?: boolean;
}) {
  return (
    <VStack width="360px">
      <ListHeader as="h2">리스트 헤더</ListHeader>
      <List width="full">
        <ListItem title="기본 리스트 아이템" />
        <ListDivider />
        <ListItem
          highlighted={highlighted}
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title={title}
          detail={detail}
          suffix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
        />
      </List>
    </VStack>
  );
}

export const story = defineStory({
  displayName: "List",
  Component: withStoryPreview()(ListPreview),
  args: {
    initial: {
      title: "아이콘이 있는 리스트 아이템",
      detail: "부가 정보가 포함된 설명",
      highlighted: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
