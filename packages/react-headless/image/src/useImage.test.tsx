import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import type { ReactElement } from "react";

import { useImage, type UseImageProps } from "./useImage";

const ROOT_TEST_ID = "image-root";
const FALLBACK_TEXT = "AB";
const IMAGE_ALT_TEXT = "Fake Image";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function Image(props: UseImageProps) {
  const { rootProps, getContentProps, fallbackProps } = useImage(props);
  return (
    <div data-testid={ROOT_TEST_ID} {...rootProps}>
      <img {...getContentProps({})} alt={IMAGE_ALT_TEXT} />
      <span {...fallbackProps}>{FALLBACK_TEXT}</span>
    </div>
  );
}

describe("useImage", () => {
  it("initial state is loading", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("data-loading-state", "loading");
  });

  it("should not render the image initially", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).not.toBeVisible();
  });

  it("should render the fallback initially", () => {
    const { queryByText } = setUp(<Image />);
    const fallback = queryByText(FALLBACK_TEXT);
    expect(fallback).toBeVisible();
  });
});
