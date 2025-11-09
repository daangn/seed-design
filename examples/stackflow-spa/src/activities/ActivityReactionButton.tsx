import type { ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { reactionButtonVariantMap } from "@seed-design/css/recipes/reaction-button";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ReactionButton, type ReactionButtonProps } from "seed-design/ui/reaction-button";
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";
import { useTheme } from "../contexts/ThemeContext";

const initialVariants = {
  size: "small",
} satisfies ReactionButtonProps;

declare module "@stackflow/config" {
  interface Register {
    ActivityReactionButton: {};
  }
}

const ActivityReactionButton: ActivityComponentType<"ActivityReactionButton"> = () => {
  return (
    <AppScreen theme={useTheme().theme}>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Reaction Button</AppBarMain>
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
