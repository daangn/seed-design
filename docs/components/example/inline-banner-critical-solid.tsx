import { ActionableInlineBanner, InlineBanner } from "seed-design/ui/inline-banner";
import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";

export default function InlineBannerCriticalSolid() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="criticalSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="criticalSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
