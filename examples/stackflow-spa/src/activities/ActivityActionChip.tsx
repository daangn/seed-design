import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
} from "../design-system/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../design-system/stackflow/AppScreen";

import { actionChipVariantMap } from "@seed-design/css/recipes/action-chip";

import IconPlusFill from "@daangn/react-monochrome-icon/IconPlusFill";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { ActionChip, type ActionChipProps } from "../design-system/ui/action-chip";
import { Count } from "@seed-design/react";

const initialVariants = {
  size: "medium",
  layout: "withText",
} satisfies ActionChipProps;

const ActivityActionChip: ActivityComponentType = () => {
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
          variantsMap={actionChipVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <ActionChip key={JSON.stringify(variants)} {...variants}>
              {variants.layout === "withText" ? (
                <>
                  야옹 <Count>10</Count>
                </>
              ) : (
                <IconPlusFill />
              )}
            </ActionChip>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityActionChip;
