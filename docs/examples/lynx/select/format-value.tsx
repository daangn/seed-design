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
  { value: "apple", textValue: "사과", label: "사과 · 달콤한 맛" },
  { value: "banana", textValue: "바나나", label: "바나나 · 부드러운 맛" },
  { value: "cherry", textValue: "체리", label: "체리 · 새콤한 맛" },
];

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <view className="select-example">
        <SelectRoot
          options={FRUIT_OPTIONS}
          multiple
          defaultValue={["apple", "banana"]}
          formatValue={(selectedOptions) =>
            `선택: ${selectedOptions.map((option) => option.textValue).join(", ")} · 총 ${selectedOptions.length}개`
          }
        >
          <SelectTrigger placeholder="과일 선택" accessibility-label="과일" />
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
