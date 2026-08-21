import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { createRecipeContext } from "./createRecipeContext";

type TestRecipeProps = {
  active?: boolean;
};

let receivedProps: TestRecipeProps | undefined;

const testRecipe = Object.assign(
  (props?: TestRecipeProps) => {
    receivedProps = props;
    return "root";
  },
  {
    splitVariantProps: <T extends TestRecipeProps>(props: T) =>
      [props, {} as Omit<T, keyof TestRecipeProps>] as [
        TestRecipeProps,
        Omit<T, keyof TestRecipeProps>,
      ],
  },
);

const { PropsProvider, withContext } = createRecipeContext(testRecipe);
const Root = withContext<unknown, TestRecipeProps>(() => null, {
  defaultProps: { active: true },
});

describe("createRecipeContext", () => {
  it("restores default props overwritten with undefined", () => {
    render(<Root active={undefined} />);

    expect(receivedProps).toMatchObject({ active: true });
  });

  it("restores default props overwritten with undefined context props", () => {
    render(
      <PropsProvider value={{ active: undefined }}>
        <Root />
      </PropsProvider>,
    );

    expect(receivedProps).toMatchObject({ active: true });
  });

  it("preserves explicitly provided false values", () => {
    render(<Root active={false} />);

    expect(receivedProps).toMatchObject({ active: false });
  });
});
