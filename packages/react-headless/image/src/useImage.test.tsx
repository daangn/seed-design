import { fireEvent, render } from "@testing-library/react";
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
  const { rootProps, getContentProps, fallbackProps, handleLoad, handleError } = useImage(props);
  return (
    <div data-testid={ROOT_TEST_ID} {...rootProps}>
      <img
        {...getContentProps({})}
        alt={IMAGE_ALT_TEXT}
        onLoad={handleLoad}
        onError={handleError}
      />
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

  it("should not hide the image while loading", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should render the fallback initially", () => {
    const { queryByText } = setUp(<Image />);
    const fallback = queryByText(FALLBACK_TEXT);
    expect(fallback).toBeVisible();
  });

  it("should hide the image when loading fails", () => {
    const { getByAltText, queryByText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.error(image);

    expect(image).toHaveAttribute("data-loading-state", "error");
    expect(image).toHaveAttribute("hidden");
    expect(queryByText(FALLBACK_TEXT)).toBeVisible();
  });

  it("should hide the fallback once the image is loaded", () => {
    const { getByAltText, queryByText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.load(image);

    expect(image).toHaveAttribute("data-loading-state", "loaded");
    expect(image).not.toHaveAttribute("hidden");
    expect(queryByText(FALLBACK_TEXT)).not.toBeVisible();
  });
});
