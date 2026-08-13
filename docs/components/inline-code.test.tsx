import { render } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import { InlineCode } from "./inline-code";

mock.module("server-only", () => ({}));
mock.module("@/app/env", () => ({
  env: {
    figmaBypassCacheNodeIds: [],
    figmaCacheDisabled: false,
    figmaFileKey: undefined,
    figmaPersonalAccessToken: undefined,
  },
}));

function expectClassNames(element: HTMLElement, classNames: string[]) {
  for (const className of classNames) {
    expect(element.classList.contains(className)).toBe(true);
  }
}

describe("mdx inline code", () => {
  it("adds a visual horizontal inset without interrupting text selection", () => {
    const { getByText } = render(
      <InlineCode className="consumer-code">@seed-design/react@2.1.0</InlineCode>,
    );
    const code = getByText("@seed-design/react@2.1.0");

    expectClassNames(code, [
      "consumer-code",
      "border-0",
      "px-0",
      "[box-shadow:2px_0_0_var(--seed-color-bg-transparent-selected),-2px_0_0_var(--seed-color-bg-transparent-selected)]",
    ]);
  });

  it("uses the docs typographic marker treatment", () => {
    const { getByText } = render(<InlineCode>ResponsiveDialog</InlineCode>);
    const code = getByText("ResponsiveDialog");

    expectClassNames(code, [
      "rounded-r1",
      "bg-bg-transparent-selected",
      "font-mono",
      "font-medium",
      "leading-[inherit]",
      "wrap-anywhere",
    ]);
  });

  it("keeps the marker compact when inline code wraps", () => {
    const { getByText } = render(<InlineCode>@seed-design/react@2.1.0</InlineCode>);
    const code = getByText("@seed-design/react@2.1.0");

    expectClassNames(code, [
      "py-x0_5",
      "text-[0.92em]",
      "[box-decoration-break:clone]",
      "[-webkit-box-decoration-break:clone]",
    ]);
  });

  it("neutralizes the marker treatment inside a code block", () => {
    const { getByText } = render(
      <pre>
        <InlineCode>const dialog = true;</InlineCode>
      </pre>,
    );
    const code = getByText("const dialog = true;");

    expectClassNames(code, [
      "[pre_&]:rounded-none",
      "[pre_&]:bg-transparent",
      "[pre_&]:p-0",
      "[pre_&]:shadow-none",
      "[pre_&]:text-[inherit]",
      "[pre_&]:font-normal",
      "[pre_&]:[overflow-wrap:normal]",
    ]);
  });

  it("maps markdown backticks to the inline code treatment", async () => {
    const { mdxComponents } = await import("./mdx-components");

    expect(mdxComponents.code).toBe(InlineCode);
  });
});
