import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Text, VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
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

const ActivityWheelPicker: StaticActivityComponentType<"ActivityWheelPicker"> = () => {
  const { push } = useFlow();
  const [year, setYear] = React.useState("2026");
  const [month, setMonth] = React.useState("8");
  const [day, setDay] = React.useState("20");

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Wheel Picker</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x4" px="spacingX.globalGutter" py="x4" align="center">
          <Box width="360px" maxWidth="100%">
            <WheelPicker
              aria-label="날짜 선택"
              columns={[
                {
                  id: "year",
                  "aria-label": "연도",
                  options: createOptions(2020, 2030, "년"),
                  value: year,
                  onValueChange: setYear,
                },
                {
                  id: "month",
                  "aria-label": "월",
                  options: createOptions(1, 12, "월"),
                  value: month,
                  onValueChange: setMonth,
                  loop: true,
                },
                {
                  id: "day",
                  "aria-label": "일",
                  options: createOptions(1, 31, "일"),
                  value: day,
                  onValueChange: setDay,
                  loop: true,
                },
              ]}
            />
          </Box>
          <Text aria-live="polite">
            {year}년 {month}월 {day}일
          </Text>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityWheelPicker;
