import "./styles";

import { root, useState } from "@lynx-js/react";
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
  const [open, setOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    "background only";
    setOpen(nextOpen);
  }

  return (
    <page className={seedClassName}>
      <view className="select-example select-example__stack">
        <SelectRoot
          options={FRUIT_OPTIONS}
          defaultValue={["apple"]}
          open={open}
          onOpenChange={handleOpenChange}
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
        <text className="select-example__status">목록 상태: {open ? "열림" : "닫힘"}</text>
      </view>
    </page>
  );
}

root.render(<Root />);
