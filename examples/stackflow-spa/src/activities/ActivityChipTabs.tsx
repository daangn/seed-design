import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import {
  ChipTabs,
  ChipTabContent,
  ChipTabContentList,
  ChipTabTrigger,
  ChipTabTriggerList,
} from "../design-system/components";
import * as React from "react";

const AcitivitiyChipTabs: ActivityComponentType = () => {
  const [value, setValue] = React.useState("1");
  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "300px",
  };

  return (
    <AppScreen appBar={{ title: "ChipTabs" }}>
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
    </AppScreen>
  );
};

export default AcitivitiyChipTabs;
