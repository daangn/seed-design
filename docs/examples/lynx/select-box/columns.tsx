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
      <view className="select-box-preview">
        <CheckSelectBoxGroup columns="2">
          <CheckSelectBox
            label="옵션 1"
            description="layout=vertical"
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            label="옵션 2"
            description="layout=vertical"
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            label="layout=horizontal"
            description="layout을 horizontal로 오버라이드"
            layout="horizontal"
            defaultChecked
            suffix={<CheckSelectBoxCheckmark />}
          />
          <CheckSelectBox
            label="옵션 4"
            description="layout=vertical"
            suffix={<CheckSelectBoxCheckmark />}
          />
        </CheckSelectBoxGroup>
        <RadioSelectBoxRoot columns="2" defaultValue="option3">
          <RadioSelectBoxItem value="option1" label="옵션 1" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem value="option2" label="옵션 2" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem
            value="option3"
            label="layout=horizontal"
            description="layout을 horizontal로 오버라이드"
            layout="horizontal"
            suffix={<RadioSelectBoxRadiomark />}
          />
          <RadioSelectBoxItem value="option4" label="옵션 4" suffix={<RadioSelectBoxRadiomark />} />
        </RadioSelectBoxRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
