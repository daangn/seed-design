import { Flex, VStack } from "@seed-design/react";
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
      <SidePanelContent title="Side Panel" description="Side Panel 컴포넌트 데모입니다.">
        <SidePanelBody>
          <VStack gap="x4">
            <VStack gap="x2">
              <SegmentedControl
                value={direction}
                onValueChange={(v) => setDirection(v as "left" | "right")}
              >
                <SegmentedControlItem value="left">Left</SegmentedControlItem>
                <SegmentedControlItem value="right">Right</SegmentedControlItem>
              </SegmentedControl>
            </VStack>

            <VStack gap="x2">
              <SegmentedControl
                value={size}
                onValueChange={(v) => setSize(v as "small" | "medium" | "large")}
              >
                <SegmentedControlItem value="small">Small</SegmentedControlItem>
                <SegmentedControlItem value="medium">Medium</SegmentedControlItem>
                <SegmentedControlItem value="large">Large</SegmentedControlItem>
              </SegmentedControl>
            </VStack>
          </VStack>
        </SidePanelBody>
        <SidePanelFooter>
          <Flex gap="x2">
            <ActionButton variant="neutralWeak" flexGrow onClick={() => pop()}>
              닫기
            </ActionButton>
            <ActionButton variant="neutralSolid" flexGrow>
              확인
            </ActionButton>
          </Flex>
        </SidePanelFooter>
      </SidePanelContent>
    </SidePanelRoot>
  );
};

export default ActivitySidePanel;
