import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { ResidentNumberField } from "@/components/ui/resident-number-field";

export default function Example() {
  return (
    <VStack className="segmented-text-input-preview" gap="spacingY.componentDefault">
      <ResidentNumberField label="Enabled" description="설명을 써주세요" />
      <ResidentNumberField
        label="Invalid"
        defaultValue={["931305", "1"]}
        invalid
        errorMessage="생년월일을 다시 확인해주세요"
      />
      <ResidentNumberField label="Disabled" defaultValue={["931205", "1"]} disabled />
      <ResidentNumberField label="Read Only" defaultValue={["931205", "1"]} readOnly />
    </VStack>
  );
}
