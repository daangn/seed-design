import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectDisabled() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 240 }}>
      <SelectRoot defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" disabled />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot disabled defaultValue={["apple"]}>
        <SelectTrigger aria-label="비활성 과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </div>
  );
}
