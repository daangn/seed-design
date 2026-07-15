"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

function SidePanelPreview({
  direction,
  triggerLabel,
  title,
  description,
  bodyText,
  confirmLabel,
}: {
  direction: "left" | "right";
  triggerLabel: string;
  title: string;
  description: string;
  bodyText: string;
  confirmLabel: string;
}) {
  return (
    <SidePanelRoot direction={direction}>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">{triggerLabel}</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title={title} description={description}>
        <SidePanelBody paddingX="x6">{bodyText}</SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid">{confirmLabel}</ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
}

export const story = defineStory({
  displayName: "SidePanel",
  Component: withStoryPreview()(SidePanelPreview),
  args: {
    initial: {
      direction: "right",
      triggerLabel: "Open Side Panel",
      title: "제목",
      description: "설명을 작성할 수 있어요",
      bodyText: "패널 본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.",
      confirmLabel: "확인",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
