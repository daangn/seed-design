"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

function SnackbarTrigger({
  triggerLabel,
  message,
  actionLabel,
}: {
  triggerLabel: string;
  message: string;
  actionLabel: string;
}) {
  const adapter = useSnackbarAdapter();

  return (
    <ActionButton
      onClick={() =>
        adapter.create({
          onClose: () => {},
          render: () => (
            <Snackbar message={message} actionLabel={actionLabel} onAction={() => {}} />
          ),
        })
      }
    >
      {triggerLabel}
    </ActionButton>
  );
}

function SnackbarPreview(props: { triggerLabel: string; message: string; actionLabel: string }) {
  return (
    <SnackbarProvider>
      <SnackbarTrigger {...props} />
    </SnackbarProvider>
  );
}

export const story = defineStory({
  displayName: "Snackbar",
  Component: withStoryPreview()(SnackbarPreview),
  args: {
    initial: {
      triggerLabel: "실행",
      message: "알림 메세지",
      actionLabel: "확인",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
