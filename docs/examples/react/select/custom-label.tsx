import { Box } from "@seed-design/react";
import { vars } from "@seed-design/css/vars";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

const STATUSES = [
  { value: "on-sale", label: "판매중", color: vars.$color.palette.green500 },
  { value: "reserved", label: "예약중", color: vars.$color.palette.carrot500 },
  { value: "sold", label: "거래완료", color: vars.$color.palette.gray500 },
];

export default function SelectCustomLabel() {
  return (
    <Box width="240px">
      <SelectRoot defaultValue={["on-sale"]}>
        <SelectTrigger aria-label="판매 상태" placeholder="상태 선택" />
        <SelectContent>
          <SelectGroup>
            {STATUSES.map((status) => (
              <SelectItem
                key={status.value}
                value={status.value}
                textValue={status.label}
                label={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: status.color,
                      }}
                    />
                    {status.label}
                  </span>
                }
              />
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
