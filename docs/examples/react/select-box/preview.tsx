import { HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxPreview() {
  return (
    <HStack gap="x6" align="flex-start">
      <CheckSelectBoxGroup aria-label="Fruit">
        <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox label="Mango" suffix={<CheckSelectBoxCheckmark />} />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="apple" aria-label="Fruit">
        <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
        <RadioSelectBoxItem
          value="melon"
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem value="mango" label="Mango" suffix={<RadioSelectBoxRadiomark />} />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
