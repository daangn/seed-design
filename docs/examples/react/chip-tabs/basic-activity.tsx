import * as React from "react";

import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";
import type { ActivityComponentType } from "@stackflow/react/future";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";

declare module "@stackflow/config" {
  interface Register {
    "react/chip-tabs/basic-activity": {};
  }
}

const ChipTabsBasicActivity: ActivityComponentType<"react/chip-tabs/basic-activity"> = () => {
  const [value, setValue] = React.useState("1");

  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "100%",
  };

  return (
    <AppScreen>
      <AppBar>
        <AppBarMain>Chip Tabs</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ChipTabsRoot
          variant="neutralSolid"
          defaultValue="1"
          value={value}
          onValueChange={(value) => setValue(value)}
        >
          <ChipTabsList>
            <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
            <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
            <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
          </ChipTabsList>
        </ChipTabsRoot>
        {value === "1" && <div style={commonStyle}>content 1</div>}
        {value === "2" && <div style={commonStyle}>content 2</div>}
        {value === "3" && <div style={commonStyle}>content 3</div>}
      </AppScreenContent>
    </AppScreen>
  );
};

export default ChipTabsBasicActivity;
