import { HStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

const listFormat = new Intl.ListFormat("ko", { type: "conjunction" });

export default function SelectFormatValue() {
  return (
    <HStack gap="x4" width="full">
      <SelectRoot
        multiple
        defaultValue={["apple", "banana"]}
        formatValue={(items) => listFormat.format(items.map((item) => item.textValue))}
      >
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot
        multiple
        defaultValue={["apple", "banana", "cherry"]}
        formatValue={([first, ...rest]) =>
          rest.length > 0 ? `${first.textValue} 외 ${rest.length}개` : first.textValue
        }
      >
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </HStack>
  );
}
