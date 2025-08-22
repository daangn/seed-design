import { IconCalendarFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableCallout, Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutWarning() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        tone="warning"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <ActionableCallout
        tone="warning"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
      <DismissibleCallout
        tone="warning"
        prefixIcon={<IconCalendarFill />}
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
      />
    </VStack>
  );
}
