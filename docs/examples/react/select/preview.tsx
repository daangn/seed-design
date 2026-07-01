import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from "seed-design/ui/select";

export default function SelectPreview() {
  return (
    <div style={{ width: 240 }}>
      <SelectRoot defaultValue="apple">
        <SelectTrigger aria-label="과일" placeholder="과일을 선택하세요" />
        <SelectContent>
          <SelectItem value="apple" label="사과" />
          <SelectItem value="banana" label="바나나" />
          <SelectItem value="cherry" label="체리" />
        </SelectContent>
      </SelectRoot>
    </div>
  );
}
