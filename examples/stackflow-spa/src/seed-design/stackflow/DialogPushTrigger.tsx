import { Slot } from "@radix-ui/react-slot";
import { forwardRef, useState } from "react";
import type { ActivityName, ActivityParamOf } from "../../stackflow";
import type { CallbackActivity } from "../../stackflow/createCallbackActivity";

export interface DialogPushTriggerProps<A extends ActivityName, T> {
  children: React.ReactElement;

  callbackActivity: CallbackActivity<A, T>;

  params: ActivityParamOf<A>;

  onPop?: (value: T | undefined) => void;
}

export const DialogPushTrigger: <A extends ActivityName, T>(
  props: DialogPushTriggerProps<A, T> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactNode | null = forwardRef(
  ({ children, callbackActivity, params, onPop, ...props }, ref: React.Ref<HTMLButtonElement>) => {
    const [isOpen, setIsOpen] = useState(false);
    const callbackPush = callbackActivity.useCallbackPush();

    const handleClick = async () => {
      setIsOpen(true);
      const value = await callbackPush(params);
      onPop?.(value);
      setIsOpen(false);
    };

    return (
      <Slot
        ref={ref}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        {...props}
      >
        {children}
      </Slot>
    );
  },
);
