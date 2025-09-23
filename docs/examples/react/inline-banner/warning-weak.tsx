import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWarningWeak() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner
        variant="warningWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="warningWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="warningWeak"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </VStack>
  );
}
