import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

import { reactionButtonVariantMap } from "@seed-design/css/recipes/reaction-button";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ReactionButton, type ReactionButtonProps } from "../seed-design/ui/reaction-button";
import { IconFaceSmileCircleFill } from "@daangn/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";

const initialVariants = {
  size: "small",
} satisfies ReactionButtonProps;

const ActivityReactionButton: ActivityComponentType = () => {
  return (
    <AppScreen>
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
