"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ResponsivePair } from "@seed-design/react";
import type { ComponentPropsWithoutRef } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "seed-design/ui/alert-dialog";

// Controls come from AlertDialogRoot's real props; the trigger and content tree
// are fixed.
function AlertDialogPreview(props: ComponentPropsWithoutRef<typeof AlertDialogRoot>) {
  return (
    <AlertDialogRoot {...props}>
      <AlertDialogTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent layerIndex={50}>
        <AlertDialogHeader>
          <AlertDialogTitle>주의</AlertDialogTitle>
          <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ResponsivePair gap="x2">
            <AlertDialogAction variant="neutralWeak">취소</AlertDialogAction>
            <AlertDialogAction variant="neutralSolid">확인</AlertDialogAction>
          </ResponsivePair>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; open?: never; onOpenChange?: never }>()(
    AlertDialogPreview,
  ),
  args: {},
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
