import { VStack } from "@seed-design/react";
import { useRef, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import {
  Snackbar,
  SnackbarProvider,
  useSnackbarAdapter,
  type SnackbarProviderProps,
} from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();
  const countRef = useRef(0);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <ActionButton
        onClick={() =>
          adapter.create({
            render: () => <Snackbar message={`Snackbar #${++countRef.current}`} />,
          })
        }
      >
        Create
      </ActionButton>
      <ActionButton
        variant="neutralSolid"
        onClick={() =>
          adapter.create({
            render: () => <Snackbar message={`Snackbar #${++countRef.current}`} />,
          })
        }
      >
        Create Another
      </ActionButton>
    </div>
  );
}

export default function SnackbarStrategy() {
  const [strategy, setStrategy] = useState<SnackbarProviderProps["strategy"]>("immediate");

  return (
    <VStack gap="spacingY.componentDefault" alignItems="center">
      <SnackbarProvider strategy={strategy}>
        <Component />
      </SnackbarProvider>
      <SegmentedControl
        aria-label="Strategy"
        value={strategy}
        onValueChange={(value) => setStrategy(value as typeof strategy)}
      >
        <SegmentedControlItem value="immediate">Immediate</SegmentedControlItem>
        <SegmentedControlItem value="queued">Queued</SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
