import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
  NextAppBarIconButton,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

import { reactionButtonVariantMap } from "@seed-design/css/recipes/reaction-button";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ReactionButton, type ReactionButtonProps } from "seed-design/ui/reaction-button";
import { IconFaceSmileCircleFill, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";

const initialVariants = {
  size: "small",
} satisfies ReactionButtonProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityReactionButton: {};
  }
}

const ActivityReactionButton: StaticActivityComponentType<"ActivityReactionButton"> = () => {
  const { push } = useFlow();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Reaction Button</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <ComponentAnalyzer
          variantsMap={reactionButtonVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <ReactionButton key={JSON.stringify(variants)} {...variants}>
              <PrefixIcon svg={<IconFaceSmileCircleFill />} />
              야옹쓰
              <Count>10</Count>
            </ReactionButton>
          )}
        />
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityReactionButton;
