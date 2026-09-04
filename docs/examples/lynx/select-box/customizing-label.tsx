import "./styles";

import { root } from "@lynx-js/react";
import { Badge, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
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
      <Badge.Root tone="brand" variant="solid">
        <Badge.Label>New</Badge.Label>
      </Badge.Root>
    </>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack className="select-box-preview" gap="x8" align="flex-start">
        <VStack className="select-box-preview__column">
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

        <VStack className="select-box-preview__column">
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
    </page>
  );
}

root.render(<Root />);
