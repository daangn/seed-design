import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { seedPlugin } from "@seed-design/stackflow";
import ActivityHome from "../activities/ActivityHome";
import ActivityNotFound from "../activities/ActivityNotFound";
import { iframeSyncPlugin } from "./iframeSyncPlugin";
import { stackflow, lazy } from "@stackflow/react/future";
import { config } from "./stackflow.config";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { isIos } from "../platform";
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
    // iOS에서만 화면 전체를 백스와이프 영역으로 쓰고, 기기 디스플레이 모서리에 맞춰
    // 전환/스와이프 중 클립한다. 55px = iPhone 15 Pro의 UIScreen
    // _displayCornerRadius(55.0pt, 15 Pro Max / 14 Pro 동일). 나머지 플랫폼은
    // swipeBackArea edge 기본값에 클립 없음.
    seedPlugin({ theme, ...(isIos && { swipeBackArea: "full" as const, clipRadius: 55 }) }),
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
    ActivityAlertDialog: lazy(() => import("../activities/ActivityAlertDialog")),
    ActivityAnimateFalseTest: lazy(() => import("../activities/ActivityAnimateFalseTest")),
    ActivityAlertDialogActivity: lazy(() => import("../activities/ActivityAlertDialogActivity")),
    ActivityAlertDialogStep: lazy(() => import("../activities/ActivityAlertDialogStep")),
    ActivityAnimatedTabs: lazy(() => import("../activities/ActivityAnimatedTabs")),
    ActivityAvatar: lazy(() => import("../activities/ActivityAvatar")),
    ActivityAvatarStack: lazy(() => import("../activities/ActivityAvatarStack")),
    ActivityBadge: lazy(() => import("../activities/ActivityBadge")),
    ActivityBottomSheet: lazy(() => import("../activities/ActivityBottomSheet")),
    ActivityBottomSheetActivity: lazy(() => import("../activities/ActivityBottomSheetActivity")),
    ActivityBottomSheetInputFocus: lazy(
      () => import("../activities/ActivityBottomSheetInputFocus"),
    ),
    ActivityBottomSheetModalTest: lazy(() => import("../activities/ActivityBottomSheetModalTest")),
    ActivityBottomSheetStep: lazy(() => import("../activities/ActivityBottomSheetStep")),
    ActivityBottomSheetKeyboardPlayground: lazy(
      () => import("../activities/ActivityBottomSheetKeyboardPlayground"),
    ),
    ActivityBottomSheetTextField: lazy(() => import("../activities/ActivityBottomSheetTextField")),
    ActivityBottomSheetWithAlertDialogStep: lazy(
      () => import("../activities/ActivityBottomSheetWithAlertDialogStep"),
    ),
    ActivityNestedBottomSheet: lazy(() => import("../activities/ActivityNestedBottomSheet")),
    ActivityCheckbox: lazy(() => import("../activities/ActivityCheckbox")),
    ActivityChipButton: lazy(() => import("../activities/ActivityChipButton")),
    ActivityChipToggle: lazy(() => import("../activities/ActivityChipToggle")),
    ActivityCodegenTest: lazy(() => import("../activities/ActivityCodegenTest")),
    ActivityDetail: lazy(() => import("../activities/ActivityDetail")),
    ActivityDialog: lazy(() => import("../activities/ActivityDialog")),
    ActivityE2EImageBehavior: lazy(() => import("../activities/ActivityE2EImageBehavior")),
    ActivityErrorState: lazy(() => import("../activities/ActivityErrorState")),
    ActivityFontMultiplierLayout: lazy(() => import("../activities/ActivityFontMultiplierLayout")),
    ActivityHelpBubble: lazy(() => import("../activities/ActivityHelpBubble")),
    ActivityIacvt: lazy(() => import("../activities/ActivityIacvt")),
    ActivityIacvtExperiment: lazy(() => import("../activities/ActivityIacvtExperiment")),
    ActivityLayerBar: lazy(() => import("../activities/ActivityLayerBar")),
    ActivityListButtonItem: lazy(() => import("../activities/ActivityListButtonItem")),
    ActivityListCheckItem: lazy(() => import("../activities/ActivityListCheckItem")),
    ActivityListItem: lazy(() => import("../activities/ActivityListItem")),
    ActivityListImageFrame: lazy(() => import("../activities/ActivityListImageFrame")),
    ActivityListLinkItem: lazy(() => import("../activities/ActivityListLinkItem")),
    ActivityListRadioItem: lazy(() => import("../activities/ActivityListRadioItem")),
    ActivityListSwitchItem: lazy(() => import("../activities/ActivityListSwitchItem")),
    ActivityMannerTempLevel: lazy(() => import("../activities/ActivityMannerTempLevel")),
    ActivityMarginPlayground: lazy(() => import("../activities/ActivityMarginPlayground")),
    ActivityMenu: lazy(() => import("../activities/ActivityMenu")),
    ActivityMenuSheet: lazy(() => import("../activities/ActivityMenuSheet")),
    ActivityMenuSheetActivity: lazy(() => import("../activities/ActivityMenuSheetActivity")),
    ActivityMenuSheetSimple: lazy(() => import("../activities/ActivityMenuSheetSimple")),
    ActivityMenuSheetStep: lazy(() => import("../activities/ActivityMenuSheetStep")),
    ActivityMixedVersionTest: lazy(() => import("../activities/ActivityMixedVersionTest")),
    ActivityPartialDarkMode: lazy(() => import("../activities/ActivityPartialDarkMode")),
    ActivityPerfCheck: lazy(() => import("../activities/ActivityPerfCheck")),
    ActivityPluginBasicUI: lazy(() => import("../activities/ActivityPluginBasicUI")),
    ActivityPopTest: lazy(() => import("../activities/ActivityPopTest")),
    ActivityPagination: lazy(() => import("../activities/ActivityPagination")),
    ActivityQuantityPicker: lazy(() => import("../activities/ActivityQuantityPicker")),
    ActivityRadioGroup: lazy(() => import("../activities/ActivityRadioGroup")),
    ActivityReactionButton: lazy(() => import("../activities/ActivityReactionButton")),
    ActivityResultSection: lazy(() => import("../activities/ActivityResultSection")),
    ActivityScaleFeedback: lazy(() => import("../activities/ActivityScaleFeedback")),
    ActivitySegmentedControl: lazy(() => import("../activities/ActivitySegmentedControl")),
    ActivitySelect: lazy(() => import("../activities/ActivitySelect")),
    ActivitySwitch: lazy(() => import("../activities/ActivitySwitch")),
    ActivitySideNavigation: lazy(() => import("../activities/ActivitySideNavigation")),
    ActivitySidePanel: lazy(() => import("../activities/ActivitySidePanel")),
    ActivitySidePanelActivity: lazy(() => import("../activities/ActivitySidePanelActivity")),
    ActivityResponsiveSidePanel: lazy(() => import("../activities/ActivityResponsiveSidePanel")),
    ActivityResponsiveDialog: lazy(() => import("../activities/ActivityResponsiveDialog")),
    ActivitySwipeableMenuSheet: lazy(() => import("../activities/ActivitySwipeableMenuSheet")),
    ActivitySwipeableTabs: lazy(() => import("../activities/ActivitySwipeableTabs")),
    ActivityTabs: lazy(() => import("../activities/ActivityTabs")),
    ActivityTabsAutoHeightLazy: lazy(() => import("../activities/ActivityTabsAutoHeightLazy")),
    ActivityTimePicker: lazy(() => import("../activities/ActivityTimePicker")),
    ActivityWheelPicker: lazy(() => import("../activities/ActivityWheelPicker")),
    ActivityChipTabsScrollFog: lazy(() => import("../activities/ActivityChipTabsScrollFog")),
    ActivityAttachmentField: lazy(() => import("../activities/ActivityAttachmentField")),
    ActivityAttachmentDisplayField: lazy(
      () => import("../activities/ActivityAttachmentDisplayField"),
    ),
    ActivityForm: lazy(() => import("../activities/ActivityForm")),
    ActivityCategorySheet: lazy(() => import("../activities/ActivityCategorySheet")),
    ActivityToggleButton: lazy(() => import("../activities/ActivityToggleButton")),
    ActivityTransparentBar: lazy(() => import("../activities/ActivityTransparentBar")),
    ActivityTypographyScale: lazy(() => import("../activities/ActivityTypographyScale")),

    ActivityAppScreen: lazy(() => import("../activities/ActivityAppScreen")),
    ActivityNextAppScreen: lazy(() => import("../activities/ActivityNextAppScreen")),
    ActivityNextAppScreenPreview: lazy(() => import("../activities/ActivityNextAppScreenPreview")),
    ActivityNextAppScreenTransparent: lazy(
      () => import("../activities/ActivityNextAppScreenTransparent"),
    ),
    ActivityAppScreenIntersectionObserver: lazy(
      () => import("../activities/ActivityAppScreenIntersectionObserver"),
    ),
    ActivityNextAppScreenIntersectionObserver: lazy(
      () => import("../activities/ActivityNextAppScreenIntersectionObserver"),
    ),
    ActivityNextAnimateFalseTest: lazy(() => import("../activities/ActivityNextAnimateFalseTest")),
    ActivityAppScreenAppBarCustomization: lazy(
      () => import("../activities/ActivityAppScreenAppBarCustomization"),
    ),
    ActivityAlertDialogStackflow: lazy(() => import("../activities/ActivityAlertDialogStackflow")),
    ActivityResultSectionCtaProgressCircle: lazy(
      () => import("../activities/ActivityResultSectionCtaProgressCircle"),
    ),
    ActivityArticlePreventPull: lazy(() => import("../activities/ActivityArticlePreventPull")),
    ActivityArticlePreventDrag: lazy(() => import("../activities/ActivityArticlePreventDrag")),
    ActivityPullToRefreshPreview: lazy(() => import("../activities/ActivityPullToRefreshPreview")),
    ActivityNextPullToRefreshPreview: lazy(
      () => import("../activities/ActivityNextPullToRefreshPreview"),
    ),
    ActivityPullToRefreshTabs: lazy(() => import("../activities/ActivityPullToRefreshTabs")),
    ActivityPullToRefreshPreventPull: lazy(
      () => import("../activities/ActivityPullToRefreshPreventPull"),
    ),
    ActivityNextPullToRefreshPreventPull: lazy(
      () => import("../activities/ActivityNextPullToRefreshPreventPull"),
    ),
  },
});
