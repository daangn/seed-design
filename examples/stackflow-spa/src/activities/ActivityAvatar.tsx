import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarIconButton,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";

import { avatarStackVariantMap } from "@seed-design/css/recipes/avatar-stack";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Avatar, AvatarBadge, type AvatarProps } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

const initialVariants = {
  size: "64",
} satisfies AvatarProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityAvatar: {};
  }
}

const ActivityAvatar: StaticActivityComponentType<"ActivityAvatar"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Avatar</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityAvatar;
