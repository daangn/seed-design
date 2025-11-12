import { useNullableActivity } from "@stackflow/react-ui-core";

/**
 * Returns the base z-index which is calculated by multiplying the current activity's index by 5.
 * This value is used to give proper z-index values to elements of AppScreen (e.g. app-bar, dim, edge, layer). See the stylesheet of AppScreen for more details.
 * This value can be provided to layerIndex of various overlay components (e.g. AlertDialog, BottomSheet, MenuSheet) to ensure correct stacking order.
 */
export function useZIndexBase() {
  const activity = useNullableActivity();

  return (activity?.zIndex ?? 0) * 5;
}
