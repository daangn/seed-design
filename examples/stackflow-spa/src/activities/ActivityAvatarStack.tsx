import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

import { avatarStackVariantMap } from "@seed-design/css/recipes/avatar-stack";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Avatar, AvatarStack, type AvatarStackProps } from "../seed-design/ui/avatar";
import { IdentityPlaceholder } from "../seed-design/ui/identity-placeholder";

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
