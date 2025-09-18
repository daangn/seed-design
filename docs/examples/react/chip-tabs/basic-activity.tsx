import * as React from "react";

import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "seed-design/ui/chip-tabs";

import AppScreen from "@/components/stackflow/ActivityLayout";
import type { ActivityComponentType } from "@stackflow/react/future";

declare module "@stackflow/config" {
  interface Register {
    "chip-tabs-basic": unknown;
  }
}

const ChipTabsBasicActivity: ActivityComponentType<"chip-tabs-basic"> = () => {
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
    </AppScreen>
  );
};

export default ChipTabsBasicActivity;
