import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option1" aria-label="Options with disabled">
      <VStack>
        <RadioGroupItem value="option1" label="Active option" />
        <RadioGroupItem value="option2" label="Disabled option" disabled />
        <RadioGroupItem value="option3" label="Another active option" />
      </VStack>
    </RadioGroup>
  );
}
