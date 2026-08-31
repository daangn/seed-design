import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
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
      <view className="select-box-preview select-box-preview__row">
        <CheckSelectBoxGroup className="select-box-preview__column">
          <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
          <CheckSelectBox
            label="Melon"
            description="Elit cupidatat dolore fugiat enim veniam culpa."
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox label="Mango" suffix={<CheckSelectBoxCheckmark />} />
        </CheckSelectBoxGroup>
        <RadioSelectBoxRoot className="select-box-preview__column" defaultValue="apple">
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem
            value="melon"
            label="Melon"
            description="Elit cupidatat dolore fugiat enim veniam culpa."
            suffix={<RadioSelectBoxRadiomark />}
          />
          <RadioSelectBoxItem value="mango" label="Mango" suffix={<RadioSelectBoxRadiomark />} />
        </RadioSelectBoxRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
