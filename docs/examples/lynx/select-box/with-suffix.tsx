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

const price = <text className="select-box-preview__suffix">+1,000원</text>;

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <view className="select-box-preview select-box-preview__row">
        <CheckSelectBoxGroup className="select-box-preview__column">
          <CheckSelectBox label="체크마크" suffix={<CheckSelectBoxCheckmark />} />
          <CheckSelectBox label="텍스트 suffix" suffix={price} />
          <CheckSelectBox label="suffix 없음" description="Commodo aliquip fugiat aute irure." />
        </CheckSelectBoxGroup>
        <RadioSelectBoxRoot className="select-box-preview__column" defaultValue="radiomark">
          <RadioSelectBoxItem
            value="radiomark"
            label="라디오 마크"
            suffix={<RadioSelectBoxRadiomark />}
          />
          <RadioSelectBoxItem
            value="text"
            label="텍스트 suffix"
            description="Commodo aliquip fugiat aute irure."
            suffix={price}
          />
          <RadioSelectBoxItem value="none" label="suffix 없음" />
        </RadioSelectBoxRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
