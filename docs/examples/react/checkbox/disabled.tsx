import { VStack } from "@seed-design/react";
import { Checkbox } from "seed-design/ui/checkbox";

export default function CheckboxDisabled() {
  return (
    <VStack gap="x2">
      <Checkbox defaultChecked label="Disabled Checked, Square" disabled />
      <Checkbox checked={false} label="Disabled without Checked, Square" disabled />
      <Checkbox variant="ghost" defaultChecked label="Disabled Checked, Ghost" disabled />
      <Checkbox variant="ghost" checked={false} label="Disabled without Checked, Ghost" disabled />
    </VStack>
  );
}
