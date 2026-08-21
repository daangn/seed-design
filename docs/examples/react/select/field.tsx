import { VStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectField() {
  return (
    <VStack gap="x6" width="240px">
      <SelectRoot
        label="과일"
        description="가장 좋아하는 과일을 선택하세요."
        defaultValue={["apple"]}
      >
        <SelectTrigger placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot label="과일" labelWeight="bold" invalid errorMessage="과일을 선택해주세요.">
        <SelectTrigger placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </VStack>
  );
}
