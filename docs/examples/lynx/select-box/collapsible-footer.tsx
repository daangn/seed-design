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

function Footer({ children }: { children: string }) {
  return (
    <view className="select-box-preview__footer">
      <text className="select-box-preview__footer-text">{children}</text>
    </view>
  );
}

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="select-box-preview select-box-preview__row">
        <CheckSelectBoxGroup className="select-box-preview__column">
          <CheckSelectBox
            label="선택 시에만 표시 (기본값)"
            description="footerVisibility='when-selected'"
            suffix={<CheckSelectBoxCheckmark />}
            footer={<Footer>선택되었을 때만 보입니다.</Footer>}
          />
          <CheckSelectBox
            label="항상 표시"
            description="footerVisibility='always'"
            suffix={<CheckSelectBoxCheckmark />}
            footerVisibility="always"
            footer={<Footer>항상 보입니다.</Footer>}
          />
          <CheckSelectBox
            label="미선택 시에만 표시"
            description="footerVisibility='when-not-selected'"
            suffix={<CheckSelectBoxCheckmark />}
            footerVisibility="when-not-selected"
            footer={<Footer>선택되지 않았을 때만 보입니다.</Footer>}
          />
        </CheckSelectBoxGroup>
        <RadioSelectBoxRoot className="select-box-preview__column" defaultValue="when-selected">
          <RadioSelectBoxItem
            value="when-selected"
            label="선택 시에만 표시 (기본값)"
            description="footerVisibility='when-selected'"
            suffix={<RadioSelectBoxRadiomark />}
            footer={<Footer>선택되었을 때만 보입니다.</Footer>}
          />
          <RadioSelectBoxItem
            value="always"
            label="항상 표시"
            description="footerVisibility='always'"
            suffix={<RadioSelectBoxRadiomark />}
            footerVisibility="always"
            footer={<Footer>항상 보입니다.</Footer>}
          />
          <RadioSelectBoxItem
            value="when-not-selected"
            label="미선택 시에만 표시"
            description="footerVisibility='when-not-selected'"
            suffix={<RadioSelectBoxRadiomark />}
            footerVisibility="when-not-selected"
            footer={<Footer>선택되지 않았을 때만 보입니다.</Footer>}
          />
        </RadioSelectBoxRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
