import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import { AttachmentDisplayRoot } from "./AttachmentDisplay";
import { AttachmentDisplayItem, AttachmentDisplayItemRemoveButton } from "./AttachmentDisplayItem";

const entry = {
  id: "image-1",
  thumbnailUrl: "https://example.com/image.jpg",
  status: "success" as const,
};

describe("AttachmentDisplay", () => {
  it("renders separate focusable reorder and remove buttons for a reorderable item", () => {
    const { getByRole, getByTestId } = render(
      <AttachmentDisplayRoot>
        <AttachmentDisplayItem
          data-testid="item"
          entry={entry}
          data-reorderable=""
          aria-label="1번째 이미지 순서 변경"
        >
          <AttachmentDisplayItemRemoveButton aria-label="파일 제거" />
        </AttachmentDisplayItem>
      </AttachmentDisplayRoot>,
    );

    const item = getByTestId("item");
    const reorderButton = getByRole("button", { name: "1번째 이미지 순서 변경" });
    const removeButton = getByRole("button", { name: "파일 제거" });

    expect(item).not.toHaveAttribute("role");
    expect(item).not.toHaveAttribute("aria-label");
    expect(reorderButton).toHaveAttribute("data-attachment-reorder-handle", "");

    removeButton.focus();
    expect(document.activeElement).toBe(removeButton);
  });
});
