import { forwardRef } from "@lynx-js/react";
import { render, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { createRecipeContext } from "../create-recipe-context";

type MockVariantProps = {
  variant?: "a" | "b";
  size?: "sm" | "md";
};

const mockRecipe = Object.assign(
  (props?: MockVariantProps) => `mock-${props?.variant ?? "a"}-${props?.size ?? "sm"}`,
  {
    splitVariantProps: <T extends MockVariantProps>(props: T) => {
      const { variant, size, ...rest } = props;
      return [{ variant, size }, rest] as [MockVariantProps, Omit<T, keyof MockVariantProps>];
    },
  },
);

type MockReceived = { props?: Record<string, unknown>; refValue?: unknown };

function createMock() {
  const received: MockReceived = {};
  const Mock = forwardRef<{ tag: "mock" }, Record<string, unknown>>((props, ref) => {
    received.props = props;
    received.refValue = ref;
    return null;
  });
  Mock.displayName = "Mock";
  return { Mock, received };
}

describe("createRecipeContext", () => {
  it("applies variant className to the wrapped component", () => {
    const { Mock, received } = createMock();
    const { withContext } = createRecipeContext(mockRecipe);
    const Styled = withContext<{ tag: "mock" }, MockVariantProps>(Mock);

    render(<Styled variant="b" size="md" />);

    expect(received.props?.className).toBe("mock-b-md");
  });

  it("falls back to defaults when no variant props are provided", () => {
    const { Mock, received } = createMock();
    const { withContext } = createRecipeContext(mockRecipe);
    const Styled = withContext<{ tag: "mock" }, MockVariantProps>(Mock);

    render(<Styled />);

    expect(received.props?.className).toBe("mock-a-sm");
  });

  it("passes PropsProvider value into the wrapped recipe", () => {
    const { Mock, received } = createMock();
    const { withContext, PropsProvider } = createRecipeContext(mockRecipe);
    const Styled = withContext<{ tag: "mock" }, MockVariantProps>(Mock);

    render(
      <PropsProvider value={{ variant: "b", size: "md" }}>
        <Styled />
      </PropsProvider>,
    );

    expect(received.props?.className).toBe("mock-b-md");
  });

  it("prefers innerProps over PropsProvider value", () => {
    const { Mock, received } = createMock();
    const { withContext, PropsProvider } = createRecipeContext(mockRecipe);
    const Styled = withContext<{ tag: "mock" }, MockVariantProps>(Mock);

    render(
      <PropsProvider value={{ variant: "b", size: "md" }}>
        <Styled variant="a" />
      </PropsProvider>,
    );

    expect(received.props?.className).toBe("mock-a-md");
  });

  it("merges defaultProps below PropsProvider and innerProps", () => {
    const { Mock, received } = createMock();
    const { withContext, PropsProvider } = createRecipeContext(mockRecipe);
    const Styled = withContext<{ tag: "mock" }, MockVariantProps>(Mock, {
      defaultProps: { variant: "a", size: "md" },
    });

    render(
      <PropsProvider value={{ size: "sm" }}>
        <Styled />
      </PropsProvider>,
    );

    expect(received.props?.className).toBe("mock-a-sm");
  });

  it("combines recipe className with user-provided className via clsx", () => {
    const { Mock, received } = createMock();
    const { withContext } = createRecipeContext(mockRecipe);
    type StyledProps = MockVariantProps & { className?: string };
    const Styled = withContext<{ tag: "mock" }, StyledProps>(Mock);

    render(<Styled variant="a" size="sm" className="extra" />);

    expect(received.props?.className).toBe("mock-a-sm extra");
  });

  it("forwards the ref to the wrapped component", () => {
    const { Mock, received } = createMock();
    const { withContext } = createRecipeContext(mockRecipe);
    const Styled = withContext<{ tag: "mock" }, MockVariantProps>(Mock);
    const refFn = (node: { tag: "mock" } | null) => {
      received.refValue = node;
    };

    render(<Styled ref={refFn} variant="a" />);

    expect(received.refValue).toBe(refFn);
  });

  it("splits variant props away from native props before rendering", () => {
    const { Mock, received } = createMock();
    const { withContext } = createRecipeContext(mockRecipe);
    type StyledProps = MockVariantProps & { "data-testid"?: string };
    const Styled = withContext<{ tag: "mock" }, StyledProps>(Mock);

    render(<Styled variant="b" size="md" data-testid="hello" />);

    expect(received.props?.["data-testid"]).toBe("hello");
    expect(received.props).not.toHaveProperty("variant");
    expect(received.props).not.toHaveProperty("size");
  });

  describe("useProps", () => {
    it("returns null outside of PropsProvider", () => {
      const { useProps } = createRecipeContext(mockRecipe);
      const { result } = renderHook(() => useProps());

      expect(result.current).toBeNull();
    });

    it("returns the provided value inside PropsProvider", () => {
      const { useProps, PropsProvider } = createRecipeContext(mockRecipe);
      const { result } = renderHook(() => useProps(), {
        wrapper: ({ children }) => (
          <PropsProvider value={{ variant: "b", size: "md" }}>{children}</PropsProvider>
        ),
      });

      expect(result.current).toEqual({ variant: "b", size: "md" });
    });
  });
});
