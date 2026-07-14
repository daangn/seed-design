import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import { wrapSlotChildren } from "./wrapSlotChildren";

interface HostProps extends PrimitiveProps, React.HTMLAttributes<HTMLButtonElement> {}

/** Minimal stand-in for the styled item hosts (MenuItem etc.): root Primitive + layout wrapper. */
const Host = React.forwardRef<HTMLButtonElement, HostProps>(({ children, ...props }, ref) => (
  <Primitive.button ref={ref} className="root" {...props}>
    {wrapSlotChildren(props.asChild, children, (layoutChildren) => (
      <div className="layout">{layoutChildren}</div>
    ))}
  </Primitive.button>
));

describe("wrapSlotChildren", () => {
  it("wraps children with the layout layer without asChild", () => {
    const { container } = render(
      <Host>
        label<span>caption</span>
      </Host>,
    );

    const root = container.querySelector("button.root");
    const layout = root?.querySelector(":scope > div.layout");

    expect(layout).not.toBeNull();
    expect(layout).toHaveTextContent("labelcaption");
    expect(layout?.querySelector("span")).not.toBeNull();
  });

  it("keeps the consumer element as root and lands the layout inside with asChild", () => {
    const { container } = render(
      <Host asChild>
        <a href="#link">
          label<span>caption</span>
        </a>
      </Host>,
    );

    const root = container.querySelector("a.root");
    const layout = root?.querySelector(":scope > div.layout");

    expect(root).toHaveAttribute("href", "#link");
    expect(container.querySelector("button")).toBeNull();
    expect(layout).not.toBeNull();
    expect(layout).toHaveTextContent("labelcaption");
  });

  it("degrades gracefully (no wrapper, no crash) when chaining asChild slots", () => {
    const { container } = render(
      <Host asChild>
        <Primitive.button asChild>
          <a href="#chained">label</a>
        </Primitive.button>
      </Host>,
    );

    const root = container.querySelector("a.root");

    expect(root).toHaveAttribute("href", "#chained");
    expect(root).toHaveTextContent("label");
    expect(container.querySelector(".layout")).toBeNull();
  });

  it("does not inject children into a void element", () => {
    const { container } = render(
      <Host asChild>
        <img alt="pic" src="pic.png" />
      </Host>,
    );

    const root = container.querySelector("img.root");

    expect(root).toHaveAttribute("alt", "pic");
    expect(container.querySelector(".layout")).toBeNull();
  });

  it("does not inject children into a dangerouslySetInnerHTML target", () => {
    const { container } = render(
      <Host asChild>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: exercising the childless guard */}
        <div dangerouslySetInnerHTML={{ __html: "<b>markup</b>" }} />
      </Host>,
    );

    const root = container.querySelector("div.root");

    expect(root?.querySelector("b")).toHaveTextContent("markup");
    expect(container.querySelector(".layout")).toBeNull();
  });

  it("leaves render-prop children untouched", () => {
    function RenderProp(props: {
      children?: React.ReactNode | (() => React.ReactNode);
      className?: string;
    }) {
      const { children, ...rest } = props;

      return <button {...rest}>{typeof children === "function" ? children() : children}</button>;
    }

    const { container } = render(
      <Host asChild>
        <RenderProp>{() => <span>rendered</span>}</RenderProp>
      </Host>,
    );

    const root = container.querySelector("button.root");

    expect(root?.querySelector("span")).toHaveTextContent("rendered");
    expect(container.querySelector(".layout")).toBeNull();
  });

  it("merges the host ref and the consumer ref onto the same element", () => {
    let hostNode: HTMLElement | null = null;
    let childNode: HTMLElement | null = null;

    render(
      <Host
        asChild
        ref={(node) => {
          hostNode = node;
        }}
      >
        <a
          ref={(node) => {
            childNode = node;
          }}
          href="#ref"
        >
          label
        </a>
      </Host>,
    );

    expect(hostNode).toBeInstanceOf(HTMLAnchorElement);
    expect(hostNode).not.toBeNull();
    expect(hostNode).toBe(childNode);
  });
});
