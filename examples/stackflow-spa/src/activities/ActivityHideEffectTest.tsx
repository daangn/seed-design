import { VStack } from "@seed-design/react";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import { AppScreen, AppScreenContent } from "../seed-design/ui/app-screen";
import { AppBar, AppBarBackButton } from "../seed-design/ui/app-bar";

declare module "@stackflow/config" {
  interface Register {
    ActivityHideEffectTest: {};
  }
}

/**
 * Test activity for verifying display:none optimization with overlay support.
 *
 * Test scenarios:
 * 1. Push "Full-screen Page" → verify previous activity gets display:none
 * 2. Push "Overlay BottomSheet" → verify previous activity stays visible
 * 3. Push Full-screen → Push Overlay → verify correct hide behavior
 */
const ActivityHideEffectTest: StaticActivityComponentType<"ActivityHideEffectTest"> = () => {
  const { push } = useFlow();
  const activity = useActivity();

  return (
    <AppScreen>
      <AppBar title="Hide Effect Test">
        <AppBarBackButton />
      </AppBar>
      <AppScreenContent>
        <VStack gap="x4" padding="x4">
          <ActionButton
            variant="brandSolid"
            onClick={() =>
              push("ActivityDetail", {
                title: "Full-screen Page",
                body: "This is a full-screen activity. The page behind should have display:none.",
              })
            }
          >
            Push Full-screen Page
          </ActionButton>

          <ActionButton variant="neutralSolid" onClick={() => push("ActivityOverlayTest", {})}>
            Push Overlay Activity (with activityType="overlay")
          </ActionButton>

          <ActionButton variant="neutralWeak" onClick={() => push("ActivityBottomSheet", {})}>
            Push BottomSheet (no AppScreen - existing pattern)
          </ActionButton>

          <VStack
            gap="x2"
            padding="x4"
            style={{ background: "var(--seed-bg-layer-default)", borderRadius: 12 }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Activity Info</div>
            <div style={{ fontSize: 12, color: "var(--seed-fg-neutral-subtle)" }}>
              id: {activity.id}
            </div>
            <div style={{ fontSize: 12, color: "var(--seed-fg-neutral-subtle)" }}>
              zIndex: {activity.zIndex}
            </div>
            <div style={{ fontSize: 12, color: "var(--seed-fg-neutral-subtle)" }}>
              transitionState: {activity.transitionState}
            </div>
            <div style={{ fontSize: 12, color: "var(--seed-fg-neutral-subtle)" }}>
              isTop: {String(activity.isTop)}
            </div>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityHideEffectTest;
