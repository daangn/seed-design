"use client";

import {
  type TopNavigationButtonsOverride,
  useActivityOverlayButtons,
  useActivityZIndexBase,
} from "@seed-design/stackflow";
import { useActions, useActivity } from "@stackflow/react";
import { BottomSheetContent, type BottomSheetContentProps, BottomSheetRoot } from "./bottom-sheet";

export interface ActivityBottomSheetProps extends Omit<BottomSheetContentProps, "layerIndex"> {
  /**
   * What happens to the bar buttons of the screen below while the sheet is open. Left as is when
   * omitted.
   */
  topNavigationButtons?: TopNavigationButtonsOverride;
}

/**
 * A BottomSheet that is an activity: open while the activity is active, popped when dismissed.
 */
export function ActivityBottomSheet({
  topNavigationButtons,
  ...otherProps
}: ActivityBottomSheetProps) {
  const { isActive } = useActivity();
  const { pop } = useActions();

  useActivityOverlayButtons(topNavigationButtons);

  return (
    <BottomSheetRoot open={isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent layerIndex={useActivityZIndexBase()} {...otherProps} />
    </BottomSheetRoot>
  );
}
