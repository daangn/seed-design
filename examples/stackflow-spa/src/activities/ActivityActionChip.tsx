import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { ActionChip, Flex } from "../design-system/components";
import IconListRegular from "@seed-design/icon/IconListRegular";

const ActivityActionChip: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "ActionChip" }}>
      <Flex gap={2}>
        <ActionChip layout="iconOnly">
          <IconListRegular />
        </ActionChip>
        <ActionChip>야옹</ActionChip>
      </Flex>
    </AppScreen>
  );
};

export default ActivityActionChip;
