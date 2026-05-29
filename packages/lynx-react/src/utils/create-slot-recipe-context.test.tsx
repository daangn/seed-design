import { forwardRef } from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { createSlotRecipeContext } from "./create-slot-recipe-context";

type MockVariantProps = {
  variant?: "a" | "b";
};

type MockClassnames = {
  root: string;
  label: string;
};

const mockSlotRecipe = Object.assign(
  (props?: MockVariantProps): MockClassnames => ({
    root: `root-${props?.variant ?? "a"}`,
    label: `label-${props?.variant ?? "a"}`,
  }),
  {
    splitVariantProps: <T extends MockVariantProps>(props: T) => {
      const { variant, ...rest } = props;
      return [{ variant }, rest] as [MockVariantProps, Omit<T, keyof MockVariantProps>];
    },
  },
);

type MockProps = {
  children?: unknown;
  className?: string;
};

type MockReceived = { props?: MockProps };

function createMock(name: string) {
  const received: MockReceived = {};
  const Mock = forwardRef<{ tag: "mock" }, MockProps>((props) => {
    received.props = props;
    return <>{props.children as never}</>;
  });
  Mock.displayName = name;
  return { Mock, received };
}

describe("createSlotRecipeContext", () => {
  it("rejects intrinsic native tags to avoid Lynx BackgroundSnapshot errors", () => {
    const { withRootProvider, withProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);

    expect(() => withRootProvider<MockVariantProps>("view")).toThrow(
      /literal JSX.*BackgroundSnapshot/,
    );
    expect(() => withProvider<unknown, MockVariantProps>("view", "root")).toThrow(
      /literal JSX.*BackgroundSnapshot/,
    );
    expect(() => withContext<unknown, Record<string, unknown>>("text", "label")).toThrow(
      /literal JSX.*BackgroundSnapshot/,
    );
  });

  it("injects root classnames into context without applying className on the root element", () => {
    const { Mock: Root, received: rootReceived } = createMock("Root");
    const { Mock: Child, received: childReceived } = createMock("Child");
    const { withRootProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);

    const StyledRoot = withRootProvider<MockVariantProps & MockProps>(Root);
    const StyledLabel = withContext<{ tag: "mock" }, MockProps>(Child, "label");

    render(
      <StyledRoot variant="b">
        <StyledLabel />
      </StyledRoot>,
    );

    expect(rootReceived.props).not.toHaveProperty("className");
    expect(childReceived.props?.className).toBe("label-b");
  });

  it("applies and merges provider slot classnames", () => {
    const { Mock: Root, received: rootReceived } = createMock("Root");
    const { Mock: Child, received: childReceived } = createMock("Child");
    const { withProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);

    const StyledRoot = withProvider<{ tag: "mock" }, MockVariantProps & MockProps>(Root, "root");
    const StyledLabel = withContext<{ tag: "mock" }, MockProps>(Child, "label");

    render(
      <StyledRoot variant="a" className="extra">
        <StyledLabel className="child-extra" />
      </StyledRoot>,
    );

    expect(rootReceived.props?.className).toBe("root-a extra");
    expect(childReceived.props?.className).toBe("label-a child-extra");
  });
});
