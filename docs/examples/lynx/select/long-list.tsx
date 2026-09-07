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

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  const textValue = `${hour}:${minute}`;

  return { value: textValue, textValue };
});

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="select-example">
        <SelectRoot options={TIME_OPTIONS} defaultValue={["14:00"]}>
          <SelectTrigger placeholder="시간 선택" accessibility-label="예약 시간" />
          <SelectContent>
            <SelectGroup label="예약 가능 시간">
              {TIME_OPTIONS.map((option) => (
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
