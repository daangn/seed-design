import * as React from "react";

import {
  ChipTabs as UIChipTabs,
  ChipTabContent,
  ChipTabContentList,
  ChipTabTrigger,
  ChipTabTriggerList,
} from "@/seed-design/ui/chip-tabs";

export const ChipTabs = () => {
  const [value, setValue] = React.useState("1");
  const tabCommonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "300px",
  };
  return (
    <div>
      <UIChipTabs defaultValue="1" value={value} onValueChange={(value) => setValue(value)}>
        <ChipTabTriggerList>
          <ChipTabTrigger value="1">라벨1</ChipTabTrigger>
          <ChipTabTrigger value="2">라벨2</ChipTabTrigger>
          <ChipTabTrigger value="3">라벨3</ChipTabTrigger>
        </ChipTabTriggerList>
      </UIChipTabs>
      {value === "1" && <div style={tabCommonStyle}>content 1</div>}
      {value === "2" && <div style={tabCommonStyle}>content 2</div>}
      {value === "3" && <div style={tabCommonStyle}>content 3</div>}
    </div>
  );
};
