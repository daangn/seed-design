import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Switch } from "../design-system/components";

const ActivitySwitch: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Switch" }}>
      <Switch onCheckedChange={(checked) => console.log("checked", checked)} />
    </AppScreen>
  );
};

export default ActivitySwitch;
