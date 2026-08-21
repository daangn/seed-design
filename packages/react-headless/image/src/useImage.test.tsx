import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import type { ReactElement } from "react";

import { Image as ImagePrimitive } from "./index";
import { useImage, type UseImageProps } from "./useImage";

const ROOT_TEST_ID = "image-root";
const FALLBACK_TEXT = "AB";
const IMAGE_ALT_TEXT = "Fake Image";
const IMAGE_SRC = "fake-image.png";
const IMAGE_SRC_SET = "fake-image-1x.png 1x, fake-image-2x.png 2x";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function Image({ src, srcSet, ...props }: UseImageProps & { src?: string; srcSet?: string }) {
  const { rootProps, getContentProps, fallbackProps, handleLoad, handleError } = useImage(props);
  return (
    <div data-testid={ROOT_TEST_ID} {...rootProps}>
      <img
        {...getContentProps({ src, srcSet })}
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
    const { getByAltText } = setUp(<Image src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("data-loading-state", "loading");
  });

  it("should not hide the image while loading", () => {
    const { getByAltText } = setUp(<Image src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should render the fallback initially", () => {
    const { queryByText } = setUp(<Image src={IMAGE_SRC} />);
    const fallback = queryByText(FALLBACK_TEXT);
    expect(fallback).toBeVisible();
  });

  it("should hide the image when there is no src", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("hidden");
  });

  it("should not hide a srcSet-only image", () => {
    const { getByAltText } = setUp(<Image srcSet={IMAGE_SRC_SET} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("srcset", IMAGE_SRC_SET);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should stop hiding the image once it loads without any source", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.load(image);

    expect(image).not.toHaveAttribute("hidden");
  });

  it("should hide the image when loading fails", () => {
    const { getByAltText, queryByText } = setUp(<Image src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.error(image);

    expect(image).toHaveAttribute("data-loading-state", "error");
    expect(image).toHaveAttribute("hidden");
    expect(queryByText(FALLBACK_TEXT)).toBeVisible();
  });

  it("should hide the fallback once the image is loaded", () => {
    const { getByAltText, queryByText } = setUp(<Image src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.load(image);

    expect(image).toHaveAttribute("data-loading-state", "loaded");
    expect(image).not.toHaveAttribute("hidden");
    expect(queryByText(FALLBACK_TEXT)).not.toBeVisible();
  });
});

describe("Image.Content", () => {
  function Compound(props: { src?: string; srcSet?: string }) {
    return (
      <ImagePrimitive.Root>
        <ImagePrimitive.Content {...props} alt={IMAGE_ALT_TEXT} />
        <ImagePrimitive.Fallback>{FALLBACK_TEXT}</ImagePrimitive.Fallback>
      </ImagePrimitive.Root>
    );
  }

  it("should treat a srcSet-only image as loading, not an error", () => {
    const { getByAltText } = setUp(<Compound srcSet={IMAGE_SRC_SET} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("data-loading-state", "loading");
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should treat an image with no source as an error", () => {
    const { getByAltText } = setUp(<Compound />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("data-loading-state", "error");
    expect(image).toHaveAttribute("hidden");
  });
});
