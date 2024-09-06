import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { ActionChip } from "../design-system/components";

const ActivityActionChip: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "ActionChip" }}>
      <ActionChip>야옹</ActionChip>
    </AppScreen>
  );
};

export default ActivityActionChip;
