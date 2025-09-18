import { IconCheckmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerPositiveWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="positiveWeak"
        prefixIcon={<IconCheckmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="positiveWeak"
        prefixIcon={<IconCheckmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="positiveWeak"
        prefixIcon={<IconCheckmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
