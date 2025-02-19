import { IconBellFill } from "@daangn/react-monochrome-icon";
import { Stack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerWithIcon() {
  return (
    <Stack gap="x4" width="full">
      <InlineBanner prefixIcon={<IconBellFill />} description="사업자 정보를 등록해주세요." />
      <ActionableInlineBanner
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
      <DismissibleInlineBanner
        prefixIcon={<IconBellFill />}
        description="사업자 정보를 등록해주세요."
      />
    </Stack>
  );
}
