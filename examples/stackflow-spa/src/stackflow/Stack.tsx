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
    ActivityChipButton: React.lazy(() => import("../activities/ActivityChipButton")),
    ActivityChipToggle: React.lazy(() => import("../activities/ActivityChipToggle")),
    ActivityHelpBubble: React.lazy(() => import("../activities/ActivityHelpBubble")),
    ActivityLayerBar: React.lazy(() => import("../activities/ActivityLayerBar")),
    ActivityTransparentBar: React.lazy(() => import("../activities/ActivityTransparentBar")),
    ActivityAlertDialog: React.lazy(() => import("../activities/ActivityAlertDialog")),
    ActivityBottomSheet: React.lazy(() => import("../activities/ActivityBottomSheet")),
    ActivityMannerTempLevel: React.lazy(() => import("../activities/ActivityMannerTempLevel")),
    ActivityAvatarStack: React.lazy(() => import("../activities/ActivityAvatarStack")),
    ActivityAvatar: React.lazy(() => import("../activities/ActivityAvatar")),
    ActivityToggleButton: React.lazy(() => import("../activities/ActivityToggleButton")),
    ActivityMenuSheet: React.lazy(() => import("../activities/ActivityMenuSheet")),
    ActivityReactionButton: React.lazy(() => import("../activities/ActivityReactionButton")),
    ActivityErrorState: React.lazy(() => import("../activities/ActivityErrorState")),
    ActivityTabs: React.lazy(() => import("../activities/ActivityTabs")),
    ActivityAnimatedTabs: React.lazy(() => import("../activities/ActivityAnimatedTabs")),
    ActivitySwipeableTabs: React.lazy(() => import("../activities/ActivitySwipeableTabs")),
    ActivitySegmentedControl: React.lazy(() => import("../activities/ActivitySegmentedControl")),
    ActivityPartialDarkMode: React.lazy(() => import("../activities/ActivityPartialDarkMode")),
    ActivityMixedVersionTest: React.lazy(() => import("../activities/ActivityMixedVersionTest")),
    ActivityCodegenTest: React.lazy(() => import("../activities/ActivityCodegenTest")),
    ActivityPerfCheck: React.lazy(() => import("../activities/ActivityPerfCheck")),
    ActivityListItem: React.lazy(() => import("../activities/ActivityListItem")),
    ActivityListItemButton: React.lazy(() => import("../activities/ActivityListItemButton")),
    ActivityListItemLink: React.lazy(() => import("../activities/ActivityListItemLink")),
    ActivityListItemCheck: React.lazy(() => import("../activities/ActivityListItemCheck")),
    ActivityListItemRadio: React.lazy(() => import("../activities/ActivityListItemRadio")),
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
        ActivityChipButton: "/chip-button",
        ActivityToggleButton: "/toggle-button",
        ActivityChipToggle: "/chip-toggle",
        ActivityHelpBubble: "/help-bubble",
        ActivityLayerBar: "/layer-bar",
        ActivityTransparentBar: "/transparent-bar",
        ActivityAlertDialog: "/alert-dialog",
        ActivityBottomSheet: "/bottom-sheet",
        ActivityActionSheet: "/action-sheet",
        ActivityMenuSheet: "/menu-sheet",
        ActivityErrorState: "/error",
        ActivityMannerTempLevel: "/manner-temp-level",
        ActivityAvatarStack: "/avatar-stack",
        ActivityAvatar: "/avatar",
        ActivityReactionButton: "/reaction-button",
        ActivityTabs: "/tabs",
        ActivitySwipeableTabs: "/swipeable-tabs",
        ActivityAnimatedTabs: "/animated-tabs",
        ActivitySegmentedControl: "/segmented-control",
        ActivityPartialDarkMode: "/partial-dark-mode",
        ActivityMixedVersionTest: "/mixed-version-test",
        ActivityCodegenTest: "/codegen-test",
        ActivityPerfCheck: "/perf-check",
        ActivityListItem: "/list-item",
        ActivityListItemButton: "/list-item-button",
        ActivityListItemLink: "/list-item-link",
        ActivityListItemCheck: "/list-item-check",
        ActivityListItemRadio: "/list-item-radio",
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
