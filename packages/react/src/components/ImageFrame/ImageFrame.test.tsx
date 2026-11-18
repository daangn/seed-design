import { imageFrameReactionButton } from "@seed-design/css/recipes/image-frame-reaction-button";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";
import type { ReactElement } from "react";
import { ImageFrame, ImageFrameReactionButton } from "./ImageFrame";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("ImageFrame", () => {
  describe("ImageFrameReactionButton", () => {
    it("renders the unselected icon by default", () => {
      const classNames = imageFrameReactionButton();
      const { getByRole, container } = setUp(<ImageFrameReactionButton aria-label="Like image" />);

      const button = getByRole("button", { name: "Like image" });
      const lineIcon = container.querySelector(`.${classNames.lineIcon}`);
      const fillIcon = container.querySelector(`.${classNames.fillIcon}`);
      const gradient = container.querySelector("linearGradient");

      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(lineIcon).not.toBeNull();
      expect(lineIcon).toHaveClass(classNames.lineIcon);
      expect(fillIcon).toBeNull();
      expect(gradient).toBeNull();
      expect(lineIcon).not.toHaveAttribute("data-pressed");
    });

    it("switches to the selected icon on press", async () => {
      const classNames = imageFrameReactionButton();
      const { getByRole, container, user } = setUp(
        <ImageFrameReactionButton aria-label="Like image" />,
      );

      const button = getByRole("button", { name: "Like image" });

      await user.click(button);

      const fillIcon = container.querySelector(`.${classNames.fillIcon}`);
      const lineIcon = container.querySelector(`.${classNames.lineIcon}`);
      const gradient = container.querySelector("linearGradient");

      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(fillIcon).not.toBeNull();
      expect(lineIcon).toBeNull();
      expect(gradient).not.toBeNull();
      expect(fillIcon).toHaveAttribute("data-pressed", "");
    });
  });

  describe("safe-area bleed", () => {
    function getInsetStyle(jsx: ReactElement) {
      const root = setUp(jsx).container.querySelector<HTMLElement>(".seed-image-frame__root");
      if (!root) throw new Error("ImageFrame root not found");

      return (side: "left" | "right", breakpoint: string) =>
        root.style.getPropertyValue(`--seed-image-frame-safe-area-${side}-${breakpoint}`);
    }

    it("lets bleedLeft override bleedX, as Box does", () => {
      const inset = getInsetStyle(
        <ImageFrame src="/image.png" alt="" bleedX="safeArea" bleedLeft={0} />,
      );

      expect(inset("left", "base")).toBe("0px");
      expect(inset("right", "base")).toBe("var(--seed-safe-area-right)");
    });

    // Leaving `md` unset would inherit the base safe-area inset through the breakpoint chain.
    it("writes 0px at a breakpoint where a responsive bleed stops being safeArea", () => {
      const inset = getInsetStyle(
        <ImageFrame src="/image.png" alt="" bleedX={{ base: "safeArea", md: 0 }} />,
      );

      expect(inset("left", "base")).toBe("var(--seed-safe-area-left)");
      expect(inset("left", "md")).toBe("0px");
    });
  });
});
