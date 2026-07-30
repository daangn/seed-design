"use client";

import { Box, HStack, TimePicker, VStack, type TimePickerValue } from "@seed-design/react";
import { Popover } from "@seed-design/react/primitive";
import { ActionButton } from "seed-design/ui/action-button";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import * as React from "react";

function formatTime({ hour, minute }: TimePickerValue) {
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;

  return `${period} ${displayHour}:${String(minute).padStart(2, "0")}`;
}

export default function TimePickerPopover() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<TimePickerValue>({ hour: 10, minute: 30 });
  const [draft, setDraft] = React.useState(value);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange} placement="bottom-start" gutter={8}>
      <Popover.Anchor>
        <FieldButton
          label="영업 시작 시간"
          values={[formatTime(value)]}
          buttonProps={{
            "aria-label": `영업 시작 시간, ${formatTime(value)}`,
            "aria-haspopup": "dialog",
            "aria-expanded": open,
            onClick: () => handleOpenChange(!open),
          }}
        >
          <FieldButtonValue>{formatTime(value)}</FieldButtonValue>
        </FieldButton>
      </Popover.Anchor>
      <Popover.PositionerPortal asChild>
        <VStack
          width="320px"
          maxWidth="calc(100vw - 32px)"
          overflowX="hidden"
          overflowY="hidden"
          bg="bg.layerDefault"
          borderWidth={1}
          borderColor="stroke.neutralMuted"
          borderRadius="r3"
          boxShadow="s2"
          aria-label="시간 선택"
        >
          <Box width="full">
            <TimePicker value={draft} onValueChange={setDraft} />
          </Box>
          <HStack
            width="full"
            justify="flex-end"
            padding="x3"
            borderTopWidth={1}
            borderColor="stroke.neutralMuted"
          >
            <Popover.CloseButton asChild>
              <ActionButton variant="neutralSolid" onClick={() => setValue(draft)}>
                완료
              </ActionButton>
            </Popover.CloseButton>
          </HStack>
        </VStack>
      </Popover.PositionerPortal>
    </Popover.Root>
  );
}
