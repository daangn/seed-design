import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxNeutral() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Neutral tone examples">
        <Checkbox
          label="Square (default)"
          variant="square"
          tone="neutral"
          size="large"
          defaultChecked
        />
        <Checkbox label="Ghost" variant="ghost" tone="neutral" size="large" defaultChecked />
      </CheckboxGroup>
    </VStack>
  );
}
