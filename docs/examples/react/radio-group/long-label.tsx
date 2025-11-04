import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupLongLabel() {
  return (
    <VStack gap="x2">
      <RadioGroup defaultValue="medium">
        <RadioGroupItem
          value="medium"
          size="medium"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
        <RadioGroupItem
          value="large"
          size="large"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
      </RadioGroup>
    </VStack>
  );
}
