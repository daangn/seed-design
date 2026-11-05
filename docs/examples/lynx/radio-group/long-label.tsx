import "./styles";

import { VStack } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const longLabel =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

export default function Example() {
  return (
    <VStack className="radio-group-preview">
      <RadioGroup accessibility-label="Long label options" defaultValue="medium">
        <RadioGroupItem value="medium" label={longLabel} size="medium" tone="neutral" />
        <RadioGroupItem value="large" label={longLabel} size="large" tone="neutral" />
      </RadioGroup>
    </VStack>
  );
}
