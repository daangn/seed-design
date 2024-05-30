import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { BoxButton } from "../design-system/components";

const ActivityBoxButton: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "BoxButton" }}>
      <BoxButton>야옹</BoxButton>
    </AppScreen>
  );
};

export default ActivityBoxButton;
