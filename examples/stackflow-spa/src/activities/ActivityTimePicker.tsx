import { useState } from "react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Text, TimePicker, VStack, type TimePickerValue } from "@seed-design/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityTimePicker: {};
  }
}

const ActivityTimePicker: StaticActivityComponentType<"ActivityTimePicker"> = () => {
  const { push } = useFlow();
  const [value, setValue] = useState<TimePickerValue>({ hour: 13, minute: 10 });

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="TimePicker" />
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack align="center" gap="x4" p="x4">
          <TimePicker
            value={value}
            minuteStep={10}
            onValueChange={setValue}
            aria-label="약속 시간"
          />
          <Text>
            선택한 시간: {String(value.hour).padStart(2, "0")}:
            {String(value.minute).padStart(2, "0")}
          </Text>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTimePicker;
