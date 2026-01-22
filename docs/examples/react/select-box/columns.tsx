import { IconDiamond, IconIcecreamcone } from "@karrotmarket/react-multicolor-icon";
import { VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxColumns() {
  return (
    <VStack gap="x8" p="x4">
      <CheckSelectBoxGroup columns={2} aria-label="Grid 레이아웃 예제">
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          label="옵션 1"
          description="layout=vertical"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          label="옵션 2"
          description="layout=vertical"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          defaultChecked
          layout="horizontal"
          label="layout=horizontal"
          description="layout을 horizontal로 오버라이드"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          label="옵션 4"
          description="layout=vertical"
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot columns={3} defaultValue="option3" aria-label="Grid 레이아웃 예제">
        <RadioSelectBoxItem
          value="option1"
          prefixIcon={<IconDiamond />}
          label="옵션 1"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option2"
          prefixIcon={<IconDiamond />}
          label="옵션 2"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option3"
          prefixIcon={<IconDiamond />}
          label="layout=horizontal"
          description="layout을 horizontal로 오버라이드"
          layout="horizontal"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option4"
          prefixIcon={<IconDiamond />}
          label="옵션 4"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option5"
          prefixIcon={<IconDiamond />}
          label="옵션 5"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option6"
          prefixIcon={<IconDiamond />}
          label="옵션 6"
          suffix={<RadioSelectBoxRadiomark />}
        />
      </RadioSelectBoxRoot>
    </VStack>
  );
}
