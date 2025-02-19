import { Stack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerTextOnly() {
  return (
    <Stack gap="x4" width="full">
      <InlineBanner description="사업자 정보를 등록해주세요." />
      <ActionableInlineBanner description="사업자 정보를 등록해주세요." />
      <DismissibleInlineBanner description="사업자 정보를 등록해주세요." />
    </Stack>
  );
}
