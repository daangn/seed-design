import { HStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxSize() {
  return (
    <HStack gap="x8" p="x6">
      <CheckboxGroup aria-label="Square size examples">
        <Checkbox label="Medium (default)" size="medium" defaultChecked tone="neutral" />
        <Checkbox label="Large" size="large" defaultChecked tone="neutral" />
      </CheckboxGroup>
      <CheckboxGroup aria-label="Ghost size examples">
        <Checkbox
          label="Medium (default)"
          size="medium"
          variant="ghost"
          defaultChecked
          tone="neutral"
        />
        <Checkbox label="Large" size="large" variant="ghost" defaultChecked tone="neutral" />
      </CheckboxGroup>
    </HStack>
  );
}
