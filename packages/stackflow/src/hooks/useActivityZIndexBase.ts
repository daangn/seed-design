import { useNullableActivity } from "@stackflow/react-ui-core";

interface UseActivityZIndexBaseParams {
  /**
   * Offset from the current activity's position in the stack.
   *
   * - `0` (default): Current activity's z-index base
   * - `1`: Next activity's z-index base (common for overlay components)
   *
   * @default 0
   */
  activityOffset?: number;
}

const Z_INDEX_SPACING = 5;

/**
 * Returns the base z-index which is calculated by multiplying the activity's index by 5.
 * This value is used to give proper z-index values to elements of AppScreen (e.g. app-bar, dim, edge, layer). See the stylesheet of AppScreen for more details.
 * This value can be provided to layerIndex of various overlay components (e.g. AlertDialog, BottomSheet, MenuSheet) to ensure correct stacking order.
 */
export function useActivityZIndexBase(params?: UseActivityZIndexBaseParams): number {
  const activity = useNullableActivity();

  return ((activity?.zIndex ?? 0) + (params?.activityOffset ?? 0)) * Z_INDEX_SPACING;
}
