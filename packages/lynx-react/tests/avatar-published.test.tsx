import { cleanup, render } from "@lynx-js/react/testing-library";
import { Image, useImageContext } from "@seed-design/lynx-react-image";
import { afterEach, expect, it } from "vitest";
import { AvatarRoot } from "../lib/components/Avatar/Avatar.jsx";

afterEach(cleanup);

// Consume the build and public headless import as a published application does.
function Status() {
  return <text>{useImageContext().loadingStatus}</text>;
}
it("shares the published image context with public headless consumers", () => {
  expect(() =>
    render(
      <AvatarRoot>
        <Status />
        <Image.Content src="profile.png" />
      </AvatarRoot>,
    ),
  ).not.toThrow();
});
