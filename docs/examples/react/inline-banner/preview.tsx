import { VStack } from "@seed-design/react";
import {
  ActionableInlineBanner,
  DismissibleInlineBanner,
  InlineBanner,
} from "seed-design/ui/inline-banner";

export default function InlineBannerPreview() {
  return (
    <VStack gap="x4" width="full">
      <InlineBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
      <ActionableInlineBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
      <DismissibleInlineBanner description="Ut veniam in ea ea anim laborum magna dolore ea laborum duis ut aute mollit amet." />
    </VStack>
  );
}
