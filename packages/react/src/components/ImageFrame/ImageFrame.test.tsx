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

  describe("safe-area bleed", () => {
    function renderRootStyle(frameProps: Partial<ImageFrameProps>) {
      const { container } = setUp(
        <ImageFrame {...(frameProps as ImageFrameProps)} src="/image.png" alt="" />,
      );

      const root = container.querySelector<HTMLElement>(".seed-image-frame__root");
      if (!root) throw new Error("ImageFrame root not found");

      return root.style;
    }

    it("declares no inset when the frame does not bleed", () => {
      const style = renderRootStyle({});

      expect(style.getPropertyValue("--seed-image-frame-safe-area-left-base")).toBe("");
      expect(style.getPropertyValue("--seed-image-frame-safe-area-right-base")).toBe("");
    });

    it("declares both insets under bleedX='safeArea'", () => {
      const style = renderRootStyle({ bleedX: "safeArea" });

      expect(style.getPropertyValue("--seed-image-frame-safe-area-left-base")).toBe(
        "var(--seed-safe-area-left)",
      );
      expect(style.getPropertyValue("--seed-image-frame-safe-area-right-base")).toBe(
        "var(--seed-safe-area-right)",
      );
    });

    it("declares only the right inset when only the right side bleeds", () => {
      const style = renderRootStyle({ bleedRight: "safeArea" });

      expect(style.getPropertyValue("--seed-image-frame-safe-area-left-base")).toBe("");
      expect(style.getPropertyValue("--seed-image-frame-safe-area-right-base")).toBe(
        "var(--seed-safe-area-right)",
      );
    });

    it("lets bleedLeft override bleedX for the left side", () => {
      const style = renderRootStyle({ bleedX: "safeArea", bleedLeft: 0 });

      expect(style.getPropertyValue("--seed-image-frame-safe-area-left-base")).toBe("0px");
      expect(style.getPropertyValue("--seed-image-frame-safe-area-right-base")).toBe(
        "var(--seed-safe-area-right)",
      );
    });

    it("resolves a responsive bleed per breakpoint", () => {
      const style = renderRootStyle({ bleedX: { base: "safeArea", md: 0 } });

      expect(style.getPropertyValue("--seed-image-frame-safe-area-left-base")).toBe(
        "var(--seed-safe-area-left)",
      );
      expect(style.getPropertyValue("--seed-image-frame-safe-area-left-md")).toBe("0px");
    });
  });

  describe("ImageFrameFloater", () => {
    function renderFloaterStyle(placement: ImageFrameFloaterProps["placement"]) {
      const { getByTestId } = setUp(
        <ImageFrame src="/image.png" alt="">
          <ImageFrameFloater data-testid="floater" placement={placement} />
        </ImageFrame>,
      );

      return getByTestId("floater").getAttribute("style") ?? "";
    }

    it("pushes a start floater away from the left inset", () => {
      const style = renderFloaterStyle("bottom-start");

      expect(style).toContain("var(--seed-image-frame-safe-area-left, 0px)");
      expect(style).not.toContain("--seed-image-frame-safe-area-right");
    });

    it("pushes an end floater away from the right inset", () => {
      const style = renderFloaterStyle("top-end");

      expect(style).toContain("var(--seed-image-frame-safe-area-right, 0px)");
      expect(style).not.toContain("--seed-image-frame-safe-area-left");
    });

    it("re-centers a center floater on the safe area", () => {
      const style = renderFloaterStyle("bottom-center");

      expect(style).toContain(
        "(var(--seed-image-frame-safe-area-left, 0px) - var(--seed-image-frame-safe-area-right, 0px)) / 2",
      );
    });
  });
});
