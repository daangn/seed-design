import "./styles";

import { Box, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

const listFormat = new Intl.ListFormat("ko", { type: "conjunction" });

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-select-root`}>
      <VStack className="select-preview">
        <HStack width="full" gap="x4">
          <Box style={{ flex: 1 }}>
            <SelectRoot
              multiple
              defaultValue={["apple", "banana"]}
              formatValue={(items) => listFormat.format(items.map((item) => item.textValue))}
            >
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
          <Box style={{ flex: 1 }}>
            <SelectRoot
              multiple
              defaultValue={["apple", "banana", "cherry"]}
              formatValue={([first, ...rest]) =>
                rest.length > 0 ? `${first?.textValue ?? ""} 외 ${rest.length}개` : first?.textValue
              }
            >
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
        </HStack>
      </VStack>
    </view>
  );
}
