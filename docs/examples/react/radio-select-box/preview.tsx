import { VStack } from "@seed-design/react";
import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";

export default function RadioSelectBoxPreview() {
  return (
    <RadioSelectBoxRoot defaultValue="apple" aria-label="Fruit">
      <VStack gap="spacingY.componentDefault">
        <RadioSelectBoxItem value="apple" label="Apple" />
        <RadioSelectBoxItem
          value="melon"
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
        />
        <RadioSelectBoxItem value="mango" label="Mango" />
      </VStack>
    </RadioSelectBoxRoot>
  );
}
