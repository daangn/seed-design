import { imageFrameReactionButton } from "@seed-design/css/recipes/image-frame-reaction-button";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";
import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { ImageFrame, ImageFrameReactionButton } from "./ImageFrame";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("ImageFrame", () => {
  it.each([
    "eager",
    "lazy",
  ] as const)("keeps a server-rendered %s image available before hydration", (loading) => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <ImageFrame src="image.png" alt="Preview" loading={loading} fallback="Loading" />,
    );
    const image = container.querySelector("img");
    expect(image).not.toHaveAttribute("hidden");
    expect(image).not.toHaveAttribute("aria-hidden");
    expect(image).toHaveAttribute("data-loading-state", "loading");
  });

  it("hides an image without a source even when loading is lazy", () => {
    const { getByAltText } = setUp(<ImageFrame src="" alt="Preview" loading="lazy" />);
    expect(getByAltText("Preview")).toHaveAttribute("data-loading-state", "error");
    expect(getByAltText("Preview")).toHaveAttribute("hidden");
  });

  it("keeps a lazy image in layout while loading and hides the fallback on load", () => {
    const { getByAltText, getByText } = setUp(
      <ImageFrame src="image.png" alt="Preview" loading="lazy" fallback="Loading" />,
    );
    const image = getByAltText("Preview");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("hidden");
    fireEvent.load(image);
    expect(image).toHaveAttribute("data-loading-state", "loaded");
    expect(getByText("Loading")).toHaveAttribute("hidden");
  });

  it("uses srcSet when src is empty and hides the image on error", () => {
    const { getByAltText, getByText } = setUp(
      <ImageFrame src="" srcSet="image.png 1x" alt="Preview" fallback="Unavailable" />,
    );
    const image = getByAltText("Preview");
    expect(image).toHaveAttribute("data-loading-state", "loading");
    expect(image).toHaveAttribute("srcset", "image.png 1x");
    expect(image).not.toHaveAttribute("hidden");
    fireEvent.error(image);
    expect(image).toHaveAttribute("hidden");
    expect(getByText("Unavailable")).not.toHaveAttribute("hidden");
  });

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
});
