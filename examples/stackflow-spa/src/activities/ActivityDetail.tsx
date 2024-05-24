import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";

const ActivityDetail: ActivityComponentType = () => {
  return <AppScreen appBar={{ title: "Detail" }}>Hello, Detail</AppScreen>;
};

export default ActivityDetail;
