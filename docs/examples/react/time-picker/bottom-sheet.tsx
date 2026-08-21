"use client";

import { Portal, TimePicker, type TimePickerValue } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import * as React from "react";

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
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  };

  return (
    <BottomSheetRoot open={open} onOpenChange={handleOpenChange}>
      <FieldButton
        label="영업 시작 시간"
        values={[formatTime(value)]}
        style={{ width: "240px", maxWidth: "100%" }}
        buttonProps={{
          "aria-label": `영업 시작 시간, ${formatTime(value)}`,
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          onClick: () => handleOpenChange(true),
        }}
      >
        <FieldButtonValue>{formatTime(value)}</FieldButtonValue>
      </FieldButton>
      <Portal>
        <BottomSheetContent title="시간 선택" showCloseButton={false} showHandle>
          <BottomSheetBody paddingX="x4">
            <TimePicker value={draft} onValueChange={setDraft} />
          </BottomSheetBody>
          <BottomSheetFooter>
            <ActionButton
              variant="neutralSolid"
              onClick={() => {
                setValue(draft);
                setOpen(false);
              }}
            >
              완료
            </ActionButton>
          </BottomSheetFooter>
        </BottomSheetContent>
      </Portal>
    </BottomSheetRoot>
  );
}
