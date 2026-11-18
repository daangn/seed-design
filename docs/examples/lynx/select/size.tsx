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
        <SelectRoot size="large" defaultValue={["apple"]}>
          <SelectTrigger accessibility-label="과일 (large)" placeholder="과일 선택" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple" label="사과" />
              <SelectItem value="banana" label="바나나" />
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </Box>
      <Box width="full">
        <SelectRoot size="medium" defaultValue={["apple"]}>
          <SelectTrigger accessibility-label="과일 (medium)" placeholder="과일 선택" />
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
