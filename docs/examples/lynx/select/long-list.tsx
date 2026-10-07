import { Box } from "@seed-design/lynx-react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";

const timeSlots = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  return `${hour}:${index % 2 === 0 ? "00" : "30"}`;
});

export default function Example() {
  return (
    <Box width="full">
      <SelectRoot defaultValue={["14:00"]}>
        <SelectTrigger accessibility-label="예약 시간" placeholder="시간 선택" />
        <SelectContent>
          <SelectGroup>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot} label={slot} />
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
