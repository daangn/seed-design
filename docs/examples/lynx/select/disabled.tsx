import { Box, VStack } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  return (
    <VStack width="full" gap="x4">
      <Box width="full">
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
      <Box width="full">
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
  );
}
