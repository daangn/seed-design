import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { useActivityZIndexBase, AppScreen as SeedAppScreen } from "@seed-design/stackflow";
import { VStack } from "@seed-design/react";

declare module "@stackflow/config" {
  interface Register {
    ActivityOverlayTest: {};
  }
}

/**
 * Overlay activity that uses activityType="overlay".
 * The activity behind this should remain visible (not display:none).
 */
const ActivityOverlayTest: StaticActivityComponentType<"ActivityOverlayTest"> = () => {
  const activity = useActivity();
  const { pop, push } = useFlow();

  const open =
    activity.transitionState === "enter-active" || activity.transitionState === "enter-done";

  const onOpenChange = (open: boolean) => {
    if (!open && activity.isActive) {
      pop();
    }
  };

  return (
    <SeedAppScreen.Root activityType="overlay">
      <SeedAppScreen.Dim />
      <SeedAppScreen.Layer>
        <BottomSheetRoot open={open} onOpenChange={onOpenChange}>
          <BottomSheetContent
            showHandle
            showCloseButton={false}
            title="Overlay Test"
            layerIndex={useActivityZIndexBase()}
          >
            <BottomSheetBody>
              <VStack gap="x4">
                <div style={{ fontSize: 14 }}>
                  This activity has <code>activityType="overlay"</code>. The activity behind should
                  still be visible.
                </div>
                <div style={{ fontSize: 12, color: "var(--seed-fg-neutral-subtle)" }}>
                  zIndex: {activity.zIndex} / transitionState: {activity.transitionState}
                </div>
                <ActionButton
                  variant="neutralSolid"
                  onClick={() =>
                    push("ActivityDetail", {
                      title: "Pushed from Overlay",
                      body: "This full-screen page was pushed from an overlay activity.",
                    })
                  }
                >
                  Push Full-screen from here
                </ActionButton>
              </VStack>
            </BottomSheetBody>
            <BottomSheetFooter>
              <ActionButton variant="neutralWeak" onClick={pop}>
                닫기
              </ActionButton>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheetRoot>
      </SeedAppScreen.Layer>
    </SeedAppScreen.Root>
  );
};

export default ActivityOverlayTest;
