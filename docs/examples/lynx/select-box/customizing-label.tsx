import "./styles";

import { root } from "@lynx-js/react";
import { Badge, useSeedClassName } from "@seed-design/lynx-react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "@/components/ui/select-box";

function NewBadge() {
  return (
    <Badge tone="brand" variant="solid">
      New
    </Badge>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="select-box-preview select-box-preview__row">
        <CheckSelectBoxGroup className="select-box-preview__column">
          <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
          <CheckSelectBox
            label="Melon"
            labelAccessory={<NewBadge />}
            description="Elit cupidatat dolore fugiat enim veniam culpa."
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            label="Mango"
            description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
            suffix={<CheckSelectBoxCheckmark />}
          />
        </CheckSelectBoxGroup>
        <RadioSelectBoxRoot className="select-box-preview__column" defaultValue="apple">
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem
            value="melon"
            label="Melon"
            labelAccessory={<NewBadge />}
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
      </view>
    </page>
  );
}

root.render(<Root />);
