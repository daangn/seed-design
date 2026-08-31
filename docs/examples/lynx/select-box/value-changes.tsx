import "./styles";

import { root, useState } from "@lynx-js/react";
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
  const [checkCount, setCheckCount] = useState(0);
  const [checkLastValue, setCheckLastValue] = useState<boolean | null>(null);
  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);
  return (
    <page className={seedClassName}>
      <view className="select-box-preview select-box-preview__row">
        <view className="select-box-preview__column">
          <CheckSelectBoxGroup>
            <CheckSelectBox
              label="Apple"
              suffix={<CheckSelectBoxCheckmark />}
              onCheckedChange={(checked) => {
                setCheckCount((previous) => previous + 1);
                setCheckLastValue(checked);
              }}
            />
          </CheckSelectBoxGroup>
          <text className="select-box-preview__status">
            onCheckedChange called: {checkCount} times, last value:{" "}
            {checkLastValue === null ? "-" : JSON.stringify(checkLastValue)}
          </text>
        </view>
        <view className="select-box-preview__column">
          <RadioSelectBoxRoot
            defaultValue="apple"
            onValueChange={(value) => {
              setRadioCount((previous) => previous + 1);
              setRadioLastValue(value);
            }}
          >
            <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
            <RadioSelectBoxItem
              value="banana"
              label="Banana"
              suffix={<RadioSelectBoxRadiomark />}
            />
          </RadioSelectBoxRoot>
          <text className="select-box-preview__status">
            onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
          </text>
        </view>
      </view>
    </page>
  );
}

root.render(<Root />);
