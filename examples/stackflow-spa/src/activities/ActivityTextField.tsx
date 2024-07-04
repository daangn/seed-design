import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { TextField } from "../design-system/components";

const ActivityTextField: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "TextField" }}>
      <TextField
        variant="outlined"
        invalid
        description="디스크립션이에용"
        errorMessage="에러에용"
      />
    </AppScreen>
  );
};

export default ActivityTextField;
