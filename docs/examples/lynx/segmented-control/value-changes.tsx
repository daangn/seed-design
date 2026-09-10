import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("hot");

  function handleValueChange(nextValue: string) {
    "background only";
    setValue(nextValue);
  }

  return (
    <page className={seedClassName}>
      <view className="segmented-control-example">
        <SegmentedControl
          value={value}
          onValueChange={handleValueChange}
          accessibility-label="정렬 기준"
        >
          <SegmentedControlItem value="hot">인기순</SegmentedControlItem>
          <SegmentedControlItem value="new">최신순</SegmentedControlItem>
        </SegmentedControl>
        <text className="segmented-control-example__status">선택값: {value}</text>
      </view>
    </page>
  );
}

root.render(<Root />);
