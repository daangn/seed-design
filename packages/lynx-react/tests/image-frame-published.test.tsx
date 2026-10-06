import { cleanup, render } from "@lynx-js/react/testing-library";
import { useImageContext } from "@seed-design/lynx-react-image";
import { afterEach, expect, it } from "vitest";
import { ImageFrame, ImageFrameBadge } from "../lib/components/ImageFrame/ImageFrame.jsx";

afterEach(cleanup);

// This integration test deliberately consumes the built package and a separate
// public headless import, just as an application does after publishing.
function Status() {
  return <text>{useImageContext().loadingStatus}</text>;
}

it("shares the published image context with public headless consumers", () => {
  expect(() =>
    render(
      <ImageFrame src="photo.png" alt="Photo">
        <Status />
        <ImageFrameBadge tone="brand" variant="solid">NEW</ImageFrameBadge>
      </ImageFrame>,
    ),
  ).not.toThrow();
  expect(elementTree.root?.querySelector(".seed-badge__label")?.textContent).toBe("NEW");
});
