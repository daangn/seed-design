import { Primitive } from "@seed-design/react-primitive";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import { PageBannerContent, PageBannerRoot } from "../components/PageBanner/PageBanner";
import { withContentScale } from "./withContentScale";

const Pressable = withContentScale(Primitive.button);

describe("withContentScale", () => {
  describe("without asChild", () => {
    it("makes the content scale box the element's only child, holding the children", () => {
      const { container } = render(
        <Pressable>
          <span>prefix</span>
          <span>body</span>
        </Pressable>,
      );

      const root = container.firstElementChild;
      const box = root?.firstElementChild;

      expect(root?.tagName).toBe("BUTTON");
      expect(root?.childNodes.length).toBe(1);
      expect(box?.outerHTML).toBe(
        '<span class="seed-content-scale"><span>prefix</span><span>body</span></span>',
      );
    });

    it("forwards className and ref to the element and opts it into scale feedback", () => {
      const ref = React.createRef<HTMLButtonElement>();
      const { container } = render(
        <Pressable ref={ref} className="custom">
          content
        </Pressable>,
      );

      const root = container.firstElementChild;

      expect(root?.className).toBe("seed-scale-feedback custom");
      expect(ref.current).toBe(root as HTMLButtonElement);
    });
  });

  describe("with asChild", () => {
    it("renders the child as the element and wraps the child's children in the box", () => {
      const ref = React.createRef<HTMLButtonElement>();
      const childRef = React.createRef<HTMLAnchorElement>();
      const { container } = render(
        <Pressable asChild ref={ref} className="custom">
          <a href="/x" className="link" ref={childRef}>
            <span>text</span>
          </a>
        </Pressable>,
      );

      const root = container.firstElementChild;

      expect(container.childNodes.length).toBe(1);
      expect(root?.tagName).toBe("A");
      expect(root?.getAttribute("href")).toBe("/x");
      expect(root?.className).toBe("seed-scale-feedback custom link");
      expect(ref.current).toBe(root as HTMLButtonElement);
      expect(childRef.current).toBe(root as HTMLAnchorElement);
      expect(root?.innerHTML).toBe('<span class="seed-content-scale"><span>text</span></span>');
    });
  });

  it("wraps an actionable PageBanner's button content through Root asChild", () => {
    const { container } = render(
      <PageBannerRoot asChild>
        <button type="button">
          <PageBannerContent>description</PageBannerContent>
        </button>
      </PageBannerRoot>,
    );

    const root = container.firstElementChild;
    const box = root?.firstElementChild;

    expect(root?.tagName).toBe("BUTTON");
    expect(root?.classList.contains("seed-scale-feedback")).toBe(true);
    expect(root?.childNodes.length).toBe(1);
    expect(box?.className).toBe("seed-content-scale");
    expect(box?.childNodes.length).toBe(1);
    expect(box?.textContent).toBe("description");
  });
});
