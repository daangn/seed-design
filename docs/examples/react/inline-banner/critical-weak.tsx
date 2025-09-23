import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import { ActionableInlineBanner, InlineBanner } from "seed-design/ui/inline-banner";

export default function InlineBannerCriticalWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="criticalWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="criticalWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
