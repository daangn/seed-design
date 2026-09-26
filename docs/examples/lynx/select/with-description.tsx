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
      <VStack className="select-preview">
        <Box width="280px">
          <SelectRoot defaultValue={["standard"]}>
            <SelectTrigger accessibility-label="배송 방법" placeholder="배송 방법 선택" />
            <SelectContent>
              <SelectGroup>
                <SelectItem value="standard" label="일반 배송" description="3-5일 소요" />
                <SelectItem value="express" label="빠른 배송" description="1-2일 소요" />
                <SelectItem value="same-day" label="당일 배송" description="오늘 도착" />
              </SelectGroup>
            </SelectContent>
          </SelectRoot>
        </Box>
      </VStack>
    </view>
  );
}
