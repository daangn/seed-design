import { VStack } from "@seed-design/react";
import { Checkbox } from "seed-design/ui/checkbox";

export default function CheckboxBrand() {
  return (
    <VStack gap="x2">
      <Checkbox label="Square (default)" variant="square" tone="brand" defaultChecked />
      <Checkbox label="Ghost" variant="ghost" tone="brand" defaultChecked />
    </VStack>
  );
}
