import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectMultiple() {
  return (
    <Box width="240px">
      <SelectRoot multiple defaultValue={["apple", "cherry"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
            <SelectItem value="grape" label="포도" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
