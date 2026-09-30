/// <reference path="./assets.d.ts" />

import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import type { NodesRef } from "@lynx-js/types";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
  IdentityPlaceholderImage,
  type IdentityPlaceholderImageProps,
  IdentityPlaceholderRoot,
  type IdentityPlaceholderRootProps,
} from "./IdentityPlaceholder";
import businessSource from "./identity-placeholder-business.webp";
import personSource from "./identity-placeholder-person.webp";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getPlaceholder() {
  const root = getRenderedRoot();

  return {
    placeholderRoot: root.querySelector(".seed-identity-placeholder__root"),
    image: root.querySelector(".seed-identity-placeholder__image"),
  };
}

describe("IdentityPlaceholder", () => {
  it("defaults to the person asset in a native view and aspect-fit image", () => {
    render(
      <IdentityPlaceholderRoot>
        <IdentityPlaceholderImage />
      </IdentityPlaceholderRoot>,
    );

    const { placeholderRoot, image } = getPlaceholder();

    expect(placeholderRoot?.tagName.toLowerCase()).toBe("view");
    expect(image?.tagName.toLowerCase()).toBe("image");
    expect(image).toHaveAttribute("src", personSource);
    expect(image).toHaveAttribute("mode", "aspectFit");
    expect(image).toHaveAttribute("accessibility-label", "Identity placeholder");
    expect(image).toHaveAttribute("accessibility-traits", "image");
  });

  it("selects the business asset for identity business", () => {
    render(
      <IdentityPlaceholderRoot identity="business">
        <IdentityPlaceholderImage />
      </IdentityPlaceholderRoot>,
    );

    const { image } = getPlaceholder();

    expect(personSource).not.toBe(businessSource);
    expect(image).toHaveAttribute("src", businessSource);
    expect(image).toHaveAttribute("mode", "aspectFit");
  });

  it("merges user className, style and refs onto the matching hosts", () => {
    const rootRef = createRef<NodesRef>();
    const imageRef = createRef<NodesRef>();

    render(
      <IdentityPlaceholderRoot
        ref={rootRef}
        className="custom-root"
        style={{ borderRadius: "8px" }}
      >
        <IdentityPlaceholderImage ref={imageRef} className="custom-image" />
      </IdentityPlaceholderRoot>,
    );

    const { placeholderRoot, image } = getPlaceholder();

    expect(placeholderRoot).toHaveClass("seed-identity-placeholder__root", "custom-root");
    expect(placeholderRoot).toHaveStyle({ borderRadius: "8px" });
    expect(image).toHaveClass("seed-identity-placeholder__image", "custom-image");
    expect(rootRef.current).not.toBeNull();
    expect(imageRef.current).not.toBeNull();
  });

  it("lets image props override the default accessibility label and traits", () => {
    render(
      <IdentityPlaceholderRoot>
        <IdentityPlaceholderImage
          accessibility-label="프로필 이미지 없음"
          accessibility-traits="none"
        />
      </IdentityPlaceholderRoot>,
    );

    const { image } = getPlaceholder();

    expect(image).toHaveAttribute("accessibility-label", "프로필 이미지 없음");
    expect(image).toHaveAttribute("accessibility-traits", "none");
  });

  it("throws when Image is rendered outside Root", () => {
    expect(() => render(<IdentityPlaceholderImage />)).toThrow();
  });

  it("exposes only styled props on Root and keeps src, mode and children owned by Image", () => {
    expectTypeOf<keyof IdentityPlaceholderRootProps>().toEqualTypeOf<
      "identity" | "children" | "className" | "style"
    >();
    expectTypeOf<IdentityPlaceholderImageProps>().not.toHaveProperty("src");
    expectTypeOf<IdentityPlaceholderImageProps>().not.toHaveProperty("mode");
    expectTypeOf<IdentityPlaceholderImageProps>().not.toHaveProperty("children");
    expectTypeOf<IdentityPlaceholderImageProps>().toHaveProperty("accessibility-label");
  });
});
