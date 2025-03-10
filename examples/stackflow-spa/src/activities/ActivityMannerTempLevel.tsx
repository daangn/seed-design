import type { ActivityComponentType } from "@stackflow/react";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
} from "../design-system/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../design-system/stackflow/AppScreen";

import { mannerTempBadgeVariantMap } from "@seed-design/css/recipes/manner-temp-badge";
import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { MannerTempBadge, type MannerTempBadgeProps } from "../design-system/ui/manner-temp-badge";

const initialVariants = {
  temperature: 36.5,
  level: "l1",
} satisfies MannerTempBadgeProps;

const ActivityMannerTempLevel: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>MannerTempLevel</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={mannerTempBadgeVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <MannerTempBadge key={JSON.stringify(variants)} temperature={36.5} {...variants} />
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMannerTempLevel;
