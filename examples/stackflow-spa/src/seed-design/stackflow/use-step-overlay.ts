import type { RegisteredActivityName } from "@stackflow/config";
import { useActivity, useActivityParams, useStepFlow } from "@stackflow/react/future";
import { useCallback, useId, useMemo, useState } from "react";
import { useCallbackRef } from "@radix-ui/react-use-callback-ref";

// a purely stackflow related hook except `open` and `onOpenChange` management

export interface UseStepOverlayProps {
  key?: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useStepOverlay(props: UseStepOverlayProps = {}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const id = useId();
  const activity = useActivity();
  const { pushStep, popStep } = useStepFlow(activity.name as RegisteredActivityName);

  const params = useActivityParams<RegisteredActivityName>();
  const isOverlayPersist = params[(props.key || id) as keyof typeof params] === "open";

  const onOpenChange = useCallbackRef(props.onOpenChange);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      onOpenChange?.(open);

      if (open && !isOverlayPersist) {
        pushStep((params) => ({ ...params, [props.key || id]: "open" }));

        return;
      }

      if (!open && isOverlayPersist) {
        popStep();

        return;
      }
    },
    [pushStep, popStep, onOpenChange, isOverlayPersist, id, props.key],
  );

  return useMemo(
    () => ({
      open,
      setOpen: handleOpenChange,
      overlayProps: {
        open,
        onOpenChange: handleOpenChange,
      },
    }),
    [open, handleOpenChange],
  );
}
