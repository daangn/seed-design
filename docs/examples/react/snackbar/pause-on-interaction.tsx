import { VStack } from "@seed-design/react";
import { ActionButton } from "@/registry/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "@/registry/ui/snackbar";
import { SegmentedControl, SegmentedControlItem } from "@/registry/ui/segmented-control";
import { useState } from "react";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <ActionButton
      onClick={() =>
        adapter.create({
          timeout: 5000,
          onClose: () => {},
          render: () => <Snackbar message="알림 메세지" actionLabel="확인" onAction={() => {}} />,
        })
      }
    >
      실행
    </ActionButton>
  );
}

export default function SnackbarPauseOnInteraction() {
  const [pauseOnInteraction, setPauseOnInteraction] = useState(true);

  return (
    <VStack gap="spacingY.componentDefault" alignItems="center">
      <SnackbarProvider pauseOnInteraction={pauseOnInteraction}>
        <Component />
      </SnackbarProvider>
      <SegmentedControl
        value={`${pauseOnInteraction}`}
        onValueChange={(value) => setPauseOnInteraction(value === "true")}
      >
        <SegmentedControlItem value="false">false</SegmentedControlItem>
        <SegmentedControlItem value="true">true</SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
