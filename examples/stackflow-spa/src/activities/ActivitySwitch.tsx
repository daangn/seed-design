import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Switch } from "../design-system/components";

const ActivitySwitch: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Switch" }}>
      <Switch size="medium" onCheckedChange={(checked) => console.log("checked", checked)} />
      <Switch size="small" onCheckedChange={(checked) => console.log("checked", checked)} />
    </AppScreen>
  );
};

export default ActivitySwitch;
