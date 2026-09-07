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
  { value: "banana", textValue: "바나나", disabled: true },
  { value: "cherry", textValue: "체리" },
];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="select-example select-example__stack">
        <SelectRoot options={FRUIT_OPTIONS} defaultValue={["apple"]} disabled>
          <SelectTrigger placeholder="과일 선택" accessibility-label="비활성 과일" />
          <SelectContent>
            <SelectGroup>
              {FRUIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} />
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectRoot>

        <SelectRoot options={FRUIT_OPTIONS} defaultValue={["apple"]} readOnly>
          <SelectTrigger placeholder="과일 선택" accessibility-label="읽기 전용 과일" />
          <SelectContent>
            <SelectGroup>
              {FRUIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} />
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectRoot>

        <SelectRoot options={FRUIT_OPTIONS} defaultValue={["apple"]}>
          <SelectTrigger placeholder="과일 선택" accessibility-label="일부 비활성 과일" />
          <SelectContent>
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
