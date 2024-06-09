import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { TextField } from "../design-system/components";

const ActivityTextField: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "TextField" }}>
      <TextField variant="outlined" maxLength={10} />
    </AppScreen>
  );
};

export default ActivityTextField;
