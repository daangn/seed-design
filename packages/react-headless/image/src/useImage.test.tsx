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

// src에 기본값을 두지 않는다. 기본 파라미터는 `src={undefined}`를 삼켜서
// "src 없음" 케이스를 검증할 수 없게 만든다.
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

  // srcSet만 있는 반응형 이미지는 src 없이도 로드된다
  it("should not hide a srcSet-only image", () => {
    const { getByAltText } = setUp(<Image srcSet={IMAGE_SRC_SET} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should stop hiding the image once it loads without any source", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.load(image);

    expect(image).not.toHaveAttribute("hidden");
  });

  it("should keep the image out of the accessibility tree until it is loaded", () => {
    const { getByAltText } = setUp(<Image src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("aria-hidden", "true");

    fireEvent.load(image);

    expect(image).not.toHaveAttribute("aria-hidden");
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

// 로딩 상태는 Image.Content가 setSrc로 정하므로 합성 컴포넌트로 확인한다.
// recipe CSS가 `[data-loading-state='error']`를 숨기기 때문에, srcSet 전용이 error로
// 분류되면 hidden 속성을 고쳐도 CSS가 다시 숨겨 lazy 데드락이 재발한다.
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
