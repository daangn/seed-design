import * as React from "react";

import { ChipTabs, ChipTabTrigger, ChipTabTriggerList } from "@/seed-design/ui/chip-tabs";

import type { ActivityComponentType } from "@stackflow/react/future";
import Layout from "./ActivityLayout";

declare module "@stackflow/config" {
  interface Register {
    ChipTabsBasic: unknown;
  }
}

const ChipTabsBasicActivity: ActivityComponentType<"ChipTabsBasic"> = () => {
  const [value, setValue] = React.useState("1");

  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "100%",
  };

  return (
    <Layout>
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
    </Layout>
  );
};

export default ChipTabsBasicActivity;

ChipTabsBasicActivity.displayName = "ChipTabsBasicActivity";
