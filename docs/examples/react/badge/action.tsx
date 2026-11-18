"use client";

import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { Badge } from "seed-design/ui/badge";

export default function BadgeWithAction() {
  return (
    <Badge
      actionProps={{
        "aria-label": "도움말",
        render: (trigger) => (
          <HelpBubbleTrigger title="판매 완료된 상품이에요">{trigger}</HelpBubbleTrigger>
        ),
      }}
    >
      판매 완료
    </Badge>
  );
}
