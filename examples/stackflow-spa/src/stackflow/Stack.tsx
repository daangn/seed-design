import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { seedPlugin } from "@seed-design/stackflow";
import ActivityHome from "../activities/ActivityHome";
import ActivityNotFound from "../activities/ActivityNotFound";
import { iframeSyncPlugin } from "./iframeSyncPlugin";
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
      // this will be overridden by theme context
      theme: "cupertino",
    }),
    iframeSyncPlugin(),
    historySyncPlugin({
      config,
      fallbackActivity: () => "ActivityNotFound",
    }),
  ],
  components: {
    ActivityHome,
    ActivityNotFound,

    // TODO: remove type assertion after stackflow fixes types
    ActivityActionButton: lazy(() => import("../activities/ActivityActionButton" as any)),
    ActivityAlertDialog: lazy(() => import("../activities/ActivityAlertDialog" as any)),
    ActivityAlertDialogActivity: lazy(
      () => import("../activities/ActivityAlertDialogActivity" as any),
    ),
    ActivityAlertDialogStep: lazy(() => import("../activities/ActivityAlertDialogStep" as any)),
    ActivityAnimatedTabs: lazy(() => import("../activities/ActivityAnimatedTabs" as any)),
    ActivityAvatar: lazy(() => import("../activities/ActivityAvatar" as any)),
    ActivityAvatarStack: lazy(() => import("../activities/ActivityAvatarStack" as any)),
    ActivityBottomSheet: lazy(() => import("../activities/ActivityBottomSheet" as any)),
    ActivityBottomSheetActivity: lazy(
      () => import("../activities/ActivityBottomSheetActivity" as any),
    ),
    ActivityBottomSheetStep: lazy(() => import("../activities/ActivityBottomSheetStep" as any)),
    ActivityChipButton: lazy(() => import("../activities/ActivityChipButton" as any)),
    ActivityChipToggle: lazy(() => import("../activities/ActivityChipToggle" as any)),
    ActivityCodegenTest: lazy(() => import("../activities/ActivityCodegenTest" as any)),
    ActivityDetail: lazy(() => import("../activities/ActivityDetail" as any)),
    ActivityErrorState: lazy(() => import("../activities/ActivityErrorState" as any)),
    ActivityHelpBubble: lazy(() => import("../activities/ActivityHelpBubble" as any)),
    ActivityLayerBar: lazy(() => import("../activities/ActivityLayerBar" as any)),
    ActivityListButtonItem: lazy(() => import("../activities/ActivityListButtonItem" as any)),
    ActivityListCheckItem: lazy(() => import("../activities/ActivityListCheckItem" as any)),
    ActivityListItem: lazy(() => import("../activities/ActivityListItem" as any)),
    ActivityListLinkItem: lazy(() => import("../activities/ActivityListLinkItem" as any)),
    ActivityListRadioItem: lazy(() => import("../activities/ActivityListRadioItem" as any)),
    ActivityListSwitchItem: lazy(() => import("../activities/ActivityListSwitchItem" as any)),
    ActivityMannerTempLevel: lazy(() => import("../activities/ActivityMannerTempLevel" as any)),
    ActivityMenuSheet: lazy(() => import("../activities/ActivityMenuSheet" as any)),
    ActivityMenuSheetActivity: lazy(() => import("../activities/ActivityMenuSheetActivity" as any)),
    ActivityMenuSheetSimple: lazy(() => import("../activities/ActivityMenuSheetSimple" as any)),
    ActivityMenuSheetStep: lazy(() => import("../activities/ActivityMenuSheetStep" as any)),
    ActivityMixedVersionTest: lazy(() => import("../activities/ActivityMixedVersionTest" as any)),
    ActivityPartialDarkMode: lazy(() => import("../activities/ActivityPartialDarkMode" as any)),
    ActivityPerfCheck: lazy(() => import("../activities/ActivityPerfCheck" as any)),
    ActivityReactionButton: lazy(() => import("../activities/ActivityReactionButton" as any)),
    ActivityResultSection: lazy(() => import("../activities/ActivityResultSection" as any)),
    ActivitySegmentedControl: lazy(() => import("../activities/ActivitySegmentedControl" as any)),
    ActivitySwipeableTabs: lazy(() => import("../activities/ActivitySwipeableTabs" as any)),
    ActivityTabs: lazy(() => import("../activities/ActivityTabs" as any)),
    ActivityToggleButton: lazy(() => import("../activities/ActivityToggleButton" as any)),
    ActivityTransparentBar: lazy(() => import("../activities/ActivityTransparentBar" as any)),
  },
});
