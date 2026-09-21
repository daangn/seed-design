import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import { ContentScale } from "./contentScale";

describe("ContentScale", () => {
  it("renders a span box around its children", () => {
    const { container } = render(
      <ContentScale>
        <span>content</span>
      </ContentScale>,
    );

    expect(container.innerHTML).toBe(
      '<span class="seed-content-scale"><span>content</span></span>',
    );
  });

  it("appends the given className to its own", () => {
    const { container } = render(<ContentScale className="custom">content</ContentScale>);

    expect(container.innerHTML).toBe('<span class="seed-content-scale custom">content</span>');
  });

  it("forwards ref to the span", () => {
    const ref = React.createRef<HTMLSpanElement>();
    const { container } = render(<ContentScale ref={ref}>content</ContentScale>);

    expect(ref.current).toBe(container.firstElementChild as HTMLSpanElement);
  });

  describe("asChild", () => {
    it("makes the child the box instead of rendering a span", () => {
      const { container } = render(
        <ContentScale asChild className="custom">
          <div className="child" data-testid="box">
            content
          </div>
        </ContentScale>,
      );

      expect(container.innerHTML).toBe(
        '<div class="seed-content-scale custom child" data-testid="box">content</div>',
      );
    });

    it("forwards ref to the child while keeping the child's own ref", () => {
      const ref = React.createRef<HTMLSpanElement>();
      const childRef = React.createRef<HTMLDivElement>();
      const { container } = render(
        <ContentScale asChild ref={ref}>
          <div ref={childRef}>content</div>
        </ContentScale>,
      );

      const box = container.firstElementChild;

      expect(box?.tagName).toBe("DIV");
      expect(ref.current).toBe(box as HTMLSpanElement);
      expect(childRef.current).toBe(box as HTMLDivElement);
    });
  });
});
