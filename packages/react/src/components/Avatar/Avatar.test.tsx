import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { AvatarFallback, AvatarImage, AvatarRoot } from "./Avatar";

describe("Avatar.Image", () => {
  it("forwards a srcSet-only lazy source to the shared image primitive", () => {
    const { getByAltText, getByText } = render(
      <AvatarRoot>
        <AvatarImage srcSet="avatar.png 1x" loading="lazy" alt="Profile" />
        <AvatarFallback>AB</AvatarFallback>
      </AvatarRoot>,
    );
    const image = getByAltText("Profile");
    expect(image).toHaveAttribute("srcset", "avatar.png 1x");
    expect(image).toHaveAttribute("data-loading-state", "loading");
    expect(image).not.toHaveAttribute("hidden");
    fireEvent.load(image);
    expect(image).toHaveAttribute("data-loading-state", "loaded");
    expect(getByText("AB")).toHaveAttribute("hidden");
  });
});
