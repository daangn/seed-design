import { IconBack, basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";
import React from "react";

import ActivityNotFound from "../activities/ActivityNotFound";

/**
 * Stackflow는 웹뷰 내에서 Stack Navigation UI를 도와주는 도구에요.
 * 아래 웹사이트를 통해, 가이드 문서를 확인하실 수 있어요.
 * 웹사이트: https://stackflow.so
 * GitHub: https://github.com/daangn/stackflow
 */

const theme = /iphone|ipad|ipod/i.test(window.navigator.userAgent.toLowerCase())
  ? "cupertino"
  : "android";

const { Stack, useFlow, useStepFlow } = stackflow({
  activities: {
    ActivityHome: React.lazy(() => import("../activities/ActivityHome")),
    ActivityAvatar: React.lazy(() => import("../activities/ActivityAvatar")),
    ActivityBoxButton: React.lazy(() => import("../activities/ActivityBoxButton")),
    ActivityRadioGroup: React.lazy(() => import("../activities/ActivityRadioGroup")),
    ActivityCheckbox: React.lazy(() => import("../activities/ActivityCheckbox")),
    ActivityAlertDialog: React.lazy(() => import("../activities/ActivityAlertDialog")),
    ActivityTextField: React.lazy(() => import("../activities/ActivityTextField")),
    ActivityChip: React.lazy(() => import("../activities/ActivityChip")),
    ActivityCallout: React.lazy(() => import("../activities/ActivityCallout")),
    ActivitySwitch: React.lazy(() => import("../activities/ActivitySwitch")),
    ActivityHelpBubble: React.lazy(() => import("../activities/ActivityHelpBubble")),
    ActivityTabs: React.lazy(() => import("../activities/ActivityTabs")),
    ActivityChipTabs: React.lazy(() => import("../activities/ActivityChipTabs")),
    ActivityNotFound,
  },
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      appBar: {
        borderColor: theme === "cupertino" ? "#ddd" : "#ccc",
        closeButton: {
          renderIcon: () => <IconBack />,
        },
        iconColor: "#000",
        textColor: "#000",
      },
      backgroundColor: "#fff",
      theme,
    }),
    historySyncPlugin({
      fallbackActivity: () => "ActivityNotFound",
      routes: {
        ActivityHome: "/",
        ActivityAvatar: "/avatar",
        ActivityBoxButton: "/box-button",
        ActivityRadioGroup: "/radio-group",
        ActivityCheckbox: "/checkbox",
        ActivityAlertDialog: "/alert",
        ActivityChip: "/chip",
        ActivityCallout: "/callout",
        ActivitySwitch: "/switch",
        ActivityTabs: "/tabs",
        ActivityChipTabs: "/chipTabs",
        ActivityNotFound: "/404",
        ActivityTextField: "/text-field",
        ActivityHelpBubble: "/help-bubble",
      },
    }),
  ],
  transitionDuration: 270,
});

export { Stack };
export type TypeUseFlow = typeof useFlow;
export type TypeUseStepFlow = typeof useStepFlow;
