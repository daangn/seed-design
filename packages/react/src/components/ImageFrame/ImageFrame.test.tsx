import { imageFrameReactionButton } from "@seed-design/css/recipes/image-frame-reaction-button";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";
import { ImageFrame, ImageFrameReactionButton } from "./ImageFrame";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("ImageFrame", () => {
  // Lazy loading 데드락 회귀 방지.
  // 과거: useImage가 hidden 속성을 부여하고 recipe가 [data-loading-state!='loaded']에 display:none 을 적용해
  //       <img loading="lazy">의 viewport intersection 측정이 차단되어 영구히 fetch되지 않았다.
  // 현재: image element가 항상 layout에 존재하고 가시성은 fallback overlay + a11y는 aria-hidden 으로 처리한다.
  describe('loading="lazy"', () => {
    it('keeps the image element in the layout and forwards loading="lazy" so the browser can lazy-fetch', () => {
      const { getByAltText } = setUp(
        <ImageFrame ratio={4 / 3} loading="lazy" src="/lazy.png" alt="Lazy image" />,
      );
      const image = getByAltText("Lazy image");

      // viewport intersection 측정을 위해 layout box가 유지되어야 한다.
      expect(image).toBeInTheDocument();
      expect(image.tagName).toBe("IMG");

      // native loading 속성이 그대로 전달되어야 한다.
      expect(image).toHaveAttribute("loading", "lazy");

      // 로드 전엔 a11y에서 제외하고 fallback이 정보를 담당한다.
      expect(image).toHaveAttribute("aria-hidden", "true");
      expect(image).toHaveAttribute("data-loading-state", "loading");
    });

    it("transitions data-loading-state and aria-hidden when the image loads", () => {
      const onLoad = mock();
      const { getByAltText } = setUp(
        <ImageFrame
          ratio={4 / 3}
          loading="lazy"
          src="/lazy.png"
          alt="Lazy image"
          onLoad={onLoad}
        />,
      );
      const image = getByAltText("Lazy image");

      fireEvent.load(image);

      expect(image).toHaveAttribute("data-loading-state", "loaded");
      expect(image).toHaveAttribute("aria-hidden", "false");
      expect(onLoad).toHaveBeenCalled();
    });

    it("keeps the fallback present on error so the native broken icon is not exposed", () => {
      const onError = mock();
      const { getByAltText, getByText } = setUp(
        <ImageFrame
          ratio={4 / 3}
          loading="lazy"
          src="/missing.png"
          alt="Lazy image"
          fallback={<span>FB</span>}
          onError={onError}
        />,
      );
      const image = getByAltText("Lazy image");

      fireEvent.error(image);

      expect(image).toHaveAttribute("data-loading-state", "error");
      expect(getByText("FB")).toBeInTheDocument();
      expect(onError).toHaveBeenCalled();
    });
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
