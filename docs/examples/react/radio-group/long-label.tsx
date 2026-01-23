import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupLongLabel() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="medium" aria-label="Long label options">
        <RadioGroupItem
          value="medium"
          size="medium"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
        <RadioGroupItem
          value="large"
          size="large"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
      </RadioGroup>
    </VStack>
  );
}
