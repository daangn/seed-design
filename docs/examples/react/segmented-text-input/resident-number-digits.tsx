import { VStack } from "@seed-design/react";
import { ResidentNumberField } from "seed-design/ui/resident-number-field";

export default function SegmentedTextInputResidentNumberDigits() {
  return (
    <VStack width="358px" maxWidth="100%" gap="spacingY.componentDefault">
      <ResidentNumberField label="주민등록번호" description="digits=6" digits={6} />
      <ResidentNumberField label="주민등록번호" description="digits=7 (default)" digits={7} />
      <ResidentNumberField label="주민등록번호" description="digits=13" digits={13} />
    </VStack>
  );
}
