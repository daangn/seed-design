import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectGroups() {
  return (
    <Box width="240px">
      <SelectRoot defaultValue={["seoul"]}>
        <SelectTrigger aria-label="지역" placeholder="지역 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>수도권</SelectGroupLabel>
            <SelectItem value="seoul" label="서울" />
            <SelectItem value="incheon" label="인천" />
            <SelectItem value="gyeonggi" label="경기" />
          </SelectGroup>
          <SelectGroup>
            <SelectGroupLabel>영남권</SelectGroupLabel>
            <SelectItem value="busan" label="부산" />
            <SelectItem value="daegu" label="대구" />
            <SelectItem value="ulsan" label="울산" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
