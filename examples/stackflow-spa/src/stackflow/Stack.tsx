import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { seedPlugin } from "@seed-design/stackflow";
import ActivityHome from "../activities/ActivityHome";
import ActivityNotFound from "../activities/ActivityNotFound";
import { iframeSyncPlugin } from "./iframeSyncPlugin";
import { theme } from "./theme";
import { stackflow, lazy } from "@stackflow/react/future";
import { config } from "./stackflow.config";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";

/**
 * Stackflow는 웹뷰 내에서 Stack Navigation UI를 도와주는 도구에요.
 * 아래 웹사이트를 통해, 가이드 문서를 확인하실 수 있어요.
 * 웹사이트: https://stackflow.so
 * GitHub: https://github.com/daangn/stackflow
 */
export const { Stack, actions, stepActions } = stackflow({
  config,
  plugins: [
    basicRendererPlugin(),
    seedPlugin({
      theme,
    }),
    iframeSyncPlugin(),
    historySyncPlugin({
      config,
      fallbackActivity: () => "ActivityNotFound",
    }),
  ],
  components: {
    ActivityHome,
    // TODO: fix
    ActivityActionButton: lazy(() => import("../activities/ActivityActionButton" as any)),
    ActivityChipButton: lazy(() => import("../activities/ActivityChipButton" as any)),
    ActivityChipToggle: lazy(() => import("../activities/ActivityChipToggle" as any)),
    ActivityHelpBubble: lazy(() => import("../activities/ActivityHelpBubble" as any)),
    ActivityLayerBar: lazy(() => import("../activities/ActivityLayerBar" as any)),
    ActivityTransparentBar: lazy(() => import("../activities/ActivityTransparentBar" as any)),
    ActivityAlertDialog: lazy(() => import("../activities/ActivityAlertDialog" as any)),
    ActivityBottomSheet: lazy(() => import("../activities/ActivityBottomSheet" as any)),
    ActivityBottomSheetExample: lazy(
      () => import("../activities/ActivityBottomSheetExample" as any),
    ),
    ActivityBottomSheetSimple: lazy(() => import("../activities/ActivityBottomSheetSimple" as any)),
    ActivityBottomSheetForm: lazy(() => import("../activities/ActivityBottomSheetForm" as any)),
    ActivityBottomSheetNested: lazy(() => import("../activities/ActivityBottomSheetNested" as any)),
    ActivityBottomSheetDetail: lazy(() => import("../activities/ActivityBottomSheetDetail" as any)),
    ActivityMannerTempLevel: lazy(() => import("../activities/ActivityMannerTempLevel" as any)),
    ActivityAvatarStack: lazy(() => import("../activities/ActivityAvatarStack" as any)),
    ActivityAvatar: lazy(() => import("../activities/ActivityAvatar" as any)),
    ActivityToggleButton: lazy(() => import("../activities/ActivityToggleButton" as any)),
    ActivityMenuSheet: lazy(() => import("../activities/ActivityMenuSheet" as any)),
    ActivityReactionButton: lazy(() => import("../activities/ActivityReactionButton" as any)),
    ActivityErrorState: lazy(() => import("../activities/ActivityErrorState" as any)),
    ActivityTabs: lazy(() => import("../activities/ActivityTabs" as any)),
    ActivityAnimatedTabs: lazy(() => import("../activities/ActivityAnimatedTabs" as any)),
    ActivitySwipeableTabs: lazy(() => import("../activities/ActivitySwipeableTabs" as any)),
    ActivitySegmentedControl: lazy(() => import("../activities/ActivitySegmentedControl" as any)),
    ActivityPartialDarkMode: lazy(() => import("../activities/ActivityPartialDarkMode" as any)),
    ActivityMixedVersionTest: lazy(() => import("../activities/ActivityMixedVersionTest" as any)),
    ActivityCodegenTest: lazy(() => import("../activities/ActivityCodegenTest" as any)),
    ActivityPerfCheck: lazy(() => import("../activities/ActivityPerfCheck" as any)),
    ActivityListItem: lazy(() => import("../activities/ActivityListItem" as any)),
    ActivityListButtonItem: lazy(() => import("../activities/ActivityListButtonItem" as any)),
    ActivityListLinkItem: lazy(() => import("../activities/ActivityListLinkItem" as any)),
    ActivityListSwitchItem: lazy(() => import("../activities/ActivityListSwitchItem" as any)),
    ActivityListCheckItem: lazy(() => import("../activities/ActivityListCheckItem" as any)),
    ActivityListRadioItem: lazy(() => import("../activities/ActivityListRadioItem" as any)),
    ActivityNotFound,
  },
});
