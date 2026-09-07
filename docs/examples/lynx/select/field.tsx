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
      <view className="select-example select-example__stack">
        <SelectRoot
          options={FRUIT_OPTIONS}
          label="과일"
          labelWeight="bold"
          description="가장 좋아하는 과일을 선택하세요."
          required
          showRequiredIndicator
          defaultValue={["apple"]}
        >
          <SelectTrigger placeholder="과일 선택" />
          <SelectContent>
            <SelectGroup>
              {FRUIT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} />
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectRoot>

        <SelectRoot
          options={FRUIT_OPTIONS}
          label="과일"
          required
          showRequiredIndicator
          invalid
          errorMessage="과일을 선택해주세요."
        >
          <SelectTrigger placeholder="과일 선택" />
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
