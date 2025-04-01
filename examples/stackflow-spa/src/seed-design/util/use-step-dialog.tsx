import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useActivity, useActivityParams } from "@stackflow/react";
import { useStepFlow } from "@stackflow/react/future";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

export interface UseStepDialogProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useStepDialog(props: UseStepDialogProps = {}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const id = useId();
  const activity = useActivity();
  const { pushStep, popStep } = useStepFlow(activity.name as any);
  const params = useActivityParams<Record<string, string>>();
  const isDialogPersist = params[id] === "dialog";

  useEffect(() => {
    if (!isDialogPersist) {
      setOpen(false);
    }
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
