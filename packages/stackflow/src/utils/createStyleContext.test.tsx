import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { createStyleContext } from "./createStyleContext";

type TestRecipeProps = {
  active?: boolean;
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

const { PropsProvider, withProvider, withRootProvider } = createStyleContext(testRecipe);
const Root = withRootProvider<TestRecipeProps>(() => null, {
  defaultProps: { active: true },
});
const Slot = withProvider<unknown, TestRecipeProps>(() => null, "root", {
  defaultProps: { active: true },
});

describe("createStyleContext", () => {
  it("restores default props overwritten with undefined", () => {
    render(<Root active={undefined} />);

    expect(receivedProps).toMatchObject({ active: true });
  });

  it("restores default props overwritten with undefined context props", () => {
    render(
      <PropsProvider value={{ active: undefined }}>
        <Slot />
      </PropsProvider>,
    );

    expect(receivedProps).toMatchObject({ active: true });
  });

  it("preserves explicitly provided false values", () => {
    render(<Root active={false} />);

    expect(receivedProps).toMatchObject({ active: false });
  });
});
