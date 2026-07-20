import { IconBellFill, IconGiftFill, IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectWithPrefixIcon() {
  return (
    <div style={{ width: 280 }}>
      <SelectRoot defaultValue={["keyword"]}>
        <SelectTrigger aria-label="알림 유형" placeholder="알림 유형 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="keyword" label="키워드 알림" prefixIcon={<IconBellFill />} />
            <SelectItem value="favorite" label="관심 상품" prefixIcon={<IconHeartFill />} />
            <SelectItem value="share" label="나눔 소식" prefixIcon={<IconGiftFill />} />
            <SelectItem value="all" label="모든 알림" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </div>
  );
}
