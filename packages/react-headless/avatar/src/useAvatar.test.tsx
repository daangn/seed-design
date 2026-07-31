import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import type { ReactElement } from "react";

import { Avatar as AvatarPrimitive } from "./index";
import { useAvatar, type UseAvatarProps } from "./useAvatar";

const ROOT_TEST_ID = "avatar-root";
const FALLBACK_TEXT = "AB";
const IMAGE_ALT_TEXT = "Fake Avatar";
const IMAGE_SRC = "fake-avatar.png";
const IMAGE_SRC_SET = "fake-avatar-1x.png 1x, fake-avatar-2x.png 2x";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

// src에 기본값을 두지 않는다. 기본 파라미터는 `src={undefined}`를 삼켜서
// "src 없음" 케이스를 검증할 수 없게 만든다.
function Avatar({ src, srcSet, ...props }: UseAvatarProps & { src?: string; srcSet?: string }) {
  const { rootProps, getImageProps, fallbackProps } = useAvatar(props);
  return (
    <div data-testid={ROOT_TEST_ID} {...rootProps}>
      <img {...getImageProps({ src, srcSet })} alt={IMAGE_ALT_TEXT} />
      <span {...fallbackProps}>{FALLBACK_TEXT}</span>
    </div>
  );
}

describe("useAvatar", () => {
  it("initial state is loading", () => {
    const { getByAltText } = setUp(<Avatar src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("data-loading-state", "loading");
  });

  it("should not hide the image while loading", () => {
    const { getByAltText } = setUp(<Avatar src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should render the fallback initially", () => {
    const { queryByText } = setUp(<Avatar src={IMAGE_SRC} />);
    const fallback = queryByText(FALLBACK_TEXT);
    expect(fallback).toBeVisible();
  });

  it("should hide the image when there is no src", () => {
    const { getByAltText } = setUp(<Avatar />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("hidden");
  });

  // srcSet만 있는 반응형 이미지는 src 없이도 로드된다
  it("should not hide a srcSet-only image", () => {
    const { getByAltText } = setUp(<Avatar srcSet={IMAGE_SRC_SET} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("srcset", IMAGE_SRC_SET);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should stop hiding the image once it loads without any source", () => {
    const { getByAltText } = setUp(<Avatar />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.load(image);

    expect(image).not.toHaveAttribute("hidden");
  });

  // fallback이 이니셜 텍스트인 경우가 많아, 로딩 중 alt와 함께 중복 낭독되는 걸 막는다.
  // 반대로 img를 빼면 하이드레이션 전까지 보이는 이미지에 접근 가능한 이름이 없어진다.
  it("should announce the image, not the fallback, while loading", () => {
    const { getByAltText, getByText } = setUp(<Avatar src={IMAGE_SRC} />);
    expect(getByAltText(IMAGE_ALT_TEXT)).not.toHaveAttribute("aria-hidden");
    expect(getByText(FALLBACK_TEXT)).toHaveAttribute("aria-hidden", "true");
  });

  it("should announce the fallback when loading fails", () => {
    const { getByAltText, getByText } = setUp(<Avatar src={IMAGE_SRC} />);

    fireEvent.error(getByAltText(IMAGE_ALT_TEXT));

    expect(getByText(FALLBACK_TEXT)).not.toHaveAttribute("aria-hidden");
  });

  it("should hide the image when loading fails", () => {
    const { getByAltText, queryByText } = setUp(<Avatar src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.error(image);

    expect(image).toHaveAttribute("data-loading-state", "error");
    expect(image).toHaveAttribute("hidden");
    expect(queryByText(FALLBACK_TEXT)).toBeVisible();
  });

  it("should hide the fallback once the image is loaded", () => {
    const { getByAltText, queryByText } = setUp(<Avatar src={IMAGE_SRC} />);
    const image = getByAltText(IMAGE_ALT_TEXT);

    fireEvent.load(image);

    expect(image).toHaveAttribute("data-loading-state", "loaded");
    expect(image).not.toHaveAttribute("hidden");
    expect(queryByText(FALLBACK_TEXT)).not.toBeVisible();
  });
});

// 위 테스트는 훅을 직접 호출하므로 Avatar.Image가 프로퍼티를 훅에 넘기는지는 검증하지 못한다.
describe("Avatar.Image", () => {
  function Compound(props: { src?: string; srcSet?: string }) {
    return (
      <AvatarPrimitive.Root>
        <AvatarPrimitive.Image {...props} alt={IMAGE_ALT_TEXT} />
        <AvatarPrimitive.Fallback>{FALLBACK_TEXT}</AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  }

  it("should not hide a srcSet-only image", () => {
    const { getByAltText } = setUp(<Compound srcSet={IMAGE_SRC_SET} />);
    const image = getByAltText(IMAGE_ALT_TEXT);
    expect(image).toHaveAttribute("srcset", IMAGE_SRC_SET);
    expect(image).not.toHaveAttribute("hidden");
  });

  it("should hide an image with no source", () => {
    const { getByAltText } = setUp(<Compound />);
    expect(getByAltText(IMAGE_ALT_TEXT)).toHaveAttribute("hidden");
  });
});
