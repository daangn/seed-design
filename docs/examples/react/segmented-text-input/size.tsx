import { VStack } from "@seed-design/react";
import { CardNumberField } from "seed-design/ui/card-number-field";

export default function SegmentedTextInputSize() {
  return (
    <VStack width="358px" maxWidth="100%" gap="spacingY.componentDefault">
      <CardNumberField label="카드번호" description="size=large (default)" size="large" />
      <CardNumberField label="카드번호" description="size=medium" size="medium" />
    </VStack>
  );
}
