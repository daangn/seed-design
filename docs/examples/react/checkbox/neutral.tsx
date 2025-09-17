import { VStack } from "@seed-design/react";
import { Checkbox } from "@/registry/ui/checkbox";

export default function CheckboxNeutral() {
  return (
    <VStack gap="x2">
      <Checkbox label="Square (default)" variant="square" tone="neutral" defaultChecked />
      <Checkbox label="Ghost" variant="ghost" tone="neutral" defaultChecked />
    </VStack>
  );
}
