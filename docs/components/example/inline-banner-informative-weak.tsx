import { IconILowercaseSerifCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Stack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerInformativeWeak() {
  return (
    <Stack gap="x4" width="full">
      <InlineBanner
        variant="informativeWeak"
        prefixIcon={<IconILowercaseSerifCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="informativeWeak"
        prefixIcon={<IconILowercaseSerifCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="informativeWeak"
        prefixIcon={<IconILowercaseSerifCircleFill />}
        description="사업자 정보를 등록해주세요."
      />
    </Stack>
  );
}
