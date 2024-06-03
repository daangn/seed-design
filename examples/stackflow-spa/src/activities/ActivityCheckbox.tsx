import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { Checkbox } from "../design-system/components";

const ActivityCheckbox: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Checkbox" }}>
      <Checkbox label="hi" />
    </AppScreen>
  );
};

export default ActivityCheckbox;
