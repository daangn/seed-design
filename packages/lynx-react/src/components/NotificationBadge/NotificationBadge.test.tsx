import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { NotificationBadge, NotificationBadgePositioner } from "./NotificationBadge";

describe("NotificationBadge", () => {
  it("inherits the positioner's size and preserves user class names", () => {
    render(
      <view>
        <NotificationBadgePositioner attach="text" size="small" className="custom-positioner">
          <NotificationBadge className="custom-badge" />
        </NotificationBadgePositioner>
      </view>,
    );

    const positioner = elementTree.root?.querySelector(".seed-notification-badge-positioner");
    const badge = elementTree.root?.querySelector(".seed-notification-badge__root");
    const label = elementTree.root?.querySelector(".seed-notification-badge__label");

    expect(positioner).toHaveClass("custom-positioner");
    expect(positioner).toHaveClass("seed-notification-badge-positioner--attach_text");
    expect(positioner).toHaveClass("seed-notification-badge-positioner--size_small");
    expect(badge).toHaveClass("custom-badge");
    expect(badge).toHaveClass("seed-notification-badge__root--size_small");
    expect(label).toHaveAttribute("text-single-line-vertical-align", "center");
  });
});
