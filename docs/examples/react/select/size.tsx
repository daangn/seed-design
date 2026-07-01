import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from "seed-design/ui/select";

export default function SelectSize() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 240 }}>
      <SelectRoot size="large" defaultValue="apple">
        <SelectTrigger aria-label="과일 (large)" placeholder="과일 선택" />
        <SelectContent>
          <SelectItem value="apple" label="사과" />
          <SelectItem value="banana" label="바나나" />
        </SelectContent>
      </SelectRoot>
      <SelectRoot size="medium" defaultValue="apple">
        <SelectTrigger aria-label="과일 (medium)" placeholder="과일 선택" />
        <SelectContent>
          <SelectItem value="apple" label="사과" />
          <SelectItem value="banana" label="바나나" />
        </SelectContent>
      </SelectRoot>
    </div>
  );
}
