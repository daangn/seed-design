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
import { Avatar, AvatarBadge, type AvatarProps } from "../design-system/ui/avatar";
import { IdentityPlaceholder } from "../design-system/ui/identity-placeholder";

const initialVariants = {
  size: "64",
} satisfies AvatarProps;

const ActivityAvatar: ActivityComponentType = () => {
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
            <Avatar
              key={JSON.stringify(variants)}
              {...variants}
              src="https://avatars.githubusercontent.com/u/54893898?v=4"
              fallback={<IdentityPlaceholder />}
            >
              <AvatarBadge>
                <div style={{ background: "#000", width: 20, height: 20, borderRadius: 9999 }} />
              </AvatarBadge>
            </Avatar>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAvatar;
