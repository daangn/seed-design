import { HStack, VStack } from "@seed-design/react";
import { Checkbox } from "@/registry/ui/checkbox";

export default function CheckboxSize() {
  return (
    <HStack gap="x8">
      <VStack gap="x2">
        <Checkbox label="Medium (default)" size="medium" defaultChecked />
        <Checkbox label="Large" size="large" defaultChecked />
      </VStack>
      <VStack gap="x2">
        <Checkbox label="Medium (default)" size="medium" variant="ghost" defaultChecked />
        <Checkbox label="Large" size="large" variant="ghost" defaultChecked />
      </VStack>
    </HStack>
  );
}
