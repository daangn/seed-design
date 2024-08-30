import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import * as React from "react";
import {
  ChipTabTrigger,
  ChipTabTriggerList,
  ChipTabs,
  ChipTabContent,
} from "../design-system/components";

const AcitivitiyChipTabs: ActivityComponentType = () => {
  const commonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    height: "300px",
  };

  return (
    <AppScreen appBar={{ title: "ChipTabs" }}>
      <ChipTabs defaultValue="1">
        <ChipTabTriggerList>
          <ChipTabTrigger value="1">라벨1</ChipTabTrigger>
          <ChipTabTrigger value="2">라벨2</ChipTabTrigger>
          <ChipTabTrigger value="3">라벨3</ChipTabTrigger>
          <ChipTabTrigger value="4">라벨4</ChipTabTrigger>
          <ChipTabTrigger value="5">라벨5</ChipTabTrigger>
          <ChipTabTrigger value="6">라벨6</ChipTabTrigger>
          <ChipTabTrigger value="7">라벨7</ChipTabTrigger>
        </ChipTabTriggerList>
        <ChipTabContent style={commonStyle} value="1">
          content 1
        </ChipTabContent>
        <ChipTabContent style={commonStyle} value="2">
          content 2
        </ChipTabContent>
        <ChipTabContent style={commonStyle} value="3">
          content 3
        </ChipTabContent>
        <ChipTabContent style={commonStyle} value="4">
          content 4
        </ChipTabContent>
        <ChipTabContent style={commonStyle} value="5">
          content 5
        </ChipTabContent>
        <ChipTabContent style={commonStyle} value="6">
          content 6
        </ChipTabContent>
        <ChipTabContent style={commonStyle} value="7">
          content 7
        </ChipTabContent>
      </ChipTabs>
    </AppScreen>
  );
};

export default AcitivitiyChipTabs;
