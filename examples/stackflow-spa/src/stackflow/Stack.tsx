import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { seedPlugin } from "@seed-design/stackflow";
import ActivityHome from "../activities/ActivityHome";
import ActivityNotFound from "../activities/ActivityNotFound";
import { iframeSyncPlugin } from "./iframeSyncPlugin";
import { stackflow, lazy } from "@stackflow/react/future";
import { config } from "./stackflow.config";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { theme } from "./theme";
import ActivityDemoArticleDetail from "../activities/ActivityDemoArticleDetail";
import ActivityDemoHome from "../activities/ActivityDemoHome";

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
    basicUIPlugin({ theme }),
    seedPlugin({ theme }),
    iframeSyncPlugin(),
    historySyncPlugin({
      config,
      fallbackActivity: () => "ActivityNotFound",
    }),
  ],
  components: {
    ActivityHome,
    ActivityNotFound,

    ActivityDemoHome,
    ActivityDemoArticleDetail,

    ActivityAccordion: lazy(() => import("../activities/ActivityAccordion")),
    ActivityActionButton: lazy(() => import("../activities/ActivityActionButton")),
    ActivityAppBarSlot: lazy(() => import("../activities/ActivityAppBarSlot")),
    ActivityAlertDialog: lazy(() => import("../activities/ActivityAlertDialog")),
    ActivityAlertDialogActivity: lazy(() => import("../activities/ActivityAlertDialogActivity")),
    ActivityAlertDialogStep: lazy(() => import("../activities/ActivityAlertDialogStep")),
    ActivityAnimatedTabs: lazy(() => import("../activities/ActivityAnimatedTabs")),
    ActivityAvatar: lazy(() => import("../activities/ActivityAvatar")),
    ActivityAvatarStack: lazy(() => import("../activities/ActivityAvatarStack")),
    ActivityBadge: lazy(() => import("../activities/ActivityBadge")),
    ActivityBottomSheet: lazy(() => import("../activities/ActivityBottomSheet")),
    ActivityBottomSheetActivity: lazy(() => import("../activities/ActivityBottomSheetActivity")),
    ActivityBottomSheetModalTest: lazy(() => import("../activities/ActivityBottomSheetModalTest")),
    ActivityBottomSheetStep: lazy(() => import("../activities/ActivityBottomSheetStep")),
    ActivityChipButton: lazy(() => import("../activities/ActivityChipButton")),
    ActivityChipToggle: lazy(() => import("../activities/ActivityChipToggle")),
    ActivityCodegenTest: lazy(() => import("../activities/ActivityCodegenTest")),
    ActivityDetail: lazy(() => import("../activities/ActivityDetail")),
    ActivityErrorState: lazy(() => import("../activities/ActivityErrorState")),
    ActivityFontScaling: lazy(() => import("../activities/ActivityFontScaling")),
    ActivityHelpBubble: lazy(() => import("../activities/ActivityHelpBubble")),
    ActivityLayerBar: lazy(() => import("../activities/ActivityLayerBar")),
    ActivityListButtonItem: lazy(() => import("../activities/ActivityListButtonItem")),
    ActivityListCheckItem: lazy(() => import("../activities/ActivityListCheckItem")),
    ActivityListItem: lazy(() => import("../activities/ActivityListItem")),
    ActivityListImageFrame: lazy(() => import("../activities/ActivityListImageFrame")),
    ActivityListLinkItem: lazy(() => import("../activities/ActivityListLinkItem")),
    ActivityListRadioItem: lazy(() => import("../activities/ActivityListRadioItem")),
    ActivityListSwitchItem: lazy(() => import("../activities/ActivityListSwitchItem")),
    ActivityMannerTempLevel: lazy(() => import("../activities/ActivityMannerTempLevel")),
    ActivityMenuSheet: lazy(() => import("../activities/ActivityMenuSheet")),
    ActivityMenuSheetActivity: lazy(() => import("../activities/ActivityMenuSheetActivity")),
    ActivityMenuSheetSimple: lazy(() => import("../activities/ActivityMenuSheetSimple")),
    ActivityMenuSheetStep: lazy(() => import("../activities/ActivityMenuSheetStep")),
    ActivityMixedVersionTest: lazy(() => import("../activities/ActivityMixedVersionTest")),
    ActivityPartialDarkMode: lazy(() => import("../activities/ActivityPartialDarkMode")),
    ActivityPerfCheck: lazy(() => import("../activities/ActivityPerfCheck")),
    ActivityPluginBasicUI: lazy(() => import("../activities/ActivityPluginBasicUI")),
    ActivityReactionButton: lazy(() => import("../activities/ActivityReactionButton")),
    ActivityResultSection: lazy(() => import("../activities/ActivityResultSection")),
    ActivitySegmentedControl: lazy(() => import("../activities/ActivitySegmentedControl")),
    ActivitySwipeableTabs: lazy(() => import("../activities/ActivitySwipeableTabs")),
    ActivityTabs: lazy(() => import("../activities/ActivityTabs")),
    ActivityForm: lazy(() => import("../activities/ActivityForm")),
    ActivityCategorySheet: lazy(() => import("../activities/ActivityCategorySheet")),
    ActivityToggleButton: lazy(() => import("../activities/ActivityToggleButton")),
    ActivityTransitionStyle: lazy(() => import("../activities/ActivityTransitionStyle")),
    ActivityTransparentBar: lazy(() => import("../activities/ActivityTransparentBar")),
  },
});
