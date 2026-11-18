import * as React from "@lynx-js/react";
import { ActionButton, Box, type TimePickerValue } from "@seed-design/lynx-react";

import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "@/components/ui/bottom-sheet";
import { FieldButton, FieldButtonValue } from "@/components/ui/field-button";
import { TimePicker } from "@/components/ui/time-picker";

function formatTime({ hour, minute }: TimePickerValue) {
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;

  return `${period} ${displayHour}:${String(minute).padStart(2, "0")}`;
}

export default function TimePickerBottomSheet() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<TimePickerValue>({ hour: 10, minute: 30 });
  const [draft, setDraft] = React.useState(value);

  const handleOpenChange = (nextOpen: boolean) => {
    "background only";
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  };

  return (
    <Box width="full" maxWidth="240px">
      <FieldButton
        label="영업 시작 시간"
        values={[formatTime(value)]}
        buttonProps={{
          "accessibility-label": `영업 시작 시간, ${formatTime(value)}`,
          bindtap: () => {
            "background only";
            handleOpenChange(true);
          },
        }}
      >
        <FieldButtonValue>{formatTime(value)}</FieldButtonValue>
      </FieldButton>
      <BottomSheetRoot open={open} onOpenChange={handleOpenChange}>
        <BottomSheetContent title="시간 선택" showCloseButton={false} showHandle>
          <BottomSheetBody>
            <TimePicker value={draft} onValueChange={setDraft} />
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton
              variant="neutralSolid"
              bindtap={() => {
                "background only";
                setValue(draft);
                setOpen(false);
              }}
            >
              완료
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </BottomSheetRoot>
    </Box>
  );
}
