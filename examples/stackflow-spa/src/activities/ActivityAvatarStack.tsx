import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
} from "../design-system/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../design-system/stackflow/AppScreen";

import { avatarStackVariantMap } from "@seed-design/css/recipes/avatar-stack";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Avatar, AvatarStack, type AvatarStackProps } from "../design-system/ui/avatar";
import { IdentityPlaceholder } from "../design-system/ui/identity-placeholder";

const initialVariants = {
  size: "64",
} satisfies AvatarStackProps;

const ActivityAvatarStack: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Avatar</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={avatarStackVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <AvatarStack {...variants}>
              <Avatar
                src="https://avatars.githubusercontent.com/u/54893898?v=4"
                fallback={<IdentityPlaceholder />}
              />
              <Avatar
                src="https://avatars.githubusercontent.com/u/102206520?v=4"
                fallback={<IdentityPlaceholder />}
              />
              <Avatar
                src="https://avatars.githubusercontent.com/u/56245920?v=4"
                fallback={<IdentityPlaceholder />}
              />
            </AvatarStack>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAvatarStack;
