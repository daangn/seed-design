import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow, type ActivityComponentType, type UseActionsOutputType } from "@stackflow/react";
import React from "react";

import { seedPlugin } from "@seed-design/stackflow";
import ActivityNotFound from "../activities/ActivityNotFound";
import { theme } from "./theme";

/**
 * Stackflow는 웹뷰 내에서 Stack Navigation UI를 도와주는 도구에요.
 * 아래 웹사이트를 통해, 가이드 문서를 확인하실 수 있어요.
 * 웹사이트: https://stackflow.so
 * GitHub: https://github.com/daangn/stackflow
 */

const { Stack, useFlow, useStepFlow } = stackflow({
  activities: {
    ActivityHome: React.lazy(() => import("../activities/ActivityHome")),
    ActivityActionButton: React.lazy(() => import("../activities/ActivityActionButton")),
    ActivityActionChip: React.lazy(() => import("../activities/ActivityActionChip")),
    ActivityControlChip: React.lazy(() => import("../activities/ActivityControlChip")),
    ActivityHelpBubble: React.lazy(() => import("../activities/ActivityHelpBubble")),
    ActivityLayerBar: React.lazy(() => import("../activities/ActivityLayerBar")),
    ActivityTransparentBar: React.lazy(() => import("../activities/ActivityTransparentBar")),
    ActivityAlertDialog: React.lazy(() => import("../activities/ActivityAlertDialog")),
    ActivityBottomSheet: React.lazy(() => import("../activities/ActivityBottomSheet")),
    ActivityActionSheet: React.lazy(() => import("../activities/ActivityActionSheet")),
    ActivityMannerTempLevel: React.lazy(() => import("../activities/ActivityMannerTempLevel")),
    ActivityAvatarStack: React.lazy(() => import("../activities/ActivityAvatarStack")),
    ActivityAvatar: React.lazy(() => import("../activities/ActivityAvatar")),
    ActivityToggleButton: React.lazy(() => import("../activities/ActivityToggleButton")),
    ActivityExtendedActionSheet: React.lazy(
      () => import("../activities/ActivityExtendedActionSheet"),
    ),
    ActivityReactionButton: React.lazy(() => import("../activities/ActivityReactionButton")),
    ActivityErrorState: React.lazy(() => import("../activities/ActivityErrorState")),
    ActivityFab: React.lazy(() => import("../activities/ActivityFab")),
    ActivityExtendedFab: React.lazy(() => import("../activities/ActivityExtendedFab")),
    ActivityTabs: React.lazy(() => import("../activities/ActivityTabs")),
    ActivityAnimatedTabs: React.lazy(() => import("../activities/ActivityAnimatedTabs")),
    ActivitySwipeableTabs: React.lazy(() => import("../activities/ActivitySwipeableTabs")),
    ActivitySegmentedControl: React.lazy(() => import("../activities/ActivitySegmentedControl")),
    ActivityPartialDarkMode: React.lazy(() => import("../activities/ActivityPartialDarkMode")),
    ActivityMixedVersionTest: React.lazy(() => import("../activities/ActivityMixedVersionTest")),
    ActivityNotFound,
  },
  plugins: [
    basicRendererPlugin(),
    seedPlugin({
      theme,
    }),
    historySyncPlugin({
      fallbackActivity: () => "ActivityNotFound",
      routes: {
        ActivityHome: "/",
        ActivityActionButton: "/action-button",
        ActivityActionChip: "/action-chip",
        ActivityToggleButton: "/toggle-button",
        ActivityControlChip: "/control-chip",
        ActivityHelpBubble: "/help-bubble",
        ActivityLayerBar: "/layer-bar",
        ActivityTransparentBar: "/transparent-bar",
        ActivityAlertDialog: "/alert-dialog",
        ActivityBottomSheet: "/bottom-sheet",
        ActivityActionSheet: "/action-sheet",
        ActivityExtendedActionSheet: "/extended-action-sheet",
        ActivityErrorState: "/error",
        ActivityMannerTempLevel: "/manner-temp-level",
        ActivityAvatarStack: "/avatar-stack",
        ActivityAvatar: "/avatar",
        ActivityFab: "/fab",
        ActivityExtendedFab: "/extended-fab",
        ActivityReactionButton: "/reaction-button",
        ActivityTabs: "/tabs",
        ActivitySwipeableTabs: "/swipeable-tabs",
        ActivityAnimatedTabs: "/animated-tabs",
        ActivitySegmentedControl: "/segmented-control",
        ActivityPartialDarkMode: "/partial-dark-mode",
        ActivityMixedVersionTest: "/mixed-version-test",
        ActivityNotFound: "/404",
      },
    }),
  ],
  transitionDuration: 270,
});

export { Stack };
export type TypeUseFlow = typeof useFlow;
export type TypeUseStepFlow = typeof useStepFlow;

export type InferActivities<T> = T extends () => UseActionsOutputType<infer A> ? A : never;
export type Activities = InferActivities<typeof useFlow>;
export type ActivityName = keyof Activities;
export type ActivityParamOf<K extends ActivityName> = Activities[K] extends ActivityComponentType<
  infer U
>
  ? U
  : Activities[K] extends { component: ActivityComponentType<infer U> }
    ? U
    : {};
