import { IconExclamationmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Stack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWarningSolid() {
  return (
    <Stack gap="x4" width="full">
      <InlineBanner
        variant="warningSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="warningSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="warningSolid"
        prefixIcon={<IconExclamationmarkCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </Stack>
  );
}
