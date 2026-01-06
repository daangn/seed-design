import { useEffect } from "react";
import { useStack } from "@stackflow/react/future";
import type { Activity } from "@stackflow/core";

type SerializedActivity = Pick<Activity, "id" | "name" | "isActive" | "transitionState">;

/**
 * Observes Stackflow stack changes and sends them to parent window
 * Only active when running inside an iframe
 */
export function StackSyncObserver() {
  const stack = useStack();

  useEffect(() => {
    if (window.parent === window) return;

    const sendStack = () => {
      const serializedActivities: SerializedActivity[] = stack?.activities.map(
        ({ id, name, isActive, transitionState }) => ({ id, name, isActive, transitionState }),
      );

      window.parent.postMessage({ type: "STACK_CHANGE", stack: serializedActivities }, "*");
    };

    sendStack();
  }, [stack]);

  return null;
}
