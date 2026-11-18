import { Box } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

export default function Example() {
  return (
    <Box width="full">
      <SelectRoot defaultValue={["seoul"]}>
        <SelectTrigger accessibility-label="지역" placeholder="지역 선택" />
        <SelectContent>
          <SelectGroup label="아시아">
            <SelectItem value="seoul" label="서울" />
            <SelectItem value="tokyo" label="도쿄" />
            <SelectItem value="singapore" label="싱가포르" />
            <SelectItem value="dubai" label="두바이" />
          </SelectGroup>
          <SelectGroup label="유럽">
            <SelectItem value="london" label="런던" />
            <SelectItem value="paris" label="파리" />
            <SelectItem value="berlin" label="베를린" />
          </SelectGroup>
          <SelectGroup label="아메리카">
            <SelectItem value="new-york" label="뉴욕" />
            <SelectItem value="sao-paulo" label="상파울루" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
