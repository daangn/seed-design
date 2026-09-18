import "./styles";

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
  return (
    <view className={`${seedClassName} docs-lynx-select-root`}>
      <VStack className="select-preview" gap="x4">
        <Box width="240px">
          <SelectRoot defaultValue={["apple"]}>
            <SelectTrigger accessibility-label="과일" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple" label="사과" />
                <SelectItem value="banana" label="바나나" disabled />
                <SelectItem value="cherry" label="체리" />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
        <Box width="240px">
          <SelectRoot disabled defaultValue={["apple"]}>
            <SelectTrigger accessibility-label="비활성 과일" placeholder="과일 선택" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple" label="사과" />
                <SelectItem value="banana" label="바나나" />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
      </VStack>
    </view>
  );
}
