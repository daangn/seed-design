import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import type { ReactElement } from "react";

import { useAvatar, type UseAvatarProps } from "./useAvatar";

const ROOT_TEST_ID = "avatar-root";
const FALLBACK_TEXT = "AB";
const IMAGE_ALT_TEXT = "Fake Avatar";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function Avatar(props: UseAvatarProps) {
  const { rootProps, getImageProps, fallbackProps } = useAvatar(props);
  return (
    <div data-testid={ROOT_TEST_ID} {...rootProps}>
      <img {...getImageProps({})} alt={IMAGE_ALT_TEXT} />
      <span {...fallbackProps}>{FALLBACK_TEXT}</span>
    </div>
  );
}

describe("useAvatar", () => {
  it("initial state is loading", () => {
    const { getByAltText } = setUp(<Avatar />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("data-loading-state", "loading");
  });

  it("should not render the image initially", () => {
    const { getByAltText } = setUp(<Avatar />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).not.toBeVisible();
  });

  it("should render the fallback initially", () => {
    const { queryByText } = setUp(<Avatar />);
    const fallback = queryByText(FALLBACK_TEXT);
    expect(fallback).toBeVisible();
  });
});
