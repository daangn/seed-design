import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

import { chipVariantMap } from "@seed-design/css/recipes/chip";

import IconPlusFill from "@karrotmarket/react-monochrome-icon/IconPlusFill";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Chip, type ButtonChipProps } from "../seed-design/ui/chip";
import { Icon } from "@seed-design/react";

const initialVariants = {
  size: "medium",
  layout: "withText",
  variant: "solid",
} satisfies ButtonChipProps;

const ActivityChipButton: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Action Chip</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={chipVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <Chip.Button key={JSON.stringify(variants)} {...variants}>
              {variants.layout === "withText" ? (
                <Chip.Label>야옹</Chip.Label>
              ) : (
                <Icon svg={<IconPlusFill />} />
              )}
            </Chip.Button>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityChipButton;
