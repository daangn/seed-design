import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { ResidentNumberField } from "@/components/ui/resident-number-field";

export default function Example() {
  return (
    <VStack className="segmented-text-input-preview" gap="spacingY.componentDefault">
      <ResidentNumberField label="주민등록번호" description="digits=6" digits={6} />
      <ResidentNumberField label="주민등록번호" description="digits=7 (default)" digits={7} />
      <ResidentNumberField label="주민등록번호" description="digits=13" digits={13} />
    </VStack>
  );
}
