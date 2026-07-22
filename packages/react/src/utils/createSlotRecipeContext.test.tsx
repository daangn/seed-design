import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { createSlotRecipeContext } from "./createSlotRecipeContext";

type TestRecipeProps = {
  lazyMount?: boolean;
  unmountOnExit?: boolean;
};

type TestClassNames = {
  root: string;
};

let receivedProps: TestRecipeProps | undefined;

const testRecipe = Object.assign(
  (props?: TestRecipeProps): TestClassNames => {
    receivedProps = props;
    return { root: "root" };
  },
  {
    splitVariantProps: <T extends TestRecipeProps>(props: T) =>
      [props, {} as Omit<T, keyof TestRecipeProps>] as [
        TestRecipeProps,
        Omit<T, keyof TestRecipeProps>,
      ],
  },
);

const { PropsProvider, withProvider, withRootProvider } = createSlotRecipeContext(testRecipe);
const Root = withRootProvider<TestRecipeProps>(() => null, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});
const Slot = withProvider<unknown, TestRecipeProps>(() => null, "root", {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

describe("createSlotRecipeContext", () => {
  describe("withRootProvider", () => {
    it("restores default props overwritten with undefined", () => {
      render(<Root lazyMount={undefined} unmountOnExit={undefined} />);

      expect(receivedProps).toMatchObject({
        lazyMount: true,
        unmountOnExit: true,
      });
    });

    it("restores default props overwritten with undefined context props", () => {
      render(
        <PropsProvider value={{ lazyMount: undefined, unmountOnExit: undefined }}>
          <Root />
        </PropsProvider>,
      );

      expect(receivedProps).toMatchObject({
        lazyMount: true,
        unmountOnExit: true,
      });
    });

    it("preserves explicitly provided false values", () => {
      render(<Root lazyMount={false} unmountOnExit={false} />);

      expect(receivedProps).toMatchObject({
        lazyMount: false,
        unmountOnExit: false,
      });
    });
  });

  describe("withProvider", () => {
    it("restores default props overwritten with undefined context props", () => {
      render(
        <PropsProvider value={{ lazyMount: undefined, unmountOnExit: undefined }}>
          <Slot />
        </PropsProvider>,
      );

      expect(receivedProps).toMatchObject({
        lazyMount: true,
        unmountOnExit: true,
      });
    });
  });
});
