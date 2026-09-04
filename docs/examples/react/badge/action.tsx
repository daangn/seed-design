"use client";

import { HelpBubbleTooltipTrigger } from "seed-design/ui/help-bubble-tooltip";
import { Badge } from "seed-design/ui/badge";

export default function BadgeWithAction() {
  return (
    <Badge
      actionProps={{
        "aria-label": "도움말",
        render: (trigger) => (
          <HelpBubbleTooltipTrigger title="판매 완료된 상품이에요">
            {trigger}
          </HelpBubbleTooltipTrigger>
        ),
      }}
    >
      판매 완료
    </Badge>
  );
}
