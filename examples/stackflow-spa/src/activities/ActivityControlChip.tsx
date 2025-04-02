import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

import { controlChipVariantMap } from "@seed-design/css/recipes/control-chip";

import IconPlusFill from "@karrotmarket/react-monochrome-icon/IconPlusFill";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ControlChip, type ToggleControlChipProps } from "../seed-design/ui/control-chip";
import { Count } from "@seed-design/react";

const initialVariants = {
  size: "medium",
  layout: "withText",
} satisfies ToggleControlChipProps;

const ActivityControlChip: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Control Chip</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={controlChipVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <ControlChip.Toggle key={JSON.stringify(variants)} {...variants}>
              {variants.layout === "withText" ? (
                <>
                  야옹 <Count>10</Count>
                </>
              ) : (
                <IconPlusFill />
              )}
            </ControlChip.Toggle>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityControlChip;
