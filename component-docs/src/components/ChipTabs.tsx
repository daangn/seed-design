import * as React from "react";

import {
  ChipTabs as UIChipTabs,
  ChipTabTrigger,
  ChipTabTriggerList,
  ChipTabContent,
} from "@/seed-design/ui/chip-tabs";

export const ChipTabs = () => {
  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "300px",
  };
  return (
    <UIChipTabs variant="neutralSolid" defaultValue="1">
      <ChipTabTriggerList>
        <ChipTabTrigger value="1">라벨1</ChipTabTrigger>
        <ChipTabTrigger value="2">라벨2</ChipTabTrigger>
        <ChipTabTrigger isDisabled value="3">
          라벨3
        </ChipTabTrigger>
        <ChipTabTrigger isDisabled value="4">
          라벨4
        </ChipTabTrigger>
        <ChipTabTrigger value="5">라벨5</ChipTabTrigger>
        <ChipTabTrigger value="6">라벨6</ChipTabTrigger>
        <ChipTabTrigger value="7">라벨7</ChipTabTrigger>
      </ChipTabTriggerList>
      <ChipTabContent value="1">
        <div style={commonStyle}>content 1</div>
      </ChipTabContent>
      <ChipTabContent value="2">
        <div style={commonStyle}>content 2</div>
      </ChipTabContent>
      <ChipTabContent value="3">
        <div style={commonStyle}>content 3</div>
      </ChipTabContent>
      <ChipTabContent value="4">
        <div style={commonStyle}>content 4</div>
      </ChipTabContent>
      <ChipTabContent value="5">
        <div style={commonStyle}>content 5</div>
      </ChipTabContent>
      <ChipTabContent value="6">
        <div style={commonStyle}>content 6</div>
      </ChipTabContent>
      <ChipTabContent value="7">
        <div style={commonStyle}>content 7</div>
      </ChipTabContent>
    </UIChipTabs>
  );
};
