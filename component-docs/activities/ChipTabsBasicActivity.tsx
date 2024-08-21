import * as React from "react";
import { AppScreen } from "@stackflow/plugin-basic-ui";

import { ChipTabs, ChipTabTrigger, ChipTabTriggerList } from "@/seed-design/ui/chip-tabs";

import type { ActivityComponentType } from "@stackflow/react/future";

declare module "@stackflow/config" {
  interface Register {
    ChipTabsBasic: unknown;
  }
}

const ChipTabsBasicActivity: ActivityComponentType<"ChipTabsBasic"> = () => {
  const [value, setValue] = React.useState("1");

  const appBarLeft = () => <div>Left</div>;
  const appBarRight = () => <div>Right</div>;

  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "300px",
  };

  return (
    <AppScreen
      appBar={{
        renderLeft: appBarLeft,
        renderRight: appBarRight,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <ChipTabs defaultValue="1" value={value} onValueChange={(value) => setValue(value)}>
          <ChipTabTriggerList>
            <ChipTabTrigger value="1">라벨1</ChipTabTrigger>
            <ChipTabTrigger value="2">라벨2</ChipTabTrigger>
            <ChipTabTrigger value="3">라벨3</ChipTabTrigger>
          </ChipTabTriggerList>
        </ChipTabs>
        {value === "1" && <div style={commonStyle}>content 1</div>}
        {value === "2" && <div style={commonStyle}>content 2</div>}
        {value === "3" && <div style={commonStyle}>content 3</div>}
      </div>
    </AppScreen>
  );
};

export default ChipTabsBasicActivity;
