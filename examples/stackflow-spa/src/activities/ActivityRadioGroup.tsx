import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { Radio, RadioGroup } from "../design-system/components";
import { Flex } from "../design-system/components";

const ActivityRadioGroup: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "RadioGroup" }}>
      <RadioGroup size="large">
        <Flex flexDirection="column">
          <Radio value="1" label="1" />
          <Radio value="2" label="2" />
        </Flex>
      </RadioGroup>
    </AppScreen>
  );
};

export default ActivityRadioGroup;
