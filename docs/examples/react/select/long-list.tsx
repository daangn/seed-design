import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

const TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";

  return `${hour}:${minute}`;
});

export default function SelectLongList() {
  return (
    <Box width="240px">
      <SelectRoot defaultValue={["14:00"]}>
        <SelectTrigger aria-label="예약 시간" placeholder="시간 선택" />
        <SelectContent>
          <SelectGroup>
            {TIME_SLOTS.map((slot) => (
              <SelectItem key={slot} value={slot} label={slot} />
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
