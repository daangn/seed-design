import { useNullableActivity } from "@stackflow/react-ui-core";

interface UseZIndexBaseParams {
  /**
   * Offset to add to the current activity index before calculating z-index.
   * Typically +1 is safe for step-based overlays to appear above the current activity.
   * @default 0
   */
  modifier?: number;
}

/**
 * Returns the base z-index which is calculated by multiplying the current activity's index by 5.
 * This value is used to give proper z-index values to elements of AppScreen (e.g. app-bar, dim, edge, layer). See the stylesheet of AppScreen for more details.
 * This value can be provided to layerIndex of various overlay components (e.g. AlertDialog, BottomSheet, MenuSheet) to ensure correct stacking order.
 */
export function useZIndexBase(params?: UseZIndexBaseParams): number {
  const activity = useNullableActivity();

  return ((activity?.zIndex ?? 0) + (params?.modifier ?? 0)) * 5;
}
