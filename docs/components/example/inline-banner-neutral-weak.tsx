import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";
import { IconBellFill } from "@daangn/react-monochrome-icon";
import { Stack } from "@seed-design/react";

export default function InlineBannerNeutralWeak() {
  return (
    <Stack gap="x4" width="full">
      <InlineBanner
        variant="neutralWeak"
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
      <ActionableInlineBanner
        variant="neutralWeak"
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        variant="neutralWeak"
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
    </Stack>
  );
}
