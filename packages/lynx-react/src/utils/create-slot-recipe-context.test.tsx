import { forwardRef, memo } from "@lynx-js/react";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

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
  active?: boolean;
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

    expect(() => withRootProvider<MockVariantProps>("view")).toThrow();
    expect(() => withProvider<unknown, MockVariantProps>("view", "root")).toThrow();
    expect(() => withContext<unknown, Record<string, unknown>>("text", "label")).toThrow();
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

  it("restores root default props overwritten with undefined", () => {
    const { Mock: Root, received } = createMock("Root");
    const { withRootProvider } = createSlotRecipeContext(mockSlotRecipe);
    const StyledRoot = withRootProvider<MockVariantProps & MockProps>(Root, {
      defaultProps: { active: true },
    });

    render(<StyledRoot active={undefined} />);

    expect(received.props?.active).toBe(true);
  });

  it("restores provider default props overwritten with undefined", () => {
    const { Mock: Root, received } = createMock("Root");
    const { withProvider } = createSlotRecipeContext(mockSlotRecipe);
    const StyledRoot = withProvider<{ tag: "mock" }, MockVariantProps & MockProps>(Root, "root", {
      defaultProps: { active: true },
    });

    render(<StyledRoot active={undefined} />);

    expect(received.props?.active).toBe(true);
  });

  it("restores context default props overwritten with undefined and preserves false", () => {
    const { Mock: Root } = createMock("Root");
    const { Mock: Child, received } = createMock("Child");
    const { withRootProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);
    const StyledRoot = withRootProvider<MockVariantProps & MockProps>(Root);
    const StyledChild = withContext<{ tag: "mock" }, MockProps>(Child, "label", {
      defaultProps: { active: true },
    });

    const { rerender } = render(
      <StyledRoot>
        <StyledChild active={undefined} />
      </StyledRoot>,
    );

    expect(received.props?.active).toBe(true);

    rerender(
      <StyledRoot>
        <StyledChild active={false} />
      </StyledRoot>,
    );

    expect(received.props?.active).toBe(false);
  });
});

it("only invalidates recipe consumers when classes or variants change", () => {
  const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
    createSlotRecipeContext(mockSlotRecipe);
  const readClasses = vi.fn();
  const readProps = vi.fn();
  const ClassConsumer = memo(() => {
    readClasses(useClassNames());
    return null;
  });
  const PropsConsumer = memo(() => {
    readProps(useProps());
    return null;
  });
  function Example({
    variant,
    includeVariant = true,
  }: {
    variant: "a" | "b";
    includeVariant?: boolean;
  }) {
    return (
      <ClassNamesProvider value={mockSlotRecipe({ variant })}>
        <PropsProvider value={includeVariant ? { variant } : {}}>
          <ClassConsumer />
          <PropsConsumer />
        </PropsProvider>
      </ClassNamesProvider>
    );
  }
  const view = render(<Example variant="a" />);
  const classRenders = readClasses.mock.calls.length;
  const propsRenders = readProps.mock.calls.length;
  view.rerender(<Example variant="a" />);
  expect(readClasses).toHaveBeenCalledTimes(classRenders);
  expect(readProps).toHaveBeenCalledTimes(propsRenders);
  view.rerender(<Example variant="b" />);
  expect(readClasses).toHaveBeenLastCalledWith({ root: "root-b", label: "label-b" });
  expect(readProps).toHaveBeenLastCalledWith({ variant: "b" });
  expect(readClasses.mock.calls.length).toBeGreaterThan(classRenders);
  view.rerender(<Example variant="b" includeVariant={false} />);
  expect(readProps).toHaveBeenLastCalledWith({});
});
