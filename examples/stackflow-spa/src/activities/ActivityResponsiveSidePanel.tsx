import { Flex, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveSidePanelBody,
  ResponsiveSidePanelContent,
  ResponsiveSidePanelFooter,
  ResponsiveSidePanelRoot,
} from "seed-design/ui/responsive-side-panel";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

declare module "@stackflow/config" {
  interface Register {
    ActivityResponsiveSidePanel: {};
  }
}

const ActivityResponsiveSidePanel: StaticActivityComponentType<
  "ActivityResponsiveSidePanel"
> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

  const open = activity.isActive;
  const onOpenChange = (open: boolean) => !open && pop();

  return (
    <ResponsiveSidePanelRoot open={open} onOpenChange={onOpenChange} size={size}>
      <ResponsiveSidePanelContent
        title="Responsive Side Panel"
        description="md 이상에서는 Side Panel, sm 이하에서는 Bottom Sheet로 표시됩니다. 뷰포트를 줄여서 자동 전환을 확인해보세요."
        layerIndex={useActivityZIndexBase()}
      >
        <ResponsiveSidePanelBody>
          <VStack gap="x4">
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
        </ResponsiveSidePanelBody>
        <ResponsiveSidePanelFooter>
          <Flex gap="x2">
            <ActionButton variant="neutralWeak" flexGrow onClick={() => pop()}>
              닫기
            </ActionButton>
            <ActionButton variant="neutralSolid" flexGrow>
              확인
            </ActionButton>
          </Flex>
        </ResponsiveSidePanelFooter>
      </ResponsiveSidePanelContent>
    </ResponsiveSidePanelRoot>
  );
};

export default ActivityResponsiveSidePanel;
