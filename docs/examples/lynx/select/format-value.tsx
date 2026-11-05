import { Box, HStack } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  return (
    <HStack width="full" gap="x4">
      <Box display="flex" flexDirection="column" flexGrow flexShrink style={{ flexBasis: 0 }}>
        <SelectRoot
          multiple
          defaultValue={["apple", "banana"]}
          formatValue={(items) => items.map((item) => item.textValue).join(", ")}
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
      <Box display="flex" flexDirection="column" flexGrow flexShrink style={{ flexBasis: 0 }}>
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
  );
}
