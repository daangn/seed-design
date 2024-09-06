import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { ActionButton } from "../design-system/components";

const ActivityActionButton: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "ActionButton" }}>
      <ActionButton variant="brandSolid" size="xsmall">야옹</ActionButton>
      <ActionButton variant="brandSolid" size="small">야옹</ActionButton>
      <ActionButton variant="brandSolid" size="medium">야옹</ActionButton>
      <ActionButton variant="brandSolid" size="large">야옹</ActionButton>
      
      <ActionButton variant="brandSolid" size="large">야옹</ActionButton>
      <ActionButton variant="brandWeak" size="large">야옹</ActionButton>
      <ActionButton variant="neutralSolid" size="large">야옹</ActionButton>
      <ActionButton variant="neutralWeak" size="large">야옹</ActionButton>
      <ActionButton variant="dangerSolid" size="large">야옹</ActionButton>
    </AppScreen>
  );
};

export default ActivityActionButton;
