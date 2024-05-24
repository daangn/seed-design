import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";

const ActivityNotFound: ActivityComponentType = () => {
  return <AppScreen appBar={{}}>404 Not Found</AppScreen>;
};

export default ActivityNotFound;
