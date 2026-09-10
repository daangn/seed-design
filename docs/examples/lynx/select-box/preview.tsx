import "./styles";

import { root } from "@lynx-js/react";
import { HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "@/components/ui/select-box";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack className="select-box-preview" gap="x6" align="flex-start">
        <VStack className="select-box-preview__column">
          <CheckSelectBoxGroup accessibility-label="Fruit">
            <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
            <CheckSelectBox
              label="Melon"
              description="Elit cupidatat dolore fugiat enim veniam culpa."
              suffix={<CheckSelectBoxCheckmark />}
            />
            <CheckSelectBox label="Mango" suffix={<CheckSelectBoxCheckmark />} />
          </CheckSelectBoxGroup>
        </VStack>

        <VStack className="select-box-preview__column">
          <RadioSelectBoxRoot defaultValue="apple" accessibility-label="Fruit">
            <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
            <RadioSelectBoxItem
              value="melon"
              label="Melon"
              description="Elit cupidatat dolore fugiat enim veniam culpa."
              suffix={<RadioSelectBoxRadiomark />}
            />
            <RadioSelectBoxItem value="mango" label="Mango" suffix={<RadioSelectBoxRadiomark />} />
          </RadioSelectBoxRoot>
        </VStack>
      </HStack>
    </page>
  );
}

root.render(<Root />);
