import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { vars } from "@seed-design/lynx-css/vars";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../../types";
import { Icon, PrefixIcon, SuffixIcon } from "../Icon";

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lynx-js/react")>();

  return {
    ...actual,
    runOnMainThread: () => () => undefined,
  };
});

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

const MockIcon = React.forwardRef<unknown, LynxIconElementProps>((props, ref) => {
  const { className, style, ...rest } = props;

  return (
    <image
      {...rest}
      {...(ref ? { "main-thread:ref": ref as React.Ref<unknown> } : {})}
      className={className}
      style={style}
    />
  );
});
MockIcon.displayName = "MockIcon";

describe("Icon", () => {
  it("renders a wrapped icon image that fills the wrapper", () => {
    render(
      <Icon
        icon={<MockIcon className="child-icon" />}
        className="custom-icon"
        size={20}
        color="fg.brand"
      />,
    );

    const root = getRenderedRoot();
    const wrapper = root.querySelector(".seed-icon");
    const image = wrapper?.querySelector("image");

    expect(wrapper).toHaveClass("custom-icon");
    expect(wrapper).toHaveStyle({ width: "20px", height: "20px" });
    expect((wrapper as HTMLElement).style.getPropertyValue("color")).toBe(vars.$color.fg.brand);
    expect(image).toHaveClass("child-icon");
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
  });

  it("renders prefix and suffix wrappers with global slot classes", () => {
    render(
      <view>
        <PrefixIcon icon={<MockIcon />} />
        <SuffixIcon icon={<MockIcon />} />
      </view>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector(".seed-prefix-icon")).toBeInTheDocument();
    expect(root.querySelector(".seed-suffix-icon")).toBeInTheDocument();
  });
});
