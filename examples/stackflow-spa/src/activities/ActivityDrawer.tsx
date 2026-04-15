import { Flex, VStack } from "@seed-design/react";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { DrawerBody, DrawerContent, DrawerFooter, DrawerRoot } from "seed-design/ui/drawer";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

declare module "@stackflow/config" {
  interface Register {
    ActivityDrawer: {};
  }
}

const ActivityDrawer: StaticActivityComponentType<"ActivityDrawer"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [direction, setDirection] = useState<"left" | "right" | "bottom" | "top">("right");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");

  const open = activity.isActive;
  const onOpenChange = (open: boolean) => !open && pop();

  return (
    <DrawerRoot open={open} onOpenChange={onOpenChange} direction={direction} size={size}>
      <DrawerContent title="Drawer" description="Drawer 컴포넌트 데모입니다.">
        <DrawerBody>
          <VStack gap="x4">
            <VStack gap="x2">
              <SegmentedControl
                value={direction}
                onValueChange={(v) => setDirection(v as "left" | "right" | "bottom" | "top")}
              >
                <SegmentedControlItem value="left">Left</SegmentedControlItem>
                <SegmentedControlItem value="right">Right</SegmentedControlItem>
                <SegmentedControlItem value="bottom">Bottom</SegmentedControlItem>
                <SegmentedControlItem value="top">Top</SegmentedControlItem>
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
        </DrawerBody>
        <DrawerFooter>
          <Flex gap="x2">
            <ActionButton variant="neutralWeak" flexGrow onClick={() => pop()}>
              닫기
            </ActionButton>
            <ActionButton variant="neutralSolid" flexGrow>
              확인
            </ActionButton>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default ActivityDrawer;
