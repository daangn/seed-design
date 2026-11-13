import { nextListItem } from "@seed-design/css/recipes/next-list-item";
import { SCALE_FEEDBACK_CLASS_NAME } from "@seed-design/css/scale-feedback";
import { RadioGroup as RadioGroupPrimitive } from "@seed-design/react-radio-group";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import {
  NextListAnchorItem,
  NextListButtonItem,
  NextListCheckboxItem,
  NextListContent,
  NextListItem,
  NextListRadioItem,
  NextListSwitchItem,
  NextListTitle,
} from "./NextList";

const classNames = nextListItem();

const content = (
  <NextListContent>
    <NextListTitle>title</NextListTitle>
  </NextListContent>
);

function expectLayoutBox(root: Element | null) {
  const layout = root?.firstElementChild;

  expect(layout).toHaveClass("seed-content-scale");
  expect(layout).toHaveClass(classNames.layout);
  expect(layout?.textContent).toBe("title");
}

describe("NextListItem", () => {
  it("renders the layout as the content scale box without measuring the root", () => {
    const { container } = render(<NextListItem>{content}</NextListItem>);

    const root = container.firstElementChild;

    expect(root?.tagName).toBe("LI");
    expect(root).not.toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
    expectLayoutBox(root);
  });
});

describe.each([
  ["NextListButtonItem", NextListButtonItem],
  ["NextListAnchorItem", NextListAnchorItem],
] as const)("%s", (_, Item) => {
  it("measures the li root and renders the layout as the content scale box", () => {
    const rootRef = React.createRef<HTMLLIElement>();
    const { container } = render(<Item rootRef={rootRef}>{content}</Item>);

    const root = container.firstElementChild;

    expect(root?.tagName).toBe("LI");
    expect(root).toHaveClass(classNames.root);
    expect(root).toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
    expect(rootRef.current).toBe(root as HTMLLIElement);
    expectLayoutBox(root);
  });
});

describe.each([
  [
    "NextListCheckboxItem",
    (rootRef: React.Ref<HTMLLabelElement>) => (
      <NextListCheckboxItem rootRef={rootRef}>{content}</NextListCheckboxItem>
    ),
  ],
  [
    "NextListSwitchItem",
    (rootRef: React.Ref<HTMLLabelElement>) => (
      <NextListSwitchItem rootRef={rootRef}>{content}</NextListSwitchItem>
    ),
  ],
  [
    "NextListRadioItem",
    (rootRef: React.Ref<HTMLLabelElement>) => (
      <RadioGroupPrimitive.Root defaultValue="a">
        <NextListRadioItem rootRef={rootRef} value="a">
          {content}
        </NextListRadioItem>
      </RadioGroupPrimitive.Root>
    ),
  ],
] as const)("%s", (_, renderItem) => {
  it("measures the label root and renders the layout as the content scale box", () => {
    const rootRef = React.createRef<HTMLLabelElement>();
    const { container } = render(renderItem(rootRef));

    const root = container.querySelector("label");

    expect(root).toHaveClass(classNames.root);
    expect(root).toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
    expect(rootRef.current).toBe(root);
    expectLayoutBox(root);
  });
});
