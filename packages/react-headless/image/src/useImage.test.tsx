import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import type { ReactElement } from "react";

import { useImage, type UseImageProps } from "./useImage";

const ROOT_TEST_ID = "image-root";
const FALLBACK_TEXT = "AB";
const IMAGE_ALT_TEXT = "Fake Image";

function setUp(jsx: ReactElement) {
  return render(jsx);
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
  it("exposes the loading state via data-loading-state on the root, image, and fallback", () => {
    const { getByAltText, getByText, getByTestId } = setUp(<Image />);
    expect(getByTestId(ROOT_TEST_ID)).toHaveAttribute("data-loading-state", "loading");
    expect(getByAltText(IMAGE_ALT_TEXT)).toHaveAttribute("data-loading-state", "loading");
    expect(getByText(FALLBACK_TEXT)).toHaveAttribute("data-loading-state", "loading");
  });

  it("hides the image from the a11y tree before it loads", () => {
    const { getByAltText } = setUp(<Image />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    // aria-hidden 으로 a11y 노출을 막고, data-visible 은 부여하지 않는다.
    // 시각 처리(fallback overlay 등)는 styled layer 책임.
    expect(image).toHaveAttribute("aria-hidden", "true");
    expect(image).not.toHaveAttribute("data-visible");
  });

  it("marks the fallback as visible via data-visible before it loads", () => {
    const { getByText } = setUp(<Image />);
    const fallback = getByText(FALLBACK_TEXT);
    // dataAttr() 컨벤션: truthy면 빈 문자열로 attribute를 부여, falsy면 attribute 자체를 생략
    expect(fallback).toHaveAttribute("data-visible");
  });
});
