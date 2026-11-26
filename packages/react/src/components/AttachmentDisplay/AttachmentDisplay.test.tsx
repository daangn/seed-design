import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import { AttachmentDisplayRoot } from "./AttachmentDisplay";
import {
  AttachmentDisplayItem,
  AttachmentDisplayItemDurationBadge,
  AttachmentDisplayItemRemoveButton,
  AttachmentDisplayItemReorderHandle,
} from "./AttachmentDisplayItem";

const entry = {
  id: "image-1",
  thumbnailUrl: "https://example.com/image.jpg",
  status: "success" as const,
};

describe("AttachmentDisplay", () => {
  it("keeps the item a list item with the reorder handle and remove button as separate buttons", () => {
    const { getByRole } = render(
      <AttachmentDisplayRoot>
        <AttachmentDisplayItem entry={entry} dragging>
          <AttachmentDisplayItemReorderHandle aria-label="1번째 이미지 순서 변경" />
          <AttachmentDisplayItemRemoveButton aria-label="파일 제거" />
        </AttachmentDisplayItem>
      </AttachmentDisplayRoot>,
    );

    const item = getByRole("listitem");
    const handle = getByRole("button", { name: "1번째 이미지 순서 변경" });
    const removeButton = getByRole("button", { name: "파일 제거" });

    expect(item).toHaveAttribute("data-reorderable");
    expect(item).toHaveAttribute("data-dragging");
    expect(handle).not.toContainElement(removeButton);
  });

  it("renders the duration badge's children inside the label", () => {
    const { getByRole } = render(
      <AttachmentDisplayRoot>
        <AttachmentDisplayItem entry={entry}>
          <AttachmentDisplayItemDurationBadge role="img" aria-label="재생시간">
            25:03:05
          </AttachmentDisplayItemDurationBadge>
        </AttachmentDisplayItem>
      </AttachmentDisplayRoot>,
    );

    expect(getByRole("img", { name: "재생시간" }).outerHTML).toBe(
      '<div class="seed-attachment-input-item__durationBadge seed-attachment-input-item__durationBadge--type_image" role="img" aria-label="재생시간"><span class="seed-attachment-input-item__durationBadgeLabel seed-attachment-input-item__durationBadgeLabel--type_image">25:03:05</span></div>',
    );
  });
});
