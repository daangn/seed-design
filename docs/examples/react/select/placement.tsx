import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from "seed-design/ui/select";

export default function SelectPlacement() {
  return (
    <div style={{ width: 240 }}>
      <SelectRoot placement="top" defaultValue="apple">
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectItem value="apple" label="사과" />
          <SelectItem value="banana" label="바나나" />
          <SelectItem value="cherry" label="체리" />
        </SelectContent>
      </SelectRoot>
    </div>
  );
}
