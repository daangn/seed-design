import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectWithDescription() {
  return (
    <Box width="280px">
      <SelectRoot defaultValue={["standard"]}>
        <SelectTrigger aria-label="배송 방법" placeholder="배송 방법 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="standard" label="일반 배송" description="3-5일 소요" />
            <SelectItem value="express" label="빠른 배송" description="1-2일 소요" />
            <SelectItem value="same-day" label="당일 배송" description="오늘 도착" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
