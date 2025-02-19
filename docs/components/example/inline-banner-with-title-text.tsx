import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";
import { Stack } from "@seed-design/react";

export default function InlineBannerWithTitleText() {
  return (
    <Stack gap="x4" width="full">
      <InlineBanner title="타이틀" description="사업자 정보를 등록해주세요." />
      <ActionableInlineBanner title="타이틀" description="사업자 정보를 등록해주세요." />
      <DismissibleInlineBanner title="타이틀" description="사업자 정보를 등록해주세요." />
    </Stack>
  );
}
