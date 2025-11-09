import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import type { RegisteredActivityName } from "@stackflow/config";
import { useActivity, useActivityParams, useStepFlow } from "@stackflow/react/future";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

export interface UseStepOverlayProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useStepOverlay<ActivityName extends RegisteredActivityName>(
  props: UseStepOverlayProps = {},
) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const id = useId();
  const activity = useActivity();
  const { pushStep, popStep } = useStepFlow(activity.name as RegisteredActivityName);

  const params = useActivityParams<ActivityName>();
  const isDialogPersist = params[id as keyof typeof params] === "dialog";

  useEffect(() => {
    if (!isDialogPersist) setOpen(false);
  }, [isDialogPersist]);

  const onOpenChange = useCallbackRef(props.onOpenChange);
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      onOpenChange?.(open);

      if (open) {
        if (!isDialogPersist) {
          pushStep({
            ...params,
            [id]: "dialog",
          });
        }
      } else {
        if (isDialogPersist) {
          popStep();
        }
      }
    },
    [pushStep, popStep, onOpenChange, isDialogPersist, params, id],
  );

  return useMemo(
    () => ({
      open,
      setOpen: handleOpenChange,
      dialogProps: {
        open,
        onOpenChange: handleOpenChange,
      },
    }),
    [open, handleOpenChange],
  );
}
