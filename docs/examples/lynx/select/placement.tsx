import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

const FRUIT_OPTIONS = [
  { value: "apple", textValue: "사과" },
  { value: "banana", textValue: "바나나" },
  { value: "cherry", textValue: "체리" },
];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="select-example">
        <SelectRoot options={FRUIT_OPTIONS} defaultValue={["apple"]}>
          <SelectTrigger placeholder="과일 선택" accessibility-label="과일" />
          <SelectContent
            positionerProps={{
              placement: "top-start",
              placementOffset: 12,
              autoAdjust: "size",
            }}
          >
            <SelectGroup>
              {FRUIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} />
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </view>
    </page>
  );
}

root.render(<Root />);
