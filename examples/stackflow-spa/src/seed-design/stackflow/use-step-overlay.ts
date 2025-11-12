import type { RegisteredActivityName } from "@stackflow/config";
import { useActivity, useActivityParams, useStepFlow } from "@stackflow/react/future";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useCallbackRef } from "@radix-ui/react-use-callback-ref";

export interface UseStepOverlayProps {
  id?: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useStepOverlay(props: UseStepOverlayProps = {}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const id = useId();
  const activity = useActivity();
  const { pushStep, popStep } = useStepFlow(activity.name as RegisteredActivityName);

  const params = useActivityParams<RegisteredActivityName>();
  const isOverlayPersist = params[(props.id || id) as keyof typeof params] === "open";

  useEffect(() => {
    if (!isOverlayPersist) {
      setOpen(false);
    }
  }, [isOverlayPersist]);

  const onOpenChange = useCallbackRef(props.onOpenChange);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      onOpenChange?.(open);

      if (open && !isOverlayPersist) {
        pushStep({ ...params, [props.id || id]: "open" });

        return;
      }

      if (!open && isOverlayPersist) {
        popStep();

        return;
      }
    },
    [pushStep, popStep, onOpenChange, isOverlayPersist, params, id, props.id],
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
