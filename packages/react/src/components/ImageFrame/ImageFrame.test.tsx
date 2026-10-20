import { imageFrameReactionButton } from "@seed-design/css/recipes/image-frame-reaction-button";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";
import type { ReactElement } from "react";
import {
  ImageFrame,
  ImageFrameFloater,
  type ImageFrameFloaterProps,
  type ImageFrameProps,
  ImageFrameReactionButton,
} from "./ImageFrame";

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

  describe("ImageFrameFloater", () => {
    function renderFloater(
      frameProps: Partial<ImageFrameProps>,
      placement: ImageFrameFloaterProps["placement"],
    ) {
      const { getByTestId } = setUp(
        <ImageFrame {...(frameProps as ImageFrameProps)} src="/image.png" alt="">
          <ImageFrameFloater data-testid="floater" placement={placement} />
        </ImageFrame>,
      );

      return getByTestId("floater").getAttribute("style") ?? "";
    }

    it("keeps the default offset when the frame does not bleed into the safe area", () => {
      const style = renderFloater({}, "top-end");

      expect(style).not.toContain("--seed-safe-area");
    });

    it("pushes an end floater away from the right inset under bleedX='safeArea'", () => {
      const style = renderFloater({ bleedX: "safeArea" }, "top-end");

      expect(style).toContain("var(--seed-safe-area-right)");
      expect(style).not.toContain("var(--seed-safe-area-left)");
    });

    it("pushes a start floater away from the left inset under bleedLeft='safeArea'", () => {
      const style = renderFloater({ bleedLeft: "safeArea" }, "bottom-start");

      expect(style).toContain("var(--seed-safe-area-left)");
    });

    it("leaves a start floater alone when only the right side bleeds", () => {
      const style = renderFloater({ bleedRight: "safeArea" }, "bottom-start");

      expect(style).not.toContain("--seed-safe-area");
    });

    it("re-centers a center floater on the safe area", () => {
      const style = renderFloater({ bleedX: "safeArea" }, "bottom-center");

      expect(style).toContain("(var(--seed-safe-area-left) - var(--seed-safe-area-right)) / 2");
    });

    it("lets bleedLeft override bleedX for the left side", () => {
      const style = renderFloater({ bleedX: "safeArea", bleedLeft: 0 }, "top-start");

      expect(style).not.toContain("--seed-safe-area");
    });
  });
});
