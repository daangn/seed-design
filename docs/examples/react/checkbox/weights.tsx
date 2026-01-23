import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxWeights() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Weight examples">
        <Checkbox label="Regular Label Text" weight="regular" tone="neutral" size="large" />
        <Checkbox label="Bold Label Text" weight="bold" tone="neutral" size="large" />
      </CheckboxGroup>
    </VStack>
  );
}
