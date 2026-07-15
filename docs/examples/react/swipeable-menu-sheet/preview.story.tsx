"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
  SwipeableMenuSheetTrigger,
} from "seed-design/ui/swipeable-menu-sheet";

function SwipeableMenuSheetPreview({
  triggerLabel,
  title,
  description,
}: {
  triggerLabel: string;
  title: string;
  description: string;
}) {
  return (
    <SwipeableMenuSheetRoot>
      <SwipeableMenuSheetTrigger asChild>
        <ActionButton variant="neutralSolid">{triggerLabel}</ActionButton>
      </SwipeableMenuSheetTrigger>
      <SwipeableMenuSheetContent
        title={title}
        description={description}
        aria-label="Swipeable Menu Sheet"
      >
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem
            label="Action 1"
            description="Est commodo veniam magna officia ad dolor esse aliquip laboris nisi do."
            prefixIcon={<IconEyeSlashLine />}
          />
          <SwipeableMenuSheetItem label="Action 2" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem label="Action 3" prefixIcon={<IconEyeSlashLine />} />
        </SwipeableMenuSheetGroup>
        <SwipeableMenuSheetGroup>
          <SwipeableMenuSheetItem label="Action 4" prefixIcon={<IconEyeSlashLine />} />
          <SwipeableMenuSheetItem
            label="Action 5"
            prefixIcon={<IconEyeSlashLine />}
            tone="critical"
          />
        </SwipeableMenuSheetGroup>
      </SwipeableMenuSheetContent>
    </SwipeableMenuSheetRoot>
  );
}

export const story = defineStory({
  displayName: "SwipeableMenuSheet",
  Component: withStoryPreview()(SwipeableMenuSheetPreview),
  args: {
    initial: {
      triggerLabel: "Open",
      title: "proident irure",
      description: "Aliqua fugiat adipisicing magna dolor laborum.",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
