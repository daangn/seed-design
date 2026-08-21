"use client";

import {
  ActionButton,
  Box,
  DatePicker,
  HStack,
  type DatePickerActions,
  type DatePickerDate,
} from "@seed-design/react";
import * as React from "react";

const today: DatePickerDate = { year: 2026, month: 7, day: 30 };

export default function DatePickerNavigationActions() {
  const actionsRef = React.useRef<DatePickerActions>(null);

  return (
    <Box width="358px" maxWidth="100%">
      <HStack gap="x2" marginBottom="x3">
        <ActionButton
          variant="neutralWeak"
          onClick={() => actionsRef.current?.navigateToDate(today)}
        >
          오늘로 이동
        </ActionButton>
        <ActionButton variant="neutralWeak" onClick={() => actionsRef.current?.focusDate(today)}>
          오늘에 포커스
        </ActionButton>
      </HStack>
      <DatePicker
        actionsRef={actionsRef}
        today={today}
        defaultViewDate={{ year: 2026, month: 5, day: 1 }}
      />
    </Box>
  );
}
