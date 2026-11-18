import { selectBox } from "@seed-design/css/recipes/select-box";
import { SCALE_FEEDBACK_CLASS_NAME } from "@seed-design/css/scale-feedback";
import { RadioGroup as RadioGroupPrimitive } from "@seed-design/react-radio-group";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import { CheckSelectBoxLabel, CheckSelectBoxRoot } from "./CheckSelectBox";
import { RadioSelectBoxItem, RadioSelectBoxLabel } from "./RadioSelectBox";

const classNames = selectBox({ layout: "horizontal" });

// The footer provider only wraps the children when the footer collapses, so every case below
// runs against both `footerVisibility` branches — the default one is where the provider used to
// hide the `Slottable` from `Slot`.
const footerVisibilities = ["when-selected", "always"] as const;

describe("CheckSelectBoxRoot", () => {
  for (const footerVisibility of footerVisibilities) {
    describe(`footerVisibility="${footerVisibility}"`, () => {
      it("renders a label carrying the recipe and scale feedback classes", () => {
        const ref = React.createRef<HTMLLabelElement>();
        const { container } = render(
          <CheckSelectBoxRoot footerVisibility={footerVisibility} ref={ref}>
            <CheckSelectBoxLabel>label</CheckSelectBoxLabel>
          </CheckSelectBoxRoot>,
        );

        const root = container.firstElementChild;

        expect(root?.tagName).toBe("LABEL");
        expect(root).toHaveClass(classNames.root);
        expect(root).toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
        expect(ref.current).toBe(root as HTMLLabelElement);
      });

      it("makes the content scale box the element's only child", () => {
        const { container } = render(
          <CheckSelectBoxRoot footerVisibility={footerVisibility}>
            <CheckSelectBoxLabel>label</CheckSelectBoxLabel>
          </CheckSelectBoxRoot>,
        );

        const root = container.firstElementChild;

        expect(root?.childNodes.length).toBe(1);
        expect(root?.firstElementChild).toHaveClass("seed-content-scale");
        expect(root?.firstElementChild?.textContent).toBe("label");
      });

      it("renders the asChild element as the root and wraps its children in the box", () => {
        const ref = React.createRef<HTMLLabelElement>();
        const childRef = React.createRef<HTMLElement>();
        const { container } = render(
          <CheckSelectBoxRoot asChild footerVisibility={footerVisibility} ref={ref}>
            <article className="consumer" ref={childRef}>
              <CheckSelectBoxLabel>label</CheckSelectBoxLabel>
            </article>
          </CheckSelectBoxRoot>,
        );

        const root = container.firstElementChild;

        expect(container.childNodes.length).toBe(1);
        expect(root?.tagName).toBe("ARTICLE");
        expect(root).toHaveClass("consumer");
        expect(root).toHaveClass(classNames.root);
        expect(root).toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
        expect(ref.current).toBe(root as HTMLLabelElement);
        expect(childRef.current).toBe(root as HTMLElement);
        expect(root?.childNodes.length).toBe(1);
        expect(root?.firstElementChild).toHaveClass("seed-content-scale");
        expect(root?.firstElementChild?.textContent).toBe("label");
      });
    });
  }
});

describe("RadioSelectBoxItem", () => {
  const renderItem = (ui: React.ReactNode) =>
    render(<RadioGroupPrimitive.Root defaultValue="a">{ui}</RadioGroupPrimitive.Root>);

  for (const footerVisibility of footerVisibilities) {
    describe(`footerVisibility="${footerVisibility}"`, () => {
      it("renders a label carrying the recipe and scale feedback classes", () => {
        const ref = React.createRef<HTMLLabelElement>();
        const { container } = renderItem(
          <RadioSelectBoxItem footerVisibility={footerVisibility} ref={ref} value="a">
            <RadioSelectBoxLabel>label</RadioSelectBoxLabel>
          </RadioSelectBoxItem>,
        );

        const root = container.querySelector("label");

        expect(root).toHaveClass(classNames.root);
        expect(root).toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
        expect(ref.current).toBe(root as HTMLLabelElement);
      });

      it("makes the content scale box the element's only child", () => {
        const { container } = renderItem(
          <RadioSelectBoxItem footerVisibility={footerVisibility} value="a">
            <RadioSelectBoxLabel>label</RadioSelectBoxLabel>
          </RadioSelectBoxItem>,
        );

        const root = container.querySelector("label");

        expect(root?.childNodes.length).toBe(1);
        expect(root?.firstElementChild).toHaveClass("seed-content-scale");
        expect(root?.firstElementChild?.textContent).toBe("label");
      });

      it("renders the asChild element as the root and wraps its children in the box", () => {
        const ref = React.createRef<HTMLLabelElement>();
        const childRef = React.createRef<HTMLElement>();
        const { container } = renderItem(
          <RadioSelectBoxItem asChild footerVisibility={footerVisibility} ref={ref} value="a">
            <article className="consumer" ref={childRef}>
              <RadioSelectBoxLabel>label</RadioSelectBoxLabel>
            </article>
          </RadioSelectBoxItem>,
        );

        const root = container.querySelector("article");

        expect(container.querySelector("label")).toBeNull();
        expect(root).toHaveClass("consumer");
        expect(root).toHaveClass(classNames.root);
        expect(root).toHaveClass(SCALE_FEEDBACK_CLASS_NAME);
        expect(ref.current).toBe(root as HTMLLabelElement);
        expect(childRef.current).toBe(root as HTMLElement);
        expect(root?.childNodes.length).toBe(1);
        expect(root?.firstElementChild).toHaveClass("seed-content-scale");
        expect(root?.firstElementChild?.textContent).toBe("label");
      });
    });
  }
});
