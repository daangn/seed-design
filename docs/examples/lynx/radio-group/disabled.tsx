import "./styles";

import { VStack } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  return (
    <VStack className="radio-group-preview">
      <RadioGroup accessibility-label="Options with disabled" defaultValue="option1">
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
