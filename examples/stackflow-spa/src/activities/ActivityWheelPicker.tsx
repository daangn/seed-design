import { Box, Text, VStack } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import { useActivity, useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { WheelPicker } from "seed-design/ui/wheel-picker";

declare module "@stackflow/config" {
  interface Register {
    ActivityWheelPicker: {};
  }
}

const createOptions = (start: number, end: number, suffix: string) =>
  Array.from({ length: end - start + 1 }, (_, index) => {
    const value = String(start + index);
    return { value, label: `${value}${suffix}` };
  });

const getLastDay = (year: string, month: string) =>
  new Date(Number(year), Number(month), 0).getDate();

const clampDay = (day: string, year: string, month: string) =>
  String(Math.min(Number(day), getLastDay(year, month)));

const ActivityWheelPicker: StaticActivityComponentType<"ActivityWheelPicker"> = () => {
  const { pop } = useFlow();
  const activity = useActivity();
  const [{ year, month, day }, setDate] = React.useState({
    year: "2026",
    month: "8",
    day: "20",
  });
  const lastDay = getLastDay(year, month);

  return (
    <BottomSheetRoot open={activity.isActive} onOpenChange={(open) => !open && pop()}>
      <BottomSheetContent showHandle title="날짜 선택" layerIndex={useActivityZIndexBase()}>
        <BottomSheetBody>
          <VStack align="center">
            <Box width="360px" maxWidth="100%">
              <WheelPicker
                aria-label="날짜 선택"
                columns={[
                  {
                    id: "year",
                    "aria-label": "연도",
                    options: createOptions(2020, 2030, "년"),
                    value: year,
                    onValueChange: (nextYear: string) =>
                      setDate((current) => ({
                        ...current,
                        year: nextYear,
                        day: clampDay(current.day, nextYear, current.month),
                      })),
                  },
                  {
                    id: "month",
                    "aria-label": "월",
                    options: createOptions(1, 12, "월"),
                    value: month,
                    onValueChange: (nextMonth: string) =>
                      setDate((current) => ({
                        ...current,
                        month: nextMonth,
                        day: clampDay(current.day, current.year, nextMonth),
                      })),
                    loop: true,
                  },
                  {
                    id: "day",
                    "aria-label": "일",
                    options: createOptions(1, lastDay, "일"),
                    value: day,
                    onValueChange: (nextDay: string) =>
                      setDate((current) => ({ ...current, day: nextDay })),
                    loop: true,
                  },
                ]}
              />
            </Box>
          </VStack>
        </BottomSheetBody>
        <BottomSheetFooter>
          <VStack gap="x3">
            <Box alignSelf="center">
              <Text aria-live="polite">
                {year}년 {month}월 {day}일
              </Text>
            </Box>
            <ActionButton size="large" variant="neutralSolid" onClick={pop}>
              완료
            </ActionButton>
          </VStack>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
};

export default ActivityWheelPicker;
