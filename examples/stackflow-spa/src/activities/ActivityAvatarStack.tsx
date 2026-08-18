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
import { Avatar, AvatarStack, type AvatarStackProps } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

const initialVariants = {
  size: "64",
} satisfies AvatarStackProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityAvatarStack: {};
  }
}

const ActivityAvatarStack: StaticActivityComponentType<"ActivityAvatarStack"> = () => {
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityAvatarStack;
