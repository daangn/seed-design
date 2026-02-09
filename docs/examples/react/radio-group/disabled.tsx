import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupDisabled() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="option1" aria-label="Options with disabled">
        <RadioGroupItem value="option1" label="Active option" tone="neutral" size="large" />
        <RadioGroupItem
          value="option2"
          label="Disabled option"
          tone="neutral"
          size="large"
          disabled
        />
        <RadioGroupItem value="option3" label="Another active option" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
