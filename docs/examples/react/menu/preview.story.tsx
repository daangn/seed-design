"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

function MenuPreview({
  triggerLabel,
  groupLabel,
  addLabel,
  editLabel,
  editDescription,
  deleteLabel,
  deleteDescription,
}: {
  triggerLabel: string;
  groupLabel: string;
  addLabel: string;
  editLabel: string;
  editDescription: string;
  deleteLabel: string;
  deleteDescription: string;
}) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">{triggerLabel}</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>{groupLabel}</MenuGroupLabel>
          <MenuItem label={addLabel} prefixIcon={<IconPlusLine />} />
          <MenuItem
            label={editLabel}
            description={editDescription}
            prefixIcon={<IconPencilLine />}
          />
        </MenuGroup>
        <MenuGroup>
          <MenuItem
            label={deleteLabel}
            description={deleteDescription}
            tone="critical"
            prefixIcon={<IconTrashcanLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}

export const story = defineStory({
  displayName: "Menu",
  Component: withStoryPreview()(MenuPreview),
  args: {
    initial: {
      triggerLabel: "열기",
      groupLabel: "작업",
      addLabel: "라이브러리에 추가",
      editLabel: "수정",
      editDescription: "현재 항목을 수정합니다",
      deleteLabel: "삭제",
      deleteDescription: "이 작업은 되돌릴 수 없습니다",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
