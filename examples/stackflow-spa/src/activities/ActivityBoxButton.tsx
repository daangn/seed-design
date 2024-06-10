import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { BoxButton } from "../design-system/components";

const ActivityBoxButton: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "BoxButton" }}>
      <BoxButton size="xsmall">야옹</BoxButton>
      <BoxButton size="small">야옹</BoxButton>
      <BoxButton size="medium">야옹</BoxButton>
      <BoxButton size="large">야옹</BoxButton>
      <BoxButton size="xlarge">야옹</BoxButton>
    </AppScreen>
  );
};

export default ActivityBoxButton;
