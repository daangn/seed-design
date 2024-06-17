import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import React from "react";
import { Avatar, Flex } from "../design-system/components";

const ActivityAvatar: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Avatar" }}>
      <Flex padding={4} gap={2}>
        <Avatar
          size="20"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
        <Avatar
          size="24"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
        <Avatar
          size="36"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
        <Avatar
          size="48"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
        <Avatar
          size="64"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
        <Avatar
          size="80"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
        <Avatar
          size="96"
          src="https://avatars.githubusercontent.com/u/102206520?v=4"
        />
      </Flex>
    </AppScreen>
  );
};

export default ActivityAvatar;
