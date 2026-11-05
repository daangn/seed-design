import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { CardNumberField } from "@/components/ui/card-number-field";

export default function Example() {
  return (
    <VStack className="segmented-text-input-preview" gap="spacingY.componentDefault">
      <CardNumberField label="카드번호" description="size=large (default)" size="large" />
      <CardNumberField label="카드번호" description="size=medium" size="medium" />
    </VStack>
  );
}
