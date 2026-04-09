import { useNullableActivity } from "@stackflow/react-ui-core";
import { useEffect } from "react";

export type ActivityType = "full-screen" | "overlay";

export const DEFAULT_ACTIVITY_TYPE: ActivityType = "full-screen";

export interface HideRegistryEntry {
  ref: React.RefObject<HTMLElement>;
  activityType: ActivityType;
  zIndex: number;
}

export const hideRegistry = new Map<string, HideRegistryEntry>();

export interface UseHideEffectParams {
  ref: React.RefObject<HTMLElement>;
  activityType: ActivityType;
}

/**
 * Registers the current activity's ref and type in the hide registry.
 * Display management is handled centrally by `useHideEffectCoordinator`.
 */
export function useHideEffect(params: UseHideEffectParams): void {
  const { ref, activityType } = params;
  const activity = useNullableActivity();

  const activityId = activity?.id;
  const zIndex = activity?.zIndex ?? 0;

  useEffect(() => {
    if (!activityId) return;

    hideRegistry.set(activityId, { ref, activityType, zIndex });

    return () => {
      hideRegistry.delete(activityId);
    };
  }, [activityId, ref, activityType, zIndex]);
}
