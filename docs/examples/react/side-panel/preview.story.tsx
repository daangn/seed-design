"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
  SidePanelTrigger,
} from "seed-design/ui/side-panel";

// Controls come from SidePanelRoot's real props (its `direction` axis); the
// trigger and content tree are fixed.
function SidePanelPreview(props: ComponentPropsWithoutRef<typeof SidePanelRoot>) {
  return (
    <SidePanelRoot {...props}>
      <SidePanelTrigger asChild>
        <ActionButton variant="neutralSolid">사이드 패널 열기</ActionButton>
      </SidePanelTrigger>
      <SidePanelContent title="제목" description="설명을 작성할 수 있어요">
        <SidePanelBody paddingX="x6">
          패널 본문에는 사용자가 확인해야 할 내용이나 추가 입력 폼을 배치할 수 있습니다.
        </SidePanelBody>
        <SidePanelFooter>
          <ActionButton variant="neutralSolid">확인</ActionButton>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; open?: never; onOpenChange?: never }>()(
    SidePanelPreview,
  ),
  args: {
    initial: {
      direction: "right",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
