import { useState } from "react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Text, TimePicker, VStack, type TimePickerValue } from "@seed-design/react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityTimePicker: {};
  }
}

const ActivityTimePicker: StaticActivityComponentType<"ActivityTimePicker"> = () => {
  const { push } = useFlow();
  const [value, setValue] = useState<TimePickerValue>({ hour: 13, minute: 10 });
  const formattedValue = `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`;

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="TimePicker" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack align="center" gap="x4" p="x4">
          <TimePicker
            value={value}
            minuteStep={10}
            onValueChange={setValue}
            aria-label="약속 시간"
          />
          <Text>선택한 시간: {formattedValue}</Text>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityTimePicker;
