import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { ChipButton, ChipToggleButton } from "../design-system/components";

const ActivityChip: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Chip" }}>
      <ChipButton count={3}>야옹</ChipButton>
      <ChipToggleButton>멍멍</ChipToggleButton>
    </AppScreen>
  );
};

export default ActivityChip;
