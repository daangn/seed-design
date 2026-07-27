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
            <SelectGroupLabel>아시아</SelectGroupLabel>
            <SelectItem value="seoul" label="서울" />
            <SelectItem value="tokyo" label="도쿄" />
            <SelectItem value="singapore" label="싱가포르" />
            <SelectItem value="dubai" label="두바이" />
          </SelectGroup>
          <SelectGroup>
            <SelectGroupLabel>유럽</SelectGroupLabel>
            <SelectItem value="london" label="런던" />
            <SelectItem value="paris" label="파리" />
            <SelectItem value="berlin" label="베를린" />
          </SelectGroup>
          <SelectGroup>
            <SelectGroupLabel>아메리카</SelectGroupLabel>
            <SelectItem value="new-york" label="뉴욕" />
            <SelectItem value="sao-paulo" label="상파울루" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
