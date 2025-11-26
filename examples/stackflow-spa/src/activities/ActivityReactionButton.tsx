import type { ActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain, AppBarRight, AppBarIconButton } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

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

const ActivityReactionButton: ActivityComponentType<"ActivityReactionButton"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Reaction Button</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
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
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityReactionButton;
