"use client";

import { type OptionalLineIconName, resolveStoryIcon } from "@/components/story/icon-set";
import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { Icon, VStack } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { List, ListDivider, ListItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";

// Controls come from ListItem's real props. `prefix`/`suffix` are genuine
// ReactNode slots, narrowed here to an optional icon picker (with an "Unset"
// chip since both are optional); a sibling item is fixed.
function ListItemPreview({
  prefix = "IconPersonCircleLine",
  suffix = "IconILowercaseSerifCircleLine",
  ...props
}: Omit<ComponentPropsWithoutRef<typeof ListItem>, "prefix" | "suffix"> & {
  prefix?: OptionalLineIconName;
  suffix?: OptionalLineIconName;
}) {
  const prefixIcon = resolveStoryIcon(prefix);
  const suffixIcon = resolveStoryIcon(suffix);

  return (
    <VStack width="360px">
      <ListHeader as="h2">리스트 헤더</ListHeader>
      <List width="full">
        <ListItem title="기본 리스트 아이템" />
        <ListDivider />
        <ListItem
          {...props}
          prefix={prefixIcon && <Icon svg={prefixIcon} />}
          suffix={suffixIcon && <Icon svg={suffixIcon} />}
        />
      </List>
    </VStack>
  );
}

export const story = defineStory({
  Component: withStoryPreview()(ListItemPreview),
  args: {
    initial: {
      title: "아이콘이 있는 리스트 아이템",
      detail: "부가 정보가 포함된 설명",
      prefix: "IconPersonCircleLine",
      suffix: "IconILowercaseSerifCircleLine",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
