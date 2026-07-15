"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import type { ComponentPropsWithoutRef } from "react";
import { Snackbar, SnackbarProvider } from "seed-design/ui/snackbar";

// Snackbar is normally shown imperatively via the adapter, but the panel can
// only drive one component's real props — so it's rendered statically here and
// controls come from the real Snackbar props (message/actionLabel/variant/…).
// `Snackbar` reads `useSnackbarContext`, so it still needs a `SnackbarProvider`
// ancestor even when rendered statically. The imperative `adapter.create()`
// usage is documented in the page body.
function SnackbarPreview(props: ComponentPropsWithoutRef<typeof Snackbar>) {
  return (
    <SnackbarProvider>
      <Snackbar {...props} onAction={() => {}} />
    </SnackbarProvider>
  );
}

export const story = defineStory({
  Component: withStoryPreview<{ children?: never; asChild?: never; onAction?: never }>()(
    SnackbarPreview,
  ),
  args: {
    initial: {
      message: "알림 메세지",
      actionLabel: "확인",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
