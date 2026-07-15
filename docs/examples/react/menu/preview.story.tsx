"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

// Controls come from MenuRoot's real props (its `size` axis); the trigger and
// item tree are fixed so the panel drives the actual component rather than a
// made-up interface.
function MenuPreview(props: ComponentPropsWithoutRef<typeof MenuRoot>) {
  return (
    <MenuRoot {...props}>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>작업</MenuGroupLabel>
          <MenuItem label="라이브러리에 추가" prefixIcon={<IconPlusLine />} />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
          />
        </MenuGroup>
        <MenuGroup>
          <MenuItem
            label="삭제"
            description="이 작업은 되돌릴 수 없습니다"
            tone="critical"
            prefixIcon={<IconTrashcanLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; open?: never; onOpenChange?: never }>()(
    MenuPreview,
  ),
  args: {
    initial: {
      size: "medium",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
