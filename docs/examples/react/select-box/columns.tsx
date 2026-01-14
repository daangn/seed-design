import { IconDiamond, IconIcecreamcone } from "@karrotmarket/react-multicolor-icon";
import { Box, HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxColumns() {
  return (
    <HStack gap="x6" align="flex-start" width="full">
      <Box flexGrow>
        <CheckSelectBoxGroup columns={2}>
          <CheckSelectBox
            prefixIcon={<IconIcecreamcone />}
            label="옵션 1"
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            prefixIcon={<IconIcecreamcone />}
            label="옵션 2"
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            prefixIcon={<IconIcecreamcone />}
            label="옵션 3"
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            prefixIcon={<IconIcecreamcone />}
            label="옵션 4"
            suffix={<CheckSelectBoxCheckmark />}
          />
        </CheckSelectBoxGroup>
      </Box>

      <Box flexGrow>
        <RadioSelectBoxRoot columns={3} defaultValue="option1" aria-label="Grid 레이아웃 예제">
          <RadioSelectBoxItem
            value="option1"
            prefixIcon={<IconDiamond />}
            label="옵션 1"
            suffix={<RadioSelectBoxRadioMark />}
          />
          <RadioSelectBoxItem
            value="option2"
            prefixIcon={<IconDiamond />}
            label="옵션 2"
            suffix={<RadioSelectBoxRadioMark />}
          />
          <RadioSelectBoxItem
            value="option3"
            prefixIcon={<IconDiamond />}
            label="옵션 3"
            suffix={<RadioSelectBoxRadioMark />}
          />
          <RadioSelectBoxItem
            value="option4"
            prefixIcon={<IconDiamond />}
            label="옵션 4"
            suffix={<RadioSelectBoxRadioMark />}
          />
          <RadioSelectBoxItem
            value="option5"
            prefixIcon={<IconDiamond />}
            label="옵션 5"
            suffix={<RadioSelectBoxRadioMark />}
          />
          <RadioSelectBoxItem
            value="option6"
            prefixIcon={<IconDiamond />}
            label="옵션 6"
            suffix={<RadioSelectBoxRadioMark />}
          />
        </RadioSelectBoxRoot>
      </Box>
    </HStack>
  );
}
