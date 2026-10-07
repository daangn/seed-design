import "./styles";

import { HStack, VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "@/components/ui/select-box";

function CustomizedLabel() {
  return (
    <>
      <text>Melon</text>
      <Badge tone="brand" variant="solid">
        New
      </Badge>
    </>
  );
}

export default function Example() {
  return (
    <HStack className="select-box-preview" gap="x8" align="flex-start">
      <VStack className="select-box-preview__column" grow shrink style={{ flexBasis: 0 }}>
        <CheckSelectBoxGroup accessibility-label="Fruit">
          <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
          <CheckSelectBox
            accessibility-label="Melon New"
            label={<CustomizedLabel />}
            description="Elit cupidatat dolore fugiat enim veniam culpa."
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            label="Mango"
            description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
            suffix={<CheckSelectBoxCheckmark />}
          />
        </CheckSelectBoxGroup>
      </VStack>

      <VStack className="select-box-preview__column" grow shrink style={{ flexBasis: 0 }}>
        <RadioSelectBoxRoot defaultValue="apple" accessibility-label="Fruit">
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem
            value="melon"
            accessibility-label="Melon New"
            label={<CustomizedLabel />}
            description="Elit cupidatat dolore fugiat enim veniam culpa."
            suffix={<RadioSelectBoxRadiomark />}
          />
          <RadioSelectBoxItem
            value="mango"
            label="Mango"
            description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
            suffix={<RadioSelectBoxRadiomark />}
          />
        </RadioSelectBoxRoot>
      </VStack>
    </HStack>
  );
}
