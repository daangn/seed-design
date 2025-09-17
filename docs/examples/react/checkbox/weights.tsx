import { VStack } from "@seed-design/react";
import { Checkbox } from "@/registry/ui/checkbox";

export default function CheckboxWeights() {
  return (
    <VStack gap="x4">
      <Checkbox label="Regular Label Text" weight="regular" />
      <Checkbox label="Bold Label Text" weight="bold" />
    </VStack>
  );
}
