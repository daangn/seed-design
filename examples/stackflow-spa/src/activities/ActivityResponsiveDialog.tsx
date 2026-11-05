import { Flex, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import {
  ResponsiveDialogAction,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogRoot,
} from "seed-design/ui/responsive-dialog";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

declare module "@stackflow/config" {
  interface Register {
    ActivityResponsiveDialog: {};
  }
}

const ActivityResponsiveDialog: StaticActivityComponentType<"ActivityResponsiveDialog"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();

  const [size, setSize] = useState<"medium" | "large">("medium");

  const open = activity.isActive;
  const onOpenChange = (open: boolean) => !open && pop();

  return (
    <ResponsiveDialogRoot open={open} onOpenChange={onOpenChange} dialogRootProps={{ size }}>
      <ResponsiveDialogContent
        title="Responsive Dialog"
        description="md 이상에서는 Dialog, sm 이하에서는 Bottom Sheet로 표시됩니다. 뷰포트를 줄여서 자동 전환을 확인해보세요."
        layerIndex={useActivityZIndexBase()}
      >
        <ResponsiveDialogBody>
          <VStack gap="x2">
            <SegmentedControl
              aria-label="다이얼로그 크기"
              value={size}
              onValueChange={(v) => setSize(v as "medium" | "large")}
              style={{ width: "100%" }}
            >
              <SegmentedControlItem value="medium">Medium</SegmentedControlItem>
              <SegmentedControlItem value="large">Large</SegmentedControlItem>
            </SegmentedControl>
          </VStack>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <Flex gap="x2">
            <ResponsiveDialogAction variant="neutralWeak" flexGrow>
              취소
            </ResponsiveDialogAction>
            <ResponsiveDialogAction variant="neutralSolid" flexGrow>
              확인
            </ResponsiveDialogAction>
          </Flex>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  );
};

export default ActivityResponsiveDialog;
