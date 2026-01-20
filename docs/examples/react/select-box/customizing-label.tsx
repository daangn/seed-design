import { Badge, HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxCustomizingLabel() {
  return (
    <HStack gap="x8" align="flex-start" p="x4">
      <CheckSelectBoxGroup>
        <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label={
            <>
              Melon
              <Badge tone="brand" variant="solid">
                New
              </Badge>
            </>
          }
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          label="Mango"
          description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="apple" aria-label="Fruit">
        <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadioMark />} />
        <RadioSelectBoxItem
          value="melon"
          label={
            <>
              Melon
              <Badge tone="brand" variant="solid">
                New
              </Badge>
            </>
          }
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<RadioSelectBoxRadioMark />}
        />
        <RadioSelectBoxItem
          value="mango"
          label="Mango"
          description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
          suffix={<RadioSelectBoxRadioMark />}
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
