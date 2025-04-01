import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";

import { fabVariantMap } from "@seed-design/css/recipes/fab";

import { ComponentAnalyzer } from "../components/ComponentAnalyzer";
import { Fab, type FabProps } from "../seed-design/ui/fab";
import IconPlusLine from "@daangn/react-monochrome-icon/IconPlusLine";

const initialVariants = {} satisfies FabProps;

const ActivityFab: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>FAB</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <ComponentAnalyzer
          variantsMap={fabVariantMap}
          initialVariants={initialVariants}
          render={(variants) => (
            <Fab key={JSON.stringify(variants)} {...variants}>
              <IconPlusLine />
            </Fab>
          )}
        />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityFab;
