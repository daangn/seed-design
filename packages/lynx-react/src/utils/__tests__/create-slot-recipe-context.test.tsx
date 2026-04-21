import { forwardRef } from "@lynx-js/react";
import { render, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { createSlotRecipeContext } from "../create-slot-recipe-context";

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

type MockReceived = { props?: Record<string, unknown>; refValue?: unknown };

function createMock(name: string) {
  const received: MockReceived = {};
  const Mock = forwardRef<{ tag: "mock" }, Record<string, unknown>>((props, ref) => {
    received.props = props;
    received.refValue = ref;
    const { children } = props as { children?: unknown };
    return <>{children as never}</>;
  });
  Mock.displayName = name;
  return { Mock, received };
}

describe("createSlotRecipeContext", () => {
  describe("useClassNames", () => {
    it("throws when used outside a ClassNamesProvider", () => {
      const { useClassNames } = createSlotRecipeContext(mockSlotRecipe);

      expect(() => renderHook(() => useClassNames())).toThrow(
        /useClassNames must be used within a ClassNamesProvider/,
      );
    });

    it("returns the provided classnames inside ClassNamesProvider", () => {
      const { useClassNames, ClassNamesProvider } = createSlotRecipeContext(mockSlotRecipe);
      const value: MockClassnames = { root: "custom-root", label: "custom-label" };

      const { result } = renderHook(() => useClassNames(), {
        wrapper: ({ children }) => (
          <ClassNamesProvider value={value}>{children}</ClassNamesProvider>
        ),
      });

      expect(result.current).toEqual(value);
    });
  });

  describe("useProps", () => {
    it("returns null outside of PropsProvider", () => {
      const { useProps } = createSlotRecipeContext(mockSlotRecipe);
      const { result } = renderHook(() => useProps());

      expect(result.current).toBeNull();
    });

    it("returns the provided value inside PropsProvider", () => {
      const { useProps, PropsProvider } = createSlotRecipeContext(mockSlotRecipe);
      const { result } = renderHook(() => useProps(), {
        wrapper: ({ children }) => (
          <PropsProvider value={{ variant: "b" }}>{children}</PropsProvider>
        ),
      });

      expect(result.current).toEqual({ variant: "b" });
    });
  });

  describe("withRootProvider", () => {
    it("injects classnames into context without applying className on the root element", () => {
      const { Mock: Root, received: rootReceived } = createMock("Root");
      const { Mock: Child, received: childReceived } = createMock("Child");
      const { withRootProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);

      const StyledRoot = withRootProvider<MockVariantProps>(Root);
      const StyledLabel = withContext<{ tag: "mock" }, Record<string, unknown>>(Child, "label");

      render(
        <StyledRoot variant="b">
          <StyledLabel />
        </StyledRoot>,
      );

      expect(rootReceived.props).not.toHaveProperty("className");
      expect(childReceived.props?.className).toBe("label-b");
    });
  });

  describe("withProvider", () => {
    it("applies slot className to the provider element and injects context", () => {
      const { Mock: Root, received: rootReceived } = createMock("Root");
      const { Mock: Child, received: childReceived } = createMock("Child");
      const { withProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);

      const StyledRoot = withProvider<{ tag: "mock" }, MockVariantProps>(Root, "root");
      const StyledLabel = withContext<{ tag: "mock" }, Record<string, unknown>>(Child, "label");

      render(
        <StyledRoot variant="a">
          <StyledLabel />
        </StyledRoot>,
      );

      expect(rootReceived.props?.className).toBe("root-a");
      expect(childReceived.props?.className).toBe("label-a");
    });

    it("merges user-provided className with the slot className", () => {
      const { Mock: Root, received: rootReceived } = createMock("Root");
      const { withProvider } = createSlotRecipeContext(mockSlotRecipe);
      type StyledProps = MockVariantProps & { className?: string };
      const StyledRoot = withProvider<{ tag: "mock" }, StyledProps>(Root, "root");

      render(<StyledRoot variant="a" className="extra" />);

      expect(rootReceived.props?.className).toBe("root-a extra");
    });

    it("forwards the ref to the provider element", () => {
      const { Mock: Root, received } = createMock("Root");
      const { withProvider } = createSlotRecipeContext(mockSlotRecipe);
      const StyledRoot = withProvider<{ tag: "mock" }, MockVariantProps>(Root, "root");
      const refFn = (node: { tag: "mock" } | null) => {
        received.refValue = node;
      };

      render(<StyledRoot ref={refFn} variant="a" />);

      expect(received.refValue).toBe(refFn);
    });

    it("prefers innerProps over PropsProvider and defaultProps", () => {
      const { Mock: Root, received } = createMock("Root");
      const { withProvider, PropsProvider } = createSlotRecipeContext(mockSlotRecipe);
      const StyledRoot = withProvider<{ tag: "mock" }, MockVariantProps>(Root, "root", {
        defaultProps: { variant: "a" },
      });

      render(
        <PropsProvider value={{ variant: "a" }}>
          <StyledRoot variant="b" />
        </PropsProvider>,
      );

      expect(received.props?.className).toBe("root-b");
    });
  });

  describe("withContext", () => {
    it("reads slot className from ClassNamesProvider", () => {
      const { Mock: Label, received } = createMock("Label");
      const { ClassNamesProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);
      const StyledLabel = withContext<{ tag: "mock" }, Record<string, unknown>>(Label, "label");
      const classNames: MockClassnames = { root: "r", label: "custom-label" };

      render(
        <ClassNamesProvider value={classNames}>
          <StyledLabel />
        </ClassNamesProvider>,
      );

      expect(received.props?.className).toBe("custom-label");
    });

    it("merges user-provided className with slot className", () => {
      const { Mock: Label, received } = createMock("Label");
      const { ClassNamesProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);
      type StyledProps = { className?: string };
      const StyledLabel = withContext<{ tag: "mock" }, StyledProps>(Label, "label");

      render(
        <ClassNamesProvider value={{ root: "r", label: "l" }}>
          <StyledLabel className="extra" />
        </ClassNamesProvider>,
      );

      expect(received.props?.className).toBe("l extra");
    });

    it("passes through native props like data attributes", () => {
      const { Mock: Label, received } = createMock("Label");
      const { ClassNamesProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);
      type StyledProps = { "data-testid"?: string };
      const StyledLabel = withContext<{ tag: "mock" }, StyledProps>(Label, "label");

      render(
        <ClassNamesProvider value={{ root: "r", label: "l" }}>
          <StyledLabel data-testid="hello" />
        </ClassNamesProvider>,
      );

      expect(received.props?.["data-testid"]).toBe("hello");
    });

    it("renders without a slot className when slot argument is omitted", () => {
      const { Mock: Label, received } = createMock("Label");
      const { ClassNamesProvider, withContext } = createSlotRecipeContext(mockSlotRecipe);
      const StyledLabel = withContext<{ tag: "mock" }, Record<string, unknown>>(Label);

      render(
        <ClassNamesProvider value={{ root: "r", label: "l" }}>
          <StyledLabel />
        </ClassNamesProvider>,
      );

      // clsx(undefined, undefined) → ""
      expect(received.props?.className).toBe("");
    });
  });

  describe("withViewContext / withTextContext", () => {
    it("renders a <view> with slot className from ClassNamesProvider", () => {
      const { ClassNamesProvider, withViewContext } = createSlotRecipeContext(mockSlotRecipe);
      const StyledHeader = withViewContext("root");

      const { container } = render(
        <ClassNamesProvider value={{ root: "cls-root", label: "cls-label" }}>
          <StyledHeader />
        </ClassNamesProvider>,
      );

      const viewEl = container.querySelector("view");
      expect(viewEl).not.toBeNull();
      expect(viewEl?.getAttribute("class")).toBe("cls-root");
    });

    it("merges user-provided className with slot className on <view>", () => {
      const { ClassNamesProvider, withViewContext } = createSlotRecipeContext(mockSlotRecipe);
      const StyledHeader = withViewContext("root");

      const { container } = render(
        <ClassNamesProvider value={{ root: "cls-root", label: "cls-label" }}>
          <StyledHeader className="extra" />
        </ClassNamesProvider>,
      );

      const viewEl = container.querySelector("view");
      expect(viewEl?.getAttribute("class")).toBe("cls-root extra");
    });

    it("renders a <text> with slot className from ClassNamesProvider", () => {
      const { ClassNamesProvider, withTextContext } = createSlotRecipeContext(mockSlotRecipe);
      const StyledLabel = withTextContext("label");

      const { container } = render(
        <ClassNamesProvider value={{ root: "cls-root", label: "cls-label" }}>
          <StyledLabel />
        </ClassNamesProvider>,
      );

      const textEl = container.querySelector("text");
      expect(textEl).not.toBeNull();
      expect(textEl?.getAttribute("class")).toBe("cls-label");
    });

    it("throws when used outside a ClassNamesProvider", () => {
      const { withViewContext } = createSlotRecipeContext(mockSlotRecipe);
      const StyledHeader = withViewContext("root");

      expect(() => render(<StyledHeader />)).toThrow(
        /useClassNames must be used within a ClassNamesProvider/,
      );
    });
  });
});
