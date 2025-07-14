import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="apple" aria-label="Fruit selection">
      <VStack>
        <RadioGroupItem value="apple" label="Apple" />
        <RadioGroupItem value="banana" label="Banana" />
        <RadioGroupItem value="orange" label="Orange" />
      </VStack>
    </RadioGroup>
  );
}
