import "./styles";

import { useState } from "@lynx-js/react";
import { Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState<string[]>(["apple"]);
  return (
    <view className={`${seedClassName} docs-lynx-select-root`}>
      <VStack className="select-preview" gap="x2">
        <Box width="240px">
          <SelectRoot value={value} onValueChange={setValue}>
            <SelectTrigger accessibility-label="과일" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple" label="사과" />
                <SelectItem value="banana" label="바나나" />
                <SelectItem value="cherry" label="체리" />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
        <text className="select-preview__status">
          선택된 값: {value.length > 0 ? value.join(", ") : "없음"}
        </text>
      </VStack>
    </view>
  );
}
