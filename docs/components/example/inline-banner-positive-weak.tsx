import { IconCheckmarkCircleFill } from "@daangn/react-monochrome-icon";
import { Stack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerPositiveWeak() {
  return (
    <Stack gap="x4" width="full">
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
    </Stack>
  );
}
