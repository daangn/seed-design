import { VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

declare module "@stackflow/config" {
  interface Register {
    ActivitySidePanel: {};
  }
}

const ActivitySidePanel: StaticActivityComponentType<"ActivitySidePanel"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [direction, setDirection] = useState<"left" | "right">("right");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

  const open = activity.isActive;
  const onOpenChange = (open: boolean) => !open && pop();

  return (
    <SidePanelRoot open={open} onOpenChange={onOpenChange} direction={direction} size={size}>
      <SidePanelContent
        title="Side Panel"
        description="Side Panel 컴포넌트 데모입니다."
        layerIndex={useActivityZIndexBase()}
      >
        <SidePanelBody>
          <VStack gap="x4">
            <VStack gap="x2">
              <SegmentedControl
                aria-label="패널 방향"
                value={direction}
                onValueChange={(v) => setDirection(v as "left" | "right")}
                style={{ width: "100%" }}
              >
                <SegmentedControlItem value="left">Left</SegmentedControlItem>
                <SegmentedControlItem value="right">Right</SegmentedControlItem>
              </SegmentedControl>
            </VStack>

            <VStack gap="x2">
              <SegmentedControl
                aria-label="패널 크기"
                value={size}
                onValueChange={(v) => setSize(v as "small" | "medium" | "large")}
                style={{ width: "100%" }}
              >
                <SegmentedControlItem value="small">Small</SegmentedControlItem>
                <SegmentedControlItem value="medium">Medium</SegmentedControlItem>
                <SegmentedControlItem value="large">Large</SegmentedControlItem>
              </SegmentedControl>
            </VStack>
          </VStack>
        </SidePanelBody>
        <SidePanelFooter>
          <VStack gap="x2">
            <ActionButton variant="neutralWeak" onClick={() => pop()}>
              닫기
            </ActionButton>
            <ActionButton variant="neutralSolid">확인</ActionButton>
          </VStack>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default ActivitySidePanel;
